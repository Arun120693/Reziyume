import React from "react";
import { ResumeData, hasProfilePhoto } from "@/lib/types/resume";
import { TemplateConfig } from "./registry";

export function CoreTemplate({ data, config }: { data: ResumeData; config: TemplateConfig }) {
  const { layout, colors, fonts, styles } = config;

  // Utility to determine if a section has content
  const hasContent = (section: any) => {
    if (Array.isArray(section)) return section.length > 0;
    return !!section;
  };

  const formatting = data.formatting;
  const activeColors = { ...colors, primary: formatting?.accentColor || colors.primary };

  // Base styling for the container
  const containerStyle: React.CSSProperties = {
    backgroundColor: activeColors.background,
    color: activeColors.text,
    fontFamily: formatting?.fontFamily || undefined,
    fontSize: formatting?.fontSize === 'small' ? '11px' : formatting?.fontSize === 'large' ? '15px' : '13px',
    padding: formatting?.margins === 'narrow' ? '24px' : formatting?.margins === 'wide' ? '64px' : '48px',
  };

  const getSpacingClass = () => {
    switch (styles.spacing) {
      case 'compact': return 'space-y-1.5';
      case 'relaxed': return 'space-y-4';
      case 'normal':
      default: return 'space-y-3';
    }
  };

  // Generic Heading Component based on config
  const SectionHeading = ({ title }: { title: string }) => {
    if (styles.headingStyle === 'solid-bg') {
      return (
        <div 
          className="flex items-center mb-2" 
          style={{ 
            backgroundColor: activeColors.primary,
            height: '28px', // Fixed height for the coloured bar
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
          }}
        >
          <div 
            className={`text-base font-bold m-0 p-0 block ${fonts.heading}`} 
            style={{ 
              color: activeColors.background, 
              lineHeight: 'normal' // Natural line height prevents ascender clipping in html2canvas
            }}
          >
            {title}
          </div>
        </div>
      );
    }

    let baseClass = `text-base font-bold mb-2 block ${fonts.heading} `;
    let styleObj: React.CSSProperties = { color: activeColors.primary, lineHeight: 'normal' };

    if (styles.headingStyle === 'underlined') {
      styleObj.borderBottom = `2px solid ${activeColors.primary}`;
      baseClass += ' pb-1 ';
    } else if (styles.headingStyle === 'uppercase') {
      baseClass += ' uppercase tracking-wider ';
    }

    return (
      <div className={baseClass} style={styleObj}>
        {title}
      </div>
    );
  };

  // Sections
  const renderContact = () => (
    <div className={`flex flex-wrap gap-3 text-[11px] mt-1.5 ${layout === 'centered' ? 'justify-center' : ''}`} style={{ color: activeColors.secondaryText }}>
      {data.contact.email && <div className="flex items-center gap-1">✉ {data.contact.email}</div>}
      {data.contact.phone && <div className="flex items-center gap-1">☎ {data.contact.phone}</div>}
      {data.contact.location && <div className="flex items-center gap-1">📍 {data.contact.location}</div>}
      {data.contact.linkedin && <div className="flex items-center gap-1">in {data.contact.linkedin}</div>}
      {data.contact.website && <div className="flex items-center gap-1">🌐 {data.contact.website}</div>}
      {(!data.contact.email && !data.contact.phone && !data.contact.location && !data.contact.linkedin && !data.contact.website) && (
        <div className="opacity-40 italic print:hidden">Contact details will appear here</div>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className={`flex items-center gap-6 ${layout === 'centered' ? 'flex-col text-center' : 'flex-row'}`}>
      {hasProfilePhoto(data) && (
        <img 
          src={data.contact.photoBase64} 
          alt={data.contact.fullName} 
          className={`w-20 h-20 object-cover ${styles.roundedPhoto ? 'rounded-full' : 'rounded-md'}`}
          style={{ border: `2px solid ${activeColors.primary}` }}
        />
      )}
      <div>
        <h1 className={`text-3xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
          {data.contact.fullName ? data.contact.fullName : <span className="opacity-40 italic print:hidden">Your Name</span>}
        </h1>
        <h2 className={`text-base font-medium mt-0.5 ${fonts.heading}`} style={{ color: activeColors.text }}>
          {data.contact.jobTitle ? data.contact.jobTitle : <span className="opacity-40 italic print:hidden">Professional Title</span>}
        </h2>
        {renderContact()}
      </div>
    </div>
  );

  const renderSummary = () => {
    const empty = !hasContent(data.summary);
    return (
      <div className={`mb-5 ${empty ? 'print:hidden' : ''}`}>
        <SectionHeading title="Professional Summary" />
        {empty ? (
          <div className="opacity-40 italic text-[12px] py-1">Your professional summary will appear here.</div>
        ) : (
          <p className={`text-[13px] ${fonts.body} leading-relaxed whitespace-pre-wrap`} style={{ color: activeColors.text }}>
            {data.summary}
          </p>
        )}
      </div>
    );
  };

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
    const empty = !hasContent(data.experience);
    return (
      <div className={`mb-5 ${empty ? 'print:hidden' : ''}`}>
        <SectionHeading title="Experience" />
        {empty ? (
          <div className="opacity-40 italic text-[12px] py-1">Your experience entries will appear here.</div>
        ) : (
          <div className={getSpacingClass()}>
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h4 className={`font-semibold text-[14px] ${fonts.heading}`} style={{ color: activeColors.text }}>{exp.position}</h4>
                    <div className={`text-[13px] ${fonts.body}`} style={{ color: activeColors.primary }}>{exp.company} {exp.location && `• ${exp.location}`}</div>
                  </div>
                  <div className={`text-[12px] text-right whitespace-nowrap mt-[2px] ${fonts.body}`} style={{ color: activeColors.secondaryText }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <div
                    className={`text-[13px] mt-1.5 whitespace-pre-wrap ${fonts.body} leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-ul:pl-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4`}
                    style={{ color: activeColors.secondaryText }}
                    dangerouslySetInnerHTML={{ __html: cleanDescription(exp.description) }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    const empty = !hasContent(data.education);
    return (
      <div className={`mb-5 ${empty ? 'print:hidden' : ''}`}>
        <SectionHeading title="Education" />
        {empty ? (
          <div className="opacity-40 italic text-[12px] py-1">Your education entries will appear here.</div>
        ) : (
          <div className={getSpacingClass()}>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h4 className={`font-semibold text-[14px] ${fonts.heading}`} style={{ color: activeColors.text }}>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h4>
                    <div className={`text-[13px] ${fonts.body}`} style={{ color: activeColors.primary }}>{edu.school} {edu.location && `• ${edu.location}`}</div>
                  </div>
                  <div className={`text-[12px] text-right whitespace-nowrap mt-[2px] ${fonts.body}`} style={{ color: activeColors.secondaryText }}>
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                </div>
                {edu.description && (
                  <div
                    className={`text-[13px] mt-1.5 whitespace-pre-wrap ${fonts.body} prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-ul:pl-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4`}
                    style={{ color: activeColors.secondaryText }}
                    dangerouslySetInnerHTML={{ __html: cleanDescription(edu.description) }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSkills = () => {
    const empty = !hasContent(data.skills);
    return (
      <div className={`mb-5 ${empty ? 'print:hidden' : ''}`}>
        <SectionHeading title="Skills" />
        {empty ? (
          <div className="opacity-40 italic text-[12px] py-1">Your skills will appear here.</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <div key={skill.id} className="px-2.5 py-0.5 rounded text-[13px]" style={{ backgroundColor: activeColors.border, color: activeColors.text }}>
                <span className="font-medium">{skill.name}</span>
                {skill.level && <span className="text-[11px] opacity-70 ml-1">({skill.level})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCustomSections = () => {
    if (!hasContent(data.customSections)) return null;
    return data.customSections.map(section => {
      const empty = !hasContent(section.items);
      return (
        <div key={section.id} className={`mb-5 ${empty ? 'print:hidden' : ''}`}>
          <SectionHeading title={section.title} />
          {empty ? (
            <div className="opacity-40 italic text-[12px] py-1">Items for {section.title} will appear here.</div>
          ) : (
            <div className={getSpacingClass()}>
              {(section.items || []).map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <h4 className={`font-semibold text-[14px] ${fonts.heading}`} style={{ color: activeColors.text }}>
                        {item.name}
                      </h4>
                      {item.subtitle && (
                        <div className={`text-[13px] ${fonts.body}`} style={{ color: activeColors.primary }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    {(item.startDate || item.endDate) && (
                      <div className={`text-[12px] text-right whitespace-nowrap mt-[2px] ${fonts.body}`} style={{ color: activeColors.secondaryText }}>
                        {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <div 
                      className={`text-[12px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-ul:pl-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4`}
                      style={{ color: activeColors.secondaryText }}
                      dangerouslySetInnerHTML={{ __html: cleanDescription(item.description) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSection = (sectionId: string) => {
    if (data.sectionVisibility?.[sectionId] === false) return null;
    
    switch (sectionId) {
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return null; // Add projects later if needed
      case 'customSections': return renderCustomSections();
      default: return null;
    }
  };

  const mainContent = (
    <>
      {renderSummary()}
      {data.sectionOrder?.map((sectionId) => (
        <React.Fragment key={sectionId}>
          {renderSection(sectionId)}
        </React.Fragment>
      )) || (
        <>
          {renderSection('experience')}
          {renderSection('education')}
          {renderSection('skills')}
          {renderSection('projects')}
          {renderSection('customSections')}
        </>
      )}
    </>
  );

  const sidebarContent = (
    <>
      {renderContact()}
    </>
  );

  // Layout Renders
  if (layout === 'two-column-left') {
    return (
      <div className={`min-h-[29.7cm] w-full bg-white shadow-xl flex ${fonts.body}`} style={containerStyle}>
        <div className="w-1/3 p-10 flex flex-col gap-6" style={{ backgroundColor: activeColors.border }}>
          {hasProfilePhoto(data) && (
            <div className="flex justify-center mb-2">
              <img 
                src={data.contact.photoBase64} 
                alt={data.contact.fullName} 
                className={`w-28 h-28 object-cover ${styles.roundedPhoto ? 'rounded-full' : 'rounded-md'}`}
                style={{ border: `3px solid ${activeColors.primary}` }}
              />
            </div>
          )}
          {sidebarContent}
        </div>
        <div className="w-2/3 p-10">
          <div className="mb-6">
            <h1 className={`text-3xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
              {data.contact.fullName ? data.contact.fullName : <span className="opacity-40 italic print:hidden">Your Name</span>}
            </h1>
            <h2 className={`text-base font-medium mt-0.5 ${fonts.heading}`} style={{ color: activeColors.text }}>
              {data.contact.jobTitle ? data.contact.jobTitle : <span className="opacity-40 italic print:hidden">Professional Title</span>}
            </h2>
          </div>
          {mainContent}
        </div>
      </div>
    );
  }

  if (layout === 'two-column-right') {
    return (
      <div className={`min-h-[29.7cm] w-full bg-white shadow-xl flex ${fonts.body}`} style={containerStyle}>
        <div className="w-2/3 p-10">
          <div className="mb-6 flex items-center gap-4">
            {hasProfilePhoto(data) && (
              <img 
                src={data.contact.photoBase64} 
                alt={data.contact.fullName} 
                className={`w-20 h-20 object-cover ${styles.roundedPhoto ? 'rounded-full' : 'rounded-md'}`}
              />
            )}
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
                {data.contact.fullName ? data.contact.fullName : <span className="opacity-40 italic print:hidden">Your Name</span>}
              </h1>
              <h2 className={`text-base font-medium mt-0.5 ${fonts.heading}`} style={{ color: activeColors.text }}>
                {data.contact.jobTitle ? data.contact.jobTitle : <span className="opacity-40 italic print:hidden">Professional Title</span>}
              </h2>
            </div>
          </div>
          {mainContent}
        </div>
        <div className="w-1/3 p-10 flex flex-col gap-6" style={{ backgroundColor: activeColors.border }}>
          {sidebarContent}
        </div>
      </div>
    );
  }

  if (layout === 'split-header') {
    return (
      <div className={`min-h-[29.7cm] w-full bg-white shadow-xl flex flex-col ${fonts.body}`} style={containerStyle}>
        <div className="p-10 relative flex justify-center items-center" style={{ backgroundColor: activeColors.primary, color: activeColors.background }}>
          <div className="text-center">
            <h1 className={`text-3xl font-bold tracking-tight ${fonts.heading}`}>
              {data.contact.fullName ? data.contact.fullName : <span className="opacity-60 italic print:hidden">Your Name</span>}
            </h1>
            <h2 className={`text-base font-medium mt-0.5 ${fonts.heading} opacity-90`}>
              {data.contact.jobTitle ? data.contact.jobTitle : <span className="opacity-60 italic print:hidden">Professional Title</span>}
            </h2>
          </div>
          {hasProfilePhoto(data) && (
            <div className="absolute right-10">
              <img 
                src={data.contact.photoBase64} 
                alt={data.contact.fullName} 
                className={`w-20 h-20 object-cover ${styles.roundedPhoto ? 'rounded-full' : 'rounded-md'} bg-white p-1`}
              />
            </div>
          )}
        </div>
        <div className="px-10 py-6" style={{ backgroundColor: activeColors.border }}>
          <div className="flex flex-wrap gap-5 text-[11px] justify-center" style={{ color: activeColors.text }}>
            {data.contact.email && <div className="flex items-center gap-1">✉ {data.contact.email}</div>}
            {data.contact.phone && <div className="flex items-center gap-1">☎ {data.contact.phone}</div>}
            {data.contact.location && <div className="flex items-center gap-1">📍 {data.contact.location}</div>}
            {data.contact.linkedin && <div className="flex items-center gap-1">in {data.contact.linkedin}</div>}
            {(!data.contact.email && !data.contact.phone && !data.contact.location && !data.contact.linkedin) && (
              <div className="opacity-40 italic print:hidden">Contact details will appear here</div>
            )}
          </div>
        </div>
        <div className="p-10">
          {mainContent}
        </div>
      </div>
    );
  }

  // ─── PHOTO-SIDEBAR ──────────────────────────────────────────────────────
  if (layout === 'photo-sidebar') {
    const sidebarBg = activeColors.primary;
    const sidebarText = '#ffffff';
    return (
      <div className={`min-h-[29.7cm] w-full flex ${fonts.body}`} style={{ backgroundColor: activeColors.background, color: activeColors.text, fontSize: '13px' }}>
        {/* Sidebar */}
        <div className="w-[35%] flex-shrink-0 flex flex-col items-center pt-10 pb-6 px-5 gap-5" style={{ backgroundColor: sidebarBg }}>
          {/* Photo */}
          <div className="flex justify-center">
            {hasProfilePhoto(data) ? (
              <img
                src={data.contact.photoBase64}
                alt={data.contact.fullName}
                className={`w-32 h-32 object-cover shadow-lg ${styles.roundedPhoto ? 'rounded-full' : 'rounded-xl'}`}
                style={{ border: `3px solid rgba(255,255,255,0.5)` }}
              />
            ) : (
              <div className={`w-32 h-32 flex flex-col items-center justify-center text-white/40 text-[11px] gap-1 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-xl'}`} style={{ border: '3px dashed rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <span>Add Photo</span>
              </div>
            )}
          </div>
          {/* Name on sidebar */}
          <div className="text-center">
            <h1 className={`text-xl font-bold leading-tight ${fonts.heading}`} style={{ color: sidebarText }}>
              {data.contact.fullName || <span className="opacity-40 italic">Your Name</span>}
            </h1>
            <p className={`text-[12px] mt-1 opacity-80 ${fonts.heading}`} style={{ color: sidebarText }}>
              {data.contact.jobTitle || <span className="opacity-40 italic">Professional Title</span>}
            </p>
          </div>
          {/* Contact */}
          <div className="w-full space-y-2 text-[11px]" style={{ color: sidebarText }}>
            <div className="font-bold uppercase tracking-widest text-[10px] opacity-60 pb-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Contact</div>
            {data.contact.email && <div className="opacity-90 truncate">✉ {data.contact.email}</div>}
            {data.contact.phone && <div className="opacity-90">☎ {data.contact.phone}</div>}
            {data.contact.location && <div className="opacity-90">📍 {data.contact.location}</div>}
            {data.contact.linkedin && <div className="opacity-90 truncate">in {data.contact.linkedin}</div>}
            {data.contact.website && <div className="opacity-90 truncate">🌐 {data.contact.website}</div>}
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 p-8" style={{ backgroundColor: activeColors.background }}>
          {mainContent}
        </div>
      </div>
    );
  }

  // ─── PHOTO-BANNER ──────────────────────────────────────────────────────
  if (layout === 'photo-banner') {
    return (
      <div className={`min-h-[29.7cm] w-full ${fonts.body}`} style={{ backgroundColor: activeColors.background, color: activeColors.text, fontSize: '13px' }}>
        {/* Banner header */}
        <div className="flex items-center gap-6 px-10 pt-10 pb-6" style={{ borderBottom: `3px solid ${activeColors.primary}` }}>
          {hasProfilePhoto(data) ? (
            <img
              src={data.contact.photoBase64}
              alt={data.contact.fullName}
              className={`w-28 h-28 object-cover flex-shrink-0 shadow-md ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`}
              style={{ border: `3px solid ${activeColors.primary}` }}
            />
          ) : (
            <div className={`w-28 h-28 flex-shrink-0 flex flex-col items-center justify-center text-[11px] gap-1 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`} style={{ border: `3px dashed ${activeColors.primary}`, color: activeColors.primary, opacity: 0.5 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <span>Add Photo</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className={`text-4xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
              {data.contact.fullName || <span className="opacity-40 italic">Your Name</span>}
            </h1>
            <p className={`text-[15px] font-medium mt-1 mb-3 ${fonts.heading}`} style={{ color: activeColors.secondaryText }}>
              {data.contact.jobTitle || <span className="opacity-40 italic">Professional Title</span>}
            </p>
            <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: activeColors.secondaryText }}>
              {data.contact.email && <span>✉ {data.contact.email}</span>}
              {data.contact.phone && <span>☎ {data.contact.phone}</span>}
              {data.contact.location && <span>📍 {data.contact.location}</span>}
              {data.contact.linkedin && <span>in {data.contact.linkedin}</span>}
            </div>
          </div>
        </div>
        <div className="px-10 py-8">{mainContent}</div>
      </div>
    );
  }

  // ─── PHOTO-TOP-RIGHT ───────────────────────────────────────────────────
  if (layout === 'photo-top-right') {
    return (
      <div className={`min-h-[29.7cm] w-full ${fonts.body}`} style={{ backgroundColor: activeColors.background, color: activeColors.text, fontSize: '13px' }}>
        {/* Header with name left + photo right */}
        <div className="px-10 pt-10 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-4xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
                {data.contact.fullName || <span className="opacity-40 italic">Your Name</span>}
              </h1>
              <p className={`text-[15px] font-medium mt-1 mb-3 ${fonts.heading}`} style={{ color: activeColors.secondaryText }}>
                {data.contact.jobTitle || <span className="opacity-40 italic">Professional Title</span>}
              </p>
              <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: activeColors.secondaryText }}>
                {data.contact.email && <span>✉ {data.contact.email}</span>}
                {data.contact.phone && <span>☎ {data.contact.phone}</span>}
                {data.contact.location && <span>📍 {data.contact.location}</span>}
                {data.contact.linkedin && <span>in {data.contact.linkedin}</span>}
              </div>
            </div>
            {/* Photo top-right */}
            {hasProfilePhoto(data) ? (
              <img
                src={data.contact.photoBase64}
                alt={data.contact.fullName}
                className={`w-28 h-28 object-cover flex-shrink-0 shadow-md ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`}
                style={{ border: `3px solid ${activeColors.primary}` }}
              />
            ) : (
              <div className={`w-28 h-28 flex-shrink-0 flex flex-col items-center justify-center text-[11px] gap-1 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`} style={{ border: `3px dashed ${activeColors.primary}`, color: activeColors.primary, opacity: 0.5 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <span>Add Photo</span>
              </div>
            )}
          </div>
          <div style={{ height: '3px', backgroundColor: activeColors.primary, marginTop: '16px' }} />
        </div>
        <div className="px-10 py-8">{mainContent}</div>
      </div>
    );
  }

  // ─── PHOTO-CARD ────────────────────────────────────────────────────────
  if (layout === 'photo-card') {
    return (
      <div className={`min-h-[29.7cm] w-full ${fonts.body}`} style={{ backgroundColor: activeColors.background, color: activeColors.text, fontSize: '13px' }}>
        {/* Card header with gradient background */}
        <div className="px-10 pt-10 pb-8" style={{ background: `linear-gradient(135deg, ${activeColors.primary}15 0%, ${activeColors.border} 100%)` }}>
          <div className="flex items-center gap-6">
            {hasProfilePhoto(data) ? (
              <img
                src={data.contact.photoBase64}
                alt={data.contact.fullName}
                className={`w-32 h-32 object-cover flex-shrink-0 shadow-lg ${styles.roundedPhoto ? 'rounded-full' : 'rounded-2xl'}`}
                style={{ border: `4px solid ${activeColors.primary}`, outline: `3px solid ${activeColors.border}` }}
              />
            ) : (
              <div className={`w-32 h-32 flex-shrink-0 flex flex-col items-center justify-center text-[11px] gap-1 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-2xl'}`} style={{ border: `3px dashed ${activeColors.primary}`, color: activeColors.primary, backgroundColor: 'white', opacity: 0.7 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <span>Add Photo</span>
              </div>
            )}
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${fonts.heading}`} style={{ color: activeColors.primary }}>
                {data.contact.fullName || <span className="opacity-40 italic">Your Name</span>}
              </h1>
              <p className={`text-[14px] font-medium mt-1 mb-3 ${fonts.heading}`} style={{ color: activeColors.text }}>
                {data.contact.jobTitle || <span className="opacity-40 italic">Professional Title</span>}
              </p>
              <div className="flex flex-wrap gap-3 text-[11px]" style={{ color: activeColors.secondaryText }}>
                {data.contact.email && <span className="flex items-center gap-1">✉ {data.contact.email}</span>}
                {data.contact.phone && <span className="flex items-center gap-1">☎ {data.contact.phone}</span>}
                {data.contact.location && <span className="flex items-center gap-1">📍 {data.contact.location}</span>}
                {data.contact.linkedin && <span className="flex items-center gap-1">in {data.contact.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 py-8">{mainContent}</div>
      </div>
    );
  }

  // ─── PHOTO-ELEGANT ─────────────────────────────────────────────────────
  if (layout === 'photo-elegant') {
    return (
      <div className={`min-h-[29.7cm] w-full ${fonts.body}`} style={{ backgroundColor: activeColors.background, color: activeColors.text, fontSize: '13px' }}>
        {/* Centered elegant header */}
        <div className="flex flex-col items-center px-10 pt-10 pb-8 text-center">
          {hasProfilePhoto(data) ? (
            <img
              src={data.contact.photoBase64}
              alt={data.contact.fullName}
              className={`w-28 h-28 object-cover shadow-lg mb-4 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`}
              style={{ border: `3px solid ${activeColors.primary}` }}
            />
          ) : (
            <div className={`w-28 h-28 flex flex-col items-center justify-center text-[11px] gap-1 mb-4 ${styles.roundedPhoto ? 'rounded-full' : 'rounded-lg'}`} style={{ border: `3px dashed ${activeColors.primary}`, color: activeColors.primary, opacity: 0.5 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <span>Add Photo</span>
            </div>
          )}
          <h1 className={`text-3xl font-bold tracking-wide ${fonts.heading}`} style={{ color: activeColors.primary }}>
            {data.contact.fullName || <span className="opacity-40 italic">Your Name</span>}
          </h1>
          <p className={`text-[14px] font-medium tracking-widest uppercase mt-1 mb-3 ${fonts.heading}`} style={{ color: activeColors.secondaryText }}>
            {data.contact.jobTitle || <span className="opacity-40 italic normal-case">Professional Title</span>}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] mb-4" style={{ color: activeColors.secondaryText }}>
            {data.contact.email && <span>✉ {data.contact.email}</span>}
            {data.contact.phone && <span>☎ {data.contact.phone}</span>}
            {data.contact.location && <span>📍 {data.contact.location}</span>}
            {data.contact.linkedin && <span>in {data.contact.linkedin}</span>}
          </div>
          <div style={{ width: '100%', height: '2px', background: `linear-gradient(to right, transparent, ${activeColors.primary}, transparent)` }} />
        </div>
        <div className="px-10 pb-10">{mainContent}</div>
      </div>
    );
  }

  // default / single-column / centered
  return (
    <div className={`min-h-[29.7cm] w-full shadow-xl ${fonts.body}`} style={containerStyle}>
      {renderHeader()}
      <div className="mt-6">
        {mainContent}
      </div>
    </div>
  );
}

