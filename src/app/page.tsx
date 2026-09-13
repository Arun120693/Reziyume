import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileText, Layers, SlidersHorizontal, Upload, Sparkles } from "lucide-react";
import { TemplateGallery, TemplateThumbnail } from "@/components/marketing/TemplateGallery";
import { getTemplateConfig, templates } from "@/components/studio/preview/templates/registry";

export default function Home() {
  return <div className="marketing">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><Link href="/" className="wordmark"><span className="brand-symbol"><FileText size={21} /></span>reziyume<span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation" className="desktop-nav"><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#questions">FAQs</a></nav>
      <div className="header-actions"><Link href="/login" className="login-link">Log in</Link><Link href="/register" className="button-dark small">Get started <ArrowUpRight size={16}/></Link></div>
    </header>
    <main id="main">
      <section className="hero-section">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> YOUR NEXT CHAPTER STARTS HERE</p>
          <h1>You bring the talent.<br/>We’ll bring the <em>polish.</em></h1>
          <p className="hero-description">Turn everything you’ve done into a resume that feels like you. Thoughtful templates. Effortless editing. A stronger first impression.</p>
          <div className="hero-actions"><Link href="/register" className="button-dark">Build my resume <ArrowRight size={18}/></Link><a href="#templates" className="button-text">Explore templates <ArrowUpRight size={18}/></a></div>
          <div className="hero-checks"><span><Check size={14}/> Free to get started</span><span><Check size={14}/> No design skills needed</span></div>
        </div>
        <div className="hero-visual"><div className="hero-orbit"/><div className="hero-sheet-back"><TemplateThumbnail template={getTemplateConfig("folio")}/></div><div className="hero-sheet-front"><TemplateThumbnail template={getTemplateConfig("executive")}/></div><div className="floating-label"><span><Check size={18}/></span><div>Your experience. Elevated.<small>Make every detail count.</small></div></div><span className="visual-caption">A LITTLE DESIGN. A LOT OF POSSIBILITY.</span></div>
      </section>
      <section className="feature-strip" aria-label="Builder features"><span>A better way to<br/><strong>tell your story.</strong></span><div><Layers size={21}/>{templates.length} distinct templates</div><div><SlidersHorizontal size={21}/>Your style, down to the detail</div><div><Upload size={21}/>Import your existing resume</div></section>
      <section id="templates" className="section-wrap"><div className="section-heading"><div><p className="eyebrow">THE TEMPLATE COLLECTION</p><h2>Find your kind of<br/><em>first impression.</em></h2></div><p>From your first role to your next big move.<br/>Choose a design that lets your experience shine.</p></div><TemplateGallery/></section>
      <section id="how-it-works" className="how-section"><div className="section-heading"><div><p className="eyebrow">LESS FORMATTING. MORE FORWARD.</p><h2>Your next move,<br/><em>made simpler.</em></h2></div><Link href="/register" className="button-dark">Let’s build yours <ArrowRight size={18}/></Link></div><div className="steps-grid">{[{n:"01",icon:Layers,title:"Start with your style",text:"Choose a clean classic or something with a little more personality. You can always change your mind."},{n:"02",icon:SlidersHorizontal,title:"Make your story the star",text:"Add your experience, projects, and skills. Rearrange sections and refine colors with a live preview."},{n:"03",icon:FileText,title:"Take the next step",text:"Review the details, download your PDF, and tailor your resume to the opportunity ahead."}].map(s=><article key={s.n}><div className="step-top"><s.icon size={24}/><span>{s.n}</span></div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></section>
      <section id="questions" className="faq-section"><div><p className="eyebrow">A FEW GOOD QUESTIONS</p><h2>Good to know.<br/><em>Before you go.</em></h2></div><div className="faq-list">{[{q:"Which resume template should I choose?",a:"For online applications, start with a simple single-column design such as Signal, Launch, or Pivot. For creative roles or a resume you share directly, explore Folio or Blueprint. Always follow the employer’s submission requirements."},{q:"Can I use my existing resume?",a:"Yes. Open the editor and use the import option to bring in your existing resume. Review the imported information before saving and downloading."},{q:"Can I change the design later?",a:"Yes. Switch templates and adjust colors, type size, margins, and section order in the editor while keeping your content."},{q:"Is Reziyume free to start?",a:"You can create a free account to get started. Available paid plans and their included features are shown on the upgrade page in your dashboard."}].map(f=><details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>
      <section className="closing-section"><Sparkles size={30}/><p className="eyebrow">YOU’VE GOT SOMETHING TO OFFER.</p><h2>Let’s put it on paper.</h2><Link href="/register" className="button-light">Create my resume <ArrowRight size={18}/></Link></section>
    </main><footer className="site-footer"><Link className="wordmark" href="/">reziyume.</Link><span>Made for your next chapter.</span><Link href="/login">Back to your workspace <ArrowUpRight size={14}/></Link></footer>
  </div>;
}
