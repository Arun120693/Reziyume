import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileText, Layers, SlidersHorizontal, Upload, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { TemplateGallery, TemplateThumbnail } from "@/components/marketing/TemplateGallery";
import { getTemplateConfig, templates } from "@/components/studio/preview/templates/registry";

export const metadata = {
  title: "Reziyume — Professional Resume Builder in 2 Minutes",
  description: "Build a polished resume in about 2 minutes. Explore professional templates, edit with a live preview, and download your PDF for free.",
  alternates: { canonical: "https://reziyume.com" },
  openGraph: { title: "Beautiful resumes. Built in 2 minutes.", description: "You bring the talent. We’ll bring the polish. Professional templates, easy editing, and free PDF downloads.", url: "https://reziyume.com", siteName: "Reziyume", type: "website" },
  twitter: { card: "summary_large_image" as const, title: "Beautiful resumes. Built in 2 minutes.", description: "Professional templates, easy editing, and free PDF downloads." },
};

const faqs = [
  { q: "How long does it take to build a resume?", a: "With your experience ready, you can put together a first draft in about 2 minutes. Import an existing PDF to save typing, or start from scratch. Allow extra time to check your details and tailor your resume before applying." },
  { q: "Is Reziyume free?", a: "Yes. Creating and editing resumes, all current templates, and PDF downloads are free. Your free account also includes 5 resume imports per calendar month. Pro removes that import limit; see the pricing section above." },
  { q: "Are the resumes ATS-friendly?", a: "For applicant tracking systems (ATS), choose the text PDF export: it creates a single-column document with selectable text. The PDF matching your preview preserves the visual design as an image, so it is better for sharing directly. No format guarantees compatibility with every ATS; follow the employer’s instructions." },
  { q: "Can I customize the templates?", a: "Yes. Switch templates, adjust colors, fonts, type size and margins, and reorder or hide sections while keeping your content. The live preview shows your changes. No design skills needed." },
  { q: "Can I download my resume as a PDF?", a: "Yes, for free. In the editor, choose a PDF matching your preview or a single-column text PDF, then select Download. Check your final document before sending it." },
  { q: "Can I edit my resume later?", a: "Yes. Sign in to reopen your saved resumes from the dashboard. The editor saves changes automatically; check the save status before leaving." },
  { q: "Can I use my existing resume?", a: "Yes. Import a PDF in the editor. AI helps extract your information into editable sections. Review the result for accuracy. Free accounts include 5 imports per calendar month; Pro includes unlimited imports." },
  { q: "Can I use Reziyume on my phone?", a: "Yes. You can choose a template, edit your details, preview your resume and download a PDF on your phone. For longer writing sessions, a larger screen gives you more room." },
];

