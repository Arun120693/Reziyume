import React from 'react';

const ModernResume = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`absolute left-1/2 top-1/2 bg-white rounded-[2px] overflow-hidden flex flex-col border border-gray-200 ${className}`}
    style={{
      width: '240px',
      height: '340px',
      boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
      color: '#333',
      fontFamily: '"Inter", sans-serif',
      fontSize: '6px',
      lineHeight: '1.3',
      ...style
    }}
  >
    {/* Header with accent */}
    <div className="bg-gray-900 text-white p-4 flex flex-col gap-1">
      <h1 className="text-[11px] font-extrabold tracking-tight m-0">ALEXANDRA CHEN</h1>
      <p className="text-[7px] text-gray-300 font-medium tracking-widest uppercase m-0">Product Designer</p>
      <div className="flex gap-2 text-[5px] text-gray-400 mt-1">
        <span>New York, NY</span>
        <span>•</span>
        <span>alex.chen@design.co</span>
      </div>
    </div>
    
    <div className="flex flex-row p-3 gap-3 h-full">
      {/* Sidebar */}
      <div className="w-1/3 flex flex-col gap-3 border-r border-gray-100 pr-2">
        <div>
          <h2 className="text-[7px] font-bold text-gray-900 uppercase tracking-wider mb-1">Expertise</h2>
          <div className="flex flex-col gap-1 text-[5px] text-gray-600 font-medium">
            <span>UX/UI Design</span>
            <span>Design Systems</span>
            <span>Prototyping</span>
            <span>User Research</span>
            <span>Figma / Framer</span>
          </div>
        </div>
        <div>
          <h2 className="text-[7px] font-bold text-gray-900 uppercase tracking-wider mb-1">Education</h2>
          <h3 className="font-bold text-gray-800 text-[6px]">BFA Interaction Design</h3>
          <p className="text-[5px] text-gray-500 mb-0.5">Parsons School of Design</p>
          <p className="text-[5px] text-gray-500">2014 — 2018</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 flex flex-col gap-3">
        <div>
          <h2 className="text-[7px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1">Summary</h2>
          <p className="text-gray-600 text-[5px] leading-[1.4]">
            Award-winning product designer focused on creating intuitive, accessible, and beautiful digital experiences. Proven track record of leading design systems for enterprise SaaS platforms.
          </p>
        </div>

        <div>
          <h2 className="text-[7px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1">Experience</h2>
          
          <div className="mb-2">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-bold text-gray-800 text-[6px]">TechFlow Inc.</h3>
              <span className="text-[5px] text-gray-500">2021 — Present</span>
            </div>
            <p className="text-gray-700 font-medium mb-0.5 text-[5px]">Senior Product Designer</p>
            <ul className="list-disc pl-2 text-gray-600 space-y-0.5 text-[5px] leading-[1.3]">
              <li>Spearheaded the redesign of the core analytics dashboard, increasing user engagement by 35%.</li>
              <li>Created and maintained a comprehensive design system used by 40+ engineers.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-bold text-gray-800 text-[6px]">Creative Solutions</h3>
              <span className="text-[5px] text-gray-500">2018 — 2021</span>
            </div>
            <p className="text-gray-700 font-medium mb-0.5 text-[5px]">UX Designer</p>
            <ul className="list-disc pl-2 text-gray-600 space-y-0.5 text-[5px] leading-[1.3]">
              <li>Designed mobile-first onboarding flows reducing drop-off by 20%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClassicResume = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`absolute left-1/2 top-1/2 bg-white rounded-[2px] p-5 flex flex-col gap-2.5 border border-gray-200 ${className}`}
    style={{
      width: '240px',
      height: '340px',
      boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
      color: '#222',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '6px',
      lineHeight: '1.3',
      ...style
    }}
  >
    <div className="flex flex-col items-center border-b-[1.5px] border-gray-800 pb-2 mb-1">
      <h1 className="text-[12px] font-bold text-black uppercase tracking-widest mb-0.5">JAMES WILSON</h1>
      <p className="text-[6px] text-gray-700 tracking-wider">Chicago, IL • james.w@finance.org • (312) 555-7890</p>
    </div>
    
    <div>
      <h2 className="text-[7px] font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">Professional Profile</h2>
      <p className="text-gray-700 text-[5px] leading-[1.4] text-justify">
        Detail-oriented Financial Analyst with over 6 years of experience in corporate financial planning, variance analysis, and predictive modeling. Adept at driving operational efficiencies and delivering actionable insights to executive leadership.
      </p>
    </div>

    <div>
      <h2 className="text-[7px] font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">Professional Experience</h2>
      
      <div className="mb-2">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-gray-900 text-[6.5px]">Global Partners Group</h3>
          <span className="text-[5px] text-gray-700 italic">2019 — Present</span>
        </div>
        <p className="text-gray-800 italic mb-0.5 text-[5px]">Senior Financial Analyst</p>
        <ul className="list-disc pl-3 text-gray-700 space-y-0.5 text-[5px]">
          <li>Managed a $50M operating budget, consistently identifying cost-saving opportunities of 5% annually.</li>
          <li>Developed complex financial models for M&A valuations leading to 2 successful acquisitions.</li>
          <li>Streamlined monthly reporting processes, reducing preparation time by 15 hours per month.</li>
        </ul>
      </div>

      <div>
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-gray-900 text-[6.5px]">Apex Financial Services</h3>
          <span className="text-[5px] text-gray-700 italic">2016 — 2019</span>
        </div>
        <p className="text-gray-800 italic mb-0.5 text-[5px]">Financial Analyst</p>
        <ul className="list-disc pl-3 text-gray-700 space-y-0.5 text-[5px]">
          <li>Conducted variance analysis for quarterly earnings reports presented to the Board of Directors.</li>
          <li>Automated data extraction from SQL databases into Tableau dashboards.</li>
        </ul>
      </div>
    </div>

    <div>
      <h2 className="text-[7px] font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">Education</h2>
      <div className="flex justify-between items-baseline">
        <h3 className="font-bold text-gray-900 text-[6px]">Northwestern University</h3>
        <span className="text-[5px] text-gray-700 italic">May 2016</span>
      </div>
      <p className="text-gray-800 text-[5px]">Bachelor of Science in Finance, Cum Laude</p>
    </div>
  </div>
);

