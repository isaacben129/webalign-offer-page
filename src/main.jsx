import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useEffect } from 'react'

const CTA = () => (
  <a className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.04em] text-[#1A1A1A]" href="#">
    <span>Apply For A Launch Sprint</span>
    <span
      data-ph-event="apply_cta_click"
      className="inline-flex h-10 w-10 items-center justify-center border border-[#2D5A3D] bg-[#2D5A3D] text-lg leading-none text-[#F5F5F5] !rounded-full"
    >
      ↗
    </span>
  </a>
)

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll('.fade-section').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const stripItems = ['Sales Page', 'Waitlist', 'Preorder Flow', 'Lead Capture', 'Analytics', 'Mobile-First', 'CTA Optimization', '48 Hours']
  const checklist = [
    'High-converting sales page — copywritten and designed',
    'Mobile-first, fast-loading build',
    'Offer positioning and messaging',
    'Waitlist or preorder system',
    'Lead capture setup',
    'CTA optimization',
    'Analytics integration ready for PostHog or GA',
    'Launch-ready in 48 hours',
  ]

  return (
    <main className="text-[#1A1A1A]">
      <section className="bg-[#EFEFEF] text-[#1A1A1A] min-h-[100svh] pb-[clamp(48px,8vh,96px)] pt-0">
        <div className="px-[clamp(24px,6vw,80px)] pt-5 pb-5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#888888]">
            <span>Launch Sprint</span><span className="ml-auto mr-4 md:mr-8">1 Sprint Slot Open</span><span className="text-lg leading-none">☰</span>
          </div>
        </div>
        <div className="w-full border-t border-[#555555]" />

        <div className="px-[clamp(24px,6vw,80px)] pt-[clamp(72px,12vh,140px)]">
          <h1 className="headline-font w-full text-[#1A1A1A] text-[clamp(52px,10vw,96px)] leading-[0.9] tracking-[-0.03em] md:w-[80%] lg:w-[60%]">YOUR IDEA IS WORTHLESS UNTIL IT'S LIVE.</h1>

          <div className="mt-[clamp(40px,6vh,72px)] flex w-full flex-col gap-3 md:w-[80%] lg:w-[60%]">
            <p className="text-[14px] text-[#888888] md:whitespace-nowrap">We build your launch-ready validation funnel in 48 hours.</p>

            <div className="w-screen border-y border-[#555555] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-2">
              <div className="overflow-x-auto whitespace-nowrap text-[12px] uppercase tracking-[0.04em] text-[#888888] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {stripItems.map((item, i) => <span key={item} className="inline-flex shrink-0 items-center">{i > 0 && <span className="mx-3 text-[#666666]">|</span>}{item}</span>)}
              </div>
            </div>

            <div><CTA /></div>
            <p className="mt-[10px] text-[12px] text-[#888888]">Delivered in 48 hours or you pay nothing. No questions asked.</p>
          </div>
        </div>
      </section>

      <section className="fade-section bg-[#EFEFEF] px-5 py-16 md:px-10"><div className="max-w-5xl"><p className="text-xs uppercase tracking-[0.14em] text-[#888888]">The Problem</p><h2 className="headline-font mt-4 text-[clamp(52px,10vw,96px)] leading-[0.92]">YOU'RE NOT STUCK<br/>BECAUSE YOUR IDEA<br/>IS BAD.</h2><p className="mt-6 max-w-[520px] text-lg leading-relaxed text-[#444444]">You've researched the market. You've tweaked the name. You've built the deck nobody asked for. You're waiting to feel ready — but that feeling never comes. Meanwhile, someone with a worse idea just launched. They're getting signups. You're getting nothing.</p><div className="mt-8 border-l-[3px] border-[#2D5A3D]"><div className="border-t border-[#bdbdbd]" />{['Been sitting on this idea for 3+ months?','Redesigned your logo more than once?','Built features nobody\'s asked for yet?','Waiting until it\'s "ready enough"?','Still in research mode?'].map((item)=><p key={item} className="border-t border-[#bdbdbd] py-3 pl-4 text-base text-[#1A1A1A]">— {item}</p>)}</div><p className="mt-8 text-[20px] text-[#1A1A1A]">You don't have an idea problem. You have a shipping problem.</p></div></section>

      <section className="fade-section bg-[#2D2D2D] px-5 py-16 text-[#F5F5F5] md:px-10"><div className="max-w-6xl"><p className="text-xs uppercase tracking-[0.14em] text-[#888888]">The Process</p><h2 className="headline-font mt-4 text-[clamp(48px,8vw,72px)]">HOW IT WORKS</h2><div className="mt-8 grid gap-0 md:grid-cols-3">{[['01','Send us your idea','Rough idea, messy notes, voice memo — doesn\'t matter. Fill out a short application and tell us what you\'re building and who it\'s for.'],['02','We build the launch system','In 48 hours we build a high-converting sales page, lead capture, waitlist or preorder flow, analytics, and a mobile-optimized funnel.'],['03','You launch. You validate.','Go live. Get signups. Find out if people actually want this — before you spend months building the wrong thing.']].map(([n,t,d],i)=><div key={n} className={`py-6 ${i>0?'border-t md:border-t-0 md:border-l border-[#555555]':''} md:pl-6`}><p className="headline-font text-6xl leading-none text-[#555555]">{n}</p><p className="mt-4 text-lg font-bold">{t}</p><p className="mt-3 text-[15px] leading-relaxed text-[#AAAAAA]">{d}</p></div>)}</div></div></section>

      <section className="fade-section bg-[#EFEFEF] px-5 py-16 md:px-10"><div className="max-w-5xl"><p className="text-xs uppercase tracking-[0.14em] text-[#888888]">Proof Of Execution</p><h2 className="headline-font mt-4 text-[clamp(46px,8vw,74px)] leading-[0.95]">FROM IDEA TO LIVE FUNNEL IN UNDER 48 HOURS.</h2><p className="mt-3 text-base text-[#888888]">How we launched Docket.</p><p className="mt-6 max-w-[520px] text-lg leading-relaxed text-[#444444]">Docket is a legal document management tool for Ugandan SMEs. The founder had the idea, knew the problem, and had zero online presence. We built the entire launch system in 48 hours.</p><div className="mt-8 border-l-[3px] border-[#2D5A3D]">{['Mobile-first landing page with clear positioning','Preorder flow with low-friction CTA','Lead capture integrated and live','Analytics tracking from day one','TikTok-ready funnel entry point'].map((item)=><p key={item} className="border-t border-[#bdbdbd] py-3 pl-4 text-base text-[#1A1A1A]">— {item}</p>)}</div><div className="mt-8 aspect-video w-full bg-[#CCCCCC] flex items-center justify-center text-center text-sm text-[#888888]">[ Docket — Launch Page Screenshot ]</div><p className="headline-font mt-8 text-[48px] leading-[0.95] text-[#2D5A3D]">THAT'S WHAT VALIDATION LOOKS LIKE.</p></div></section>

      <section className="fade-section bg-[#2D2D2D] px-5 py-16 text-[#F5F5F5] md:px-10"><div className="max-w-6xl"><p className="text-xs uppercase tracking-[0.14em] text-[#888888]">What You Get</p><h2 className="headline-font mt-4 text-[clamp(48px,8vw,74px)] leading-[0.95]">EVERYTHING YOU NEED TO LAUNCH.<br/>NOTHING YOU DON'T.</h2><div className="mt-8 grid md:grid-cols-2 md:gap-x-10">{checklist.map((item)=><p key={item} className="border-t border-[#555555] py-3 text-[15px]"><span className="mr-2 text-[#2D5A3D]">✓</span>{item}</p>)}</div><div className="mt-0 bg-[#1A1A1A] px-6 py-9 md:px-10"><p className="headline-font text-[clamp(42px,7vw,52px)] leading-[0.95]">DELIVERED IN 48 HOURS OR YOU PAY NOTHING.</p><p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-[#888888]">No vague timelines. No chasing. If we miss the window, you get a full refund. No questions asked.</p></div></div></section>

      <section className="fade-section bg-[#EFEFEF] px-5 py-16 md:px-10"><div className="max-w-5xl"><h2 className="headline-font text-[clamp(56px,10vw,96px)] leading-[0.9]">STOP PLANNING.<br/>START LAUNCHING.</h2><p className="mt-6 max-w-[460px] text-lg leading-relaxed text-[#444444]">Every day you don't launch is a day someone else validates the same idea.</p><div className="mt-6 text-[#1A1A1A]"><a href="#" className="inline-flex items-center gap-3 text-sm uppercase tracking-wide"><span>Apply For A Launch Sprint</span><span data-ph-event="apply_cta_click" className="inline-flex h-10 w-10 items-center justify-center bg-[#2D5A3D] text-[#F5F5F5]">↗</span></a></div><p className="mt-3 text-[13px] text-[#888888]">Applications take 3 minutes. We review within 24 hours.</p></div></section>

      <footer className="bg-[#2D2D2D] px-5 py-12 text-[#F5F5F5] md:px-10"><div className="max-w-6xl"><p className="headline-font text-6xl">WA</p><div className="mt-8 grid grid-cols-2 gap-8 text-sm"><div><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#888888]">Company</p><p>Home</p><p>Portfolio</p><p>Blog</p></div><div><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#888888]">Portfolio</p><p>Behance</p><p>Dribble</p><p>Pinterest</p></div><div><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#888888]">Social</p><p>X</p><p>Whatsapp</p><p>YouTube</p></div><div><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#888888]">Contacts</p><p>hello@webalign.studio</p><p>+256 708 349458</p></div></div><div className="mt-8 border-t border-[#555555]" /><div className="mt-4 flex justify-between text-xs uppercase tracking-[0.14em] text-[#888888]"><span>Privacy Policy</span><span>© WA 2025</span></div></div></footer>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
