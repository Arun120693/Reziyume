import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI, Type } from "@google/genai";

function cleanText(t: string) {
  return t.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    // 1. Extract raw text from PDF
    const uint8 = new Uint8Array(await file.arrayBuffer());
    const parser = new PDFParse({ data: uint8, verbosity: 0 });
    const textResult = await parser.getText();
    await parser.destroy();
    
    const rawText = cleanText(textResult.text);

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: "Could not extract text from this PDF. It might be an image or scanned document." }, { status: 400 });
    }

    // 2. Process with Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server. Please add it to your .env file." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Define the JSON schema matching our frontend's expected format
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        contact: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING, description: "Full name of the candidate" },
            jobTitle: { type: Type.STRING, description: "Current or primary job title" },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            website: { type: Type.STRING },
          },
        },
        summary: {
          type: Type.STRING,
          description: "A professional summary or objective, typically 2-3 sentences.",
        },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              position: { type: Type.STRING },
              startDate: { type: Type.STRING, description: "e.g. Jan 2020" },
              endDate: { type: Type.STRING, description: "e.g. Dec 2022 or Present" },
              current: { type: Type.BOOLEAN, description: "True if currently working here" },
              location: { type: Type.STRING },
              description: { type: Type.STRING, description: "Bulleted or paragraph description of responsibilities" },
            },
            required: ["company", "position"],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              school: { type: Type.STRING },
              degree: { type: Type.STRING },
              fieldOfStudy: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["school", "degree"],
          },
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING, description: "e.g. Beginner, Intermediate, Expert" },
            },
            required: ["name"],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              url: { type: Type.STRING },
              technologies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["name"],
          },
        },
      },
    };

    const prompt = `You are an expert resume parser. I will provide you with the raw extracted text from a PDF resume.
Your task is to meticulously extract the data and structure it into the provided JSON schema.
Ensure you categorize the data correctly into contact information, summary, work experience, education, skills, and projects.
If a piece of information is missing, leave it as an empty string or empty array.
If the resume uses non-standard headings, do your best to infer the correct category.
CRITICAL FORMATTING INSTRUCTION: For any 'description' fields (like in experience, education, or projects), if the original resume uses bullet points, you MUST format the output as an HTML <ul> list with <li> items. If it uses paragraphs, use <p> tags. Do NOT use markdown.
RAW RESUME TEXT:
----------------
${rawText}
----------------
`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Helper to format newlines or markdown bullets into proper HTML for the frontend
    const formatDescriptionToHTML = (desc: any) => {
      if (!desc) return "";
      
      // If Gemini somehow returned an array of strings
      if (Array.isArray(desc)) {
        return `<ul>${desc.map(d => `<li>${d}</li>`).join('')}</ul>`;
      }
      
      if (typeof desc !== 'string') return "";
      
      if (desc.includes('<ul>') || desc.includes('<p>')) return desc; // Already HTML
      const lines = desc.split('\n').map((l: string) => l.trim()).filter(Boolean);
      if (lines.length > 1 || lines[0]?.match(/^[-*•]/)) {
        const listItems = lines.map((l: string) => `<li>${l.replace(/^[-*•]\s*/, '')}</li>`);
        return `<ul>${listItems.join('')}</ul>`;
      }
      return `<p>${desc}</p>`;
    };

    // Add unique IDs and format descriptions
    const processItems = (arr: any[]) => (arr || []).map((item: any) => {
      const newItem = { ...item, id: crypto.randomUUID() };
      if (newItem.description) {
        newItem.description = formatDescriptionToHTML(newItem.description);
      }
      return newItem;
    });

    const finalParsed = {
      contact: parsedData.contact || {},
      summary: (parsedData.summary || "").substring(0, 600) + (parsedData.summary?.length > 600 ? "..." : ""),
      experience: processItems(parsedData.experience),
      education: processItems(parsedData.education),
      skills: processItems(parsedData.skills),
      projects: processItems(parsedData.projects),
    };

    return NextResponse.json({ success: true, parsed: finalParsed });
  } catch (err: any) {
    console.error("PDF parse error:", err);
    return NextResponse.json({ error: "Failed to parse PDF: " + (err?.message || "unknown error") }, { status: 500 });
  }
}