const MinimalResume = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`absolute left-1/2 top-1/2 bg-white rounded-[2px] p-6 flex flex-col gap-3 border border-gray-200 ${className}`}
    style={{
      width: '240px',
      height: '340px',
      boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
      color: '#444',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '5px',
      lineHeight: '1.4',
      ...style
    }}
  >
    <div className="mb-2">
      <h1 className="text-[14px] font-medium text-gray-900 tracking-tight m-0">Sarah Jenkins</h1>
      <p className="text-[7px] text-gray-500 font-light mt-0.5">Marketing Director</p>
      <div className="flex gap-2 text-[5px] text-gray-400 mt-1.5 font-light">
        <span>Austin, TX</span>
        <span>•</span>
        <span>sarah.j@marketing.com</span>
      </div>
    </div>
    
    <div>
      <p className="text-gray-600 font-light text-[5.5px] leading-[1.5]">
        Creative and data-driven marketing professional specializing in brand growth and digital strategy. 
        Passionate about crafting compelling narratives that resonate with global audiences.
      </p>
    </div>

    <div className="flex flex-col gap-2.5 mt-1">
      <div>
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="font-medium text-gray-900 text-[6px]">Elevate Brands</h3>
          <span className="text-[4.5px] text-gray-400">2020 — 2024</span>
        </div>
        <p className="text-gray-500 mb-1 text-[5px]">Director of Marketing</p>
        <p className="text-gray-600 text-[5px] font-light leading-[1.4]">
          Directed a cross-functional team of 12 across content, SEO, and paid media. Grew organic traffic by 150% year-over-year and managed a $2M annual marketing budget with a strict focus on ROI.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="font-medium text-gray-900 text-[6px]">Nexus Tech</h3>
          <span className="text-[4.5px] text-gray-400">2017 — 2020</span>
        </div>
        <p className="text-gray-500 mb-1 text-[5px]">Growth Marketing Manager</p>
        <p className="text-gray-600 text-[5px] font-light leading-[1.4]">
          Led go-to-market strategies for 3 major product launches. Optimized conversion funnels resulting in a 22% increase in user acquisition.
        </p>
      </div>
    </div>

    <div className="mt-1">
      <div className="flex flex-wrap gap-1">
        {['Digital Strategy', 'Brand Management', 'SEO/SEM', 'Team Leadership', 'Content Creation'].map(skill => (
          <span key={skill} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded-[2px] text-[4.5px] font-medium border border-gray-100">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function BackgroundResumes() {
  return (
    <div 
      className="hidden md:block absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" 
      aria-hidden="true"
    >
      {/* 
        A premium 4-resume framing layout originating from behind the login card.
        2 Left, 2 Right.
        Outer resumes: 80% opacity, 1px blur.
      */}

      {/* 1. Left Top (Outer) */}
      <MinimalResume 
        style={{ transform: "translate(calc(-50% - 380px), calc(-50% - 160px)) rotate(-15deg) scale(0.9)", filter: "blur(0px)", opacity: 0.8, zIndex: 1 }} 
      />
      
      {/* 2. Left Bottom (Outer) */}
      <ClassicResume 
        style={{ transform: "translate(calc(-50% - 400px), calc(-50% + 220px)) rotate(-30deg) scale(0.9)", filter: "blur(0px)", opacity: 0.8, zIndex: 2 }} 
      />

      {/* 3. Right Top (Outer) */}
      <ClassicResume 
        style={{ transform: "translate(calc(-50% + 380px), calc(-50% - 160px)) rotate(15deg) scale(0.9)", filter: "blur(0px)", opacity: 0.8, zIndex: 3 }} 
      />

      {/* 4. Right Bottom (Outer) */}
      <MinimalResume 
        style={{ transform: "translate(calc(-50% + 400px), calc(-50% + 220px)) rotate(30deg) scale(0.9)", filter: "blur(0px)", opacity: 0.8, zIndex: 4 }} 
      />
    </div>
  );
}
