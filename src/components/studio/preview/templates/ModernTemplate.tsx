/* eslint-disable @next/next/no-img-element */
import { ResumeData } from "@/lib/types/resume";

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { contact, experience, customSections, sectionOrder, sectionVisibility } = data;

  // Render a clean, modern aesthetic
  // Font sizes are deliberately small (e.g. text-[10px]) because the preview container 
  // is scaled and standard web fonts are too large for a typical A4 PDF output.

  const cleanDescription = (html: string | undefined) => {
    if (!html) return "";
    let clean = html;
    
    if (clean.includes('<br')) {
      clean = clean.replace(/<br\s*\/?>/gi, '\n');
    }

    if (!clean.includes('<li>')) {
      clean = clean.replace(/<\/p>\s*<p[^>]*>/gi, '\n');
      clean = clean.replace(/<\/?p[^>]*>/gi, '');
      
      const lines = clean.split('\n');
      let inList = false;
      let newHtml = '';
      
      for (const line of lines) {
        let trimmed = line.trim();
        if (!trimmed) continue;
        
        trimmed = trimmed.replace(/^(?:&middot;|&bull;|&#183;|&#8226;|˚|°|◦|·|•)\s*/i, '• ');
        const match = trimmed.match(/^[-*•·◦▪■●○–—˚°]\s*(.*)/) || trimmed.match(/^[^a-zA-Z0-9\s"'\(\[\{<]\s*(.*)/);
        
        if (match) {
          if (!inList) { newHtml += '<ul>'; inList = true; }
          else { newHtml += '</li>'; }
          newHtml += `<li>${match[1]}`;
        } else {
          if (inList) { 
            newHtml += ` ${trimmed}`;
          } else {
            newHtml += `<p>${trimmed}</p>`;
          }
        }
      }
      if (inList) newHtml += '</li></ul>';
      clean = newHtml || clean;
    }
    
    if (clean.includes('<li>')) {
      clean = clean.replace(/<li>\s*(?:&middot;|&bull;|&#183;|&#8226;|˚|°|◦|·|•|-|\*|▪|■|●|○|–|—)\s*(.*?)<\/li>/gi, '<li>$1</li>');
    }

    // CONVERT TO HTML2CANVAS-SAFE FLEXBOX
    // This bypasses all html2canvas rendering bugs for native CSS lists and pseudo-elements
    clean = clean.replace(/<ul[^>]*>/gi, '<div class="flex flex-col gap-1 mt-1.5 mb-1.5">');
    clean = clean.replace(/<\/ul>/gi, '</div>');
    clean = clean.replace(/<li[^>]*>(.*?)<\/li>/gi, '<div class="flex items-start"><span class="mr-2.5 mt-[1px] font-bold text-[12px] opacity-80 leading-relaxed">•</span><div class="flex-1 leading-relaxed">$1</div></div>');

    return clean;
  };
  
  const renderExperience = () => {
    if (!experience || experience.length === 0) {
      return (
        <section>
          <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">
            Experience
          </h3>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-[13px] font-bold text-slate-800">Software Engineer</h4>
              <span className="text-[11px] text-slate-500 font-medium italic">
                Jan 2020 — Present
              </span>
            </div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] text-blue-600 font-medium">Acme Corp</span>
              <span className="text-[11px] text-slate-500">New York, NY</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap">
              Developed and maintained core systems.
            </p>
          </div>
        </section>
      );
    }
    return (
      <section>
        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">
          Experience
        </h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[13px] font-bold text-slate-800">{exp.position || "Position Title"}</h4>
                <span className="text-[11px] text-slate-500 font-medium italic mt-[2px]">
                  {exp.startDate || "Start Date"} {((exp.startDate || "Start") && (exp.endDate || exp.current || "End")) && "—"} {exp.current ? "Present" : (exp.endDate || "End Date")}
                </span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[12px] text-blue-600 font-medium">{exp.company || "Company Name"}</span>
                <span className="text-[11px] text-slate-500">{exp.location || "Location"}</span>
              </div>
              <div 
                className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-ul:pl-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
                dangerouslySetInnerHTML={{ __html: cleanDescription(exp.description) || "Describe your responsibilities and achievements here." }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSections = () => {
    if (!customSections || customSections.length === 0) return null;
    
    return customSections.map((section) => (
      <section key={section.id}>
        <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">
          {section.title || "Custom Section"}
        </h3>
        <div className="space-y-4">
          {section.items && section.items.length > 0 ? section.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[13px] font-bold text-slate-800">{item.name || "Item Name"}</h4>
                <span className="text-[11px] text-slate-500 font-medium italic mt-[2px]">
                  {item.startDate} {item.startDate && item.endDate && "—"} {item.endDate}
                </span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[12px] text-blue-600 font-medium">{item.subtitle || "Subtitle"}</span>
              </div>
              <div 
                className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
                dangerouslySetInnerHTML={{ __html: cleanDescription(item.description) || "Description details here." }}
              />
            </div>
          )) : (
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[13px] font-bold text-slate-800">Example Item</h4>
                <span className="text-[11px] text-slate-500 font-medium italic mt-[2px]">
                  2023
                </span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[12px] text-blue-600 font-medium">Example Subtitle</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                Description of this custom item.
              </p>
            </div>
          )}
        </div>
      </section>
    ));
  };

  return (
    <div className="w-full h-full p-8 md:p-12 bg-white text-slate-800 flex flex-col font-sans">
      
      {/* Header / Contact */}
      <header className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center gap-6">
        {contact.photoBase64 && (
          <img 
            src={contact.photoBase64} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wider">
            {contact.fullName || "John Doe"}
          </h1>
          <h2 className="text-lg text-blue-600 font-medium mt-1">
            {contact.jobTitle || "Software Engineer"}
          </h2>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600">
            <span>{contact.email || "john.doe@example.com"}</span>
            <span>{contact.phone || "+1 (555) 123-4567"}</span>
            <span>{contact.location || "New York, NY"}</span>
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.website && <span>{contact.website}</span>}
          </div>
        </div>
      </header>

      {/* Main Content (ordered by sectionOrder) */}
      <div className="flex-1 flex flex-col gap-6">
        {sectionOrder.map(sectionId => {
          if (sectionVisibility && sectionVisibility[sectionId] === false) return null;
          
          if (sectionId === 'experience') return <div key={sectionId}>{renderExperience()}</div>;
          if (sectionId === 'customSections') return <div key={sectionId}>{renderCustomSections()}</div>;
          
          return null;
        })}
      </div>
    </div>
  );
}
