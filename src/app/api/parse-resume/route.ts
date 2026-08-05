import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI, Type } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function cleanText(t: string) {
  return t.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export async function POST(req: NextRequest) {
  let reservedUserId: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const uRes = await tx.$queryRaw<{ id: string; plan: string; monthlyParseCount: number; lastMonthlyReset: Date; planExpiresAt: Date | null }[]>`
        SELECT id, plan, "monthlyParseCount", "lastMonthlyReset", "planExpiresAt"
        FROM "resumeforge"."User" 
        WHERE email = ${session.user.email} 
        FOR UPDATE
      `;
      const u = uRes[0];
      if (!u) return { error: "User not found", status: 404 };

      const now = new Date();
      let currentCount = u.monthlyParseCount;
      
      if (u.lastMonthlyReset) {
        const lastReset = new Date(u.lastMonthlyReset);
        if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
          currentCount = 0;
        }
      } else {
        currentCount = 0;
      }

      // JIT Expiration Check
     // JIT Expiration Check
let effectivePlan = u.plan;
if (u.plan === "PRO" && u.planExpiresAt) {
  const expiresAt = new Date(u.planExpiresAt);
  if (expiresAt < now) {
    effectivePlan = "FREE";
  }
}

// ======================================================
// DEBUG LOGS
// ======================================================
console.log("========================================");
console.log("PARSE LIMIT CHECK");
console.log("User:", session.user.email);
console.log("Plan in DB:", u.plan);
console.log("Effective Plan:", effectivePlan);
console.log("Monthly Parse Count (DB):", u.monthlyParseCount);
console.log("Current Count:", currentCount);
console.log("Last Monthly Reset:", u.lastMonthlyReset);
console.log("Plan Expires At:", u.planExpiresAt);
console.log(
  "Limit Reached:",
  effectivePlan === "FREE" && currentCount >= 5
);
console.log("========================================");

if (effectivePlan === "FREE" && currentCount >= 5) {
  console.log("Returning LIMIT_REACHED (403)");
  return { error: "LIMIT_REACHED", status: 403 };
}
      // Eagerly increment to prevent race conditions during the slow Gemini API call
      await tx.user.update({
        where: { id: u.id },
        data: {
          monthlyParseCount: currentCount + 1,
          lastMonthlyReset: now,
        }
      });

      return { success: true, user: u };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    
    if (!result.user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    reservedUserId = result.user.id;

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
    const formatDescriptionToHTML = (desc: unknown) => {
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
    const processItems = (arr: unknown[]) => (arr || []).map((item: unknown) => {
      const newItem = { ...(item as Record<string, unknown>), id: crypto.randomUUID() } as Record<string, unknown>;
      if (typeof newItem.description === 'string') {
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

    // Usage was already eagerly incremented safely in the transaction above.

    console.log("======================================================");
    console.log("STAGE 1: Gemini Response (Raw JSON)");
    console.log("Summary:", !!parsedData.summary);
    console.log("Experience Length:", (parsedData.experience || []).length);
    console.log("Education Length:", (parsedData.education || []).length);
    console.log("Skills Length:", (parsedData.skills || []).length);
    console.log("Projects Length:", (parsedData.projects || []).length);
    console.log("CustomSections Length:", 0);
    console.log("======================================================");

    return NextResponse.json({ success: true, parsed: finalParsed });
  } catch (err: unknown) {
    console.error("PDF parse error:", err);
    
    // Rollback the eager increment if the parsing fails
    if (typeof reservedUserId === "string") {
      try {
        await prisma.user.update({
          where: { id: reservedUserId },
          data: { monthlyParseCount: { decrement: 1 } }
        });
      } catch (rollbackErr) {
        console.error("Failed to rollback usage limit:", rollbackErr);
      }
    }

    return NextResponse.json({ error: "Failed to parse PDF: " + ((err as Error)?.message || "unknown error") }, { status: 500 });
  }
}