export default function Home() {
  return <div className="marketing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Reziyume", url: "https://reziyume.com", description: "Professional online resume builder with customizable templates and PDF export." }) }} />
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><Link href="/" className="wordmark"><span className="brand-symbol"><FileText size={21} /></span>reziyume<span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation" className="desktop-nav"><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#questions">FAQs</a></nav>
      <div className="header-actions"><Link href="/login" className="login-link">Log in</Link><Link href="/register" className="button-dark small">Start free <ArrowUpRight size={16}/></Link></div>
    </header><nav className="mobile-nav" aria-label="Mobile navigation"><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#questions">FAQs</a></nav>
    <main id="main">
      <section className="hero-section">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> YOUR NEXT OPPORTUNITY STARTS HERE</p>
          <h1>Build a professional resume<br/><em>in 2 minutes.</em></h1>
          <p className="hero-description">Create a polished resume without spending hours formatting. Choose a template, add your experience, and let Reziyume handle the polish.</p>
          <div className="hero-actions"><Link href="/register" className="button-dark">Build my resume — it’s free <ArrowRight size={18}/></Link><a href="#templates" className="button-text">Explore templates <ArrowUpRight size={18}/></a></div>
          <div className="hero-checks"><span><Check size={14}/> Free PDF downloads</span><span><Check size={14}/> No card needed</span></div>
        </div>
        <div className="hero-visual"><div className="hero-orbit"/><div className="hero-sheet-back"><TemplateThumbnail template={getTemplateConfig("folio")}/></div><div className="hero-sheet-front"><TemplateThumbnail template={getTemplateConfig("executive")}/></div><div className="floating-label"><span><Check size={18}/></span><div>Your experience. Elevated.<small>Make every detail count.</small></div></div><span className="visual-caption">SAMPLE RESUME · FICTIONAL PROFILE</span></div>
      </section>
      <section className="feature-strip" aria-label="Builder features"><span>A better way to<br/><strong>tell your story.</strong></span><div><Layers size={21}/>{templates.length} distinct templates</div><div><SlidersHorizontal size={21}/>Your style, down to the detail</div><div><Upload size={21}/>Import your existing resume</div></section>
      <section className="section-wrap benefits-section"><div className="section-heading"><div><p className="eyebrow">BUILT FOR YOUR NEXT MOVE</p><h2>Everything you need.<br/><em>None of the formatting headache.</em></h2></div><p>You bring the talent.<br/>We’ll bring the polish.</p></div><div className="benefits-grid">{[
        { icon: Clock, title: "A head start, in minutes", text: "Skip the blank page. Import your existing PDF and turn it into editable resume sections." },
        { icon: Layers, title: "Designed around your experience", text: "Purpose-built layouts keep your story in focus. Switch styles without rebuilding your resume." },
        { icon: SlidersHorizontal, title: "Easy to make your own", text: "Edit content, reorder sections and adjust the details. See every change in your live preview." },
        { icon: FileText, title: "The right PDF for the moment", text: "Use a text-based, single-column PDF for online applications, or share a PDF matching your design." },
      ].map(b => <article key={b.title}><b.icon size={23}/><h3>{b.title}</h3><p>{b.text}</p></article>)}</div></section>
      <section id="templates" className="section-wrap"><div className="section-heading"><div><p className="eyebrow">THE TEMPLATE COLLECTION</p><h2>Pick a style.<br/><em>Make it yours.</em></h2></div><p>Professional templates designed to look great<br/>without getting in the way of your experience.</p></div><TemplateGallery/></section>
      <section id="how-it-works" className="how-section"><div className="section-heading"><div><p className="eyebrow">LESS FORMATTING. MORE FORWARD.</p><h2>Your resume.<br/><em>Done in 2 minutes.</em></h2></div><Link href="/register" className="button-dark">Build my resume — it’s free <ArrowRight size={18}/></Link></div><p className="section-intro">From blank page to polished resume in about 2 minutes, with your details ready. Take the time you need to make it yours.</p><div className="steps-grid">{[{n:"01",icon:Layers,title:"Choose your style",text:"Pick a professional template. Start with a simple structure or a little more personality."},{n:"02",icon:SlidersHorizontal,title:"Add your experience",text:"Import a PDF or add your experience, education and skills. Fine-tune the details with a live preview."},{n:"03",icon:FileText,title:"Download & apply",text:"Review your resume, choose your PDF format, and download for free. You’re ready for your next move."}].map(s=><article key={s.n}><div className="step-top"><s.icon size={24}/><span>{s.n}</span></div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></section>
      <section id="pricing" className="section-wrap"><div className="section-heading"><div><p className="eyebrow">CLEAR FROM THE START</p><h2>A great resume.<br/><em>Free to build. Free to download.</em></h2></div><p>Pay only if you need more imports.<br/>Your creativity doesn’t need an upgrade.</p></div><div className="pricing-grid"><article className="price-card"><p className="eyebrow">FREE</p><h3>Your everyday resume toolkit</h3><p className="price-value">$0</p><ul><li><Check size={16}/> Create, edit and save resumes</li><li><Check size={16}/> All {templates.length} current templates</li><li><Check size={16}/> Visual and text PDF downloads</li><li><Check size={16}/> 5 AI-assisted PDF imports per calendar month</li></ul><Link href="/register" className="button-dark">Build my resume — it’s free <ArrowRight size={18}/></Link></article><article className="price-card"><p className="eyebrow">PRO</p><h3>More imports. Less retyping.</h3><p className="price-value">₹99 <small>/ month in India</small></p><p className="price-region">$5 USD / month elsewhere</p><ul><li><Check size={16}/> Everything in Free</li><li><Check size={16}/> Unlimited AI-assisted PDF imports</li></ul><p>AI helps extract existing resume content. Writing and refining your story stays in your hands.</p><Link href="/dashboard/upgrade" className="button-text">View Pro in your dashboard <ArrowUpRight size={18}/></Link></article></div></section>
      <section id="privacy" className="product-trust section-wrap"><ShieldCheck size={28}/><div><h2>Your experience is personal.</h2><p>Your resumes are saved to your account, and resume access requires sign-in. PDF downloads are generated in your browser. If you choose to import a PDF, its content is processed with Google’s AI service to extract your details. Only upload information you’re comfortable processing this way.</p></div></section>
      <section id="questions" className="faq-section"><div><p className="eyebrow">A FEW GOOD QUESTIONS</p><h2>Good to know.<br/><em>Before you go.</em></h2></div><div className="faq-list">{faqs.map(f=><details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></section>
      <section className="closing-section"><Sparkles size={30}/><p className="eyebrow">YOU’VE GOT SOMETHING TO OFFER.</p><h2>Your next opportunity deserves a better resume.</h2><p className="closing-copy">Build a polished, professional resume in about 2 minutes.</p><Link href="/register" className="button-light">Build my resume — it’s free <ArrowRight size={18}/></Link></section>
    </main><footer className="site-footer"><Link className="wordmark" href="/">reziyume.</Link><span>Made for your next chapter.</span><a href="#privacy">Your data</a><a href="mailto:support@reziyume.com">Contact support</a><a href="#pricing">Pricing</a><Link href="/login">Back to your workspace <ArrowUpRight size={14}/></Link></footer>
  </div>;
}
