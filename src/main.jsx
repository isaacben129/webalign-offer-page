import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useEffect } from 'react'

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

  const heroCarouselItems = [
    ['Docket', 'Legal SaaS'],
    ['Safari Tours', 'Tourism'],
    ['LexPro', 'Legal'],
    ['EduPath', 'EdTech'],
    ['MedLink', 'Health'],
    ['BuildFast', 'SaaS'],
  ]
  const heroCarouselLoop = [...heroCarouselItems, ...heroCarouselItems]
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
      <section className="flex min-h-[100svh] flex-col bg-[#EFEFEF] text-[#1A1A1A] pt-0">
        <style>{`
          @keyframes heroPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          @keyframes heroCarouselScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <div className="px-[clamp(20px,5vw,48px)] py-[18px] md:px-12">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-normal uppercase tracking-[0.1em] text-[#888888]">LAUNCH SPRINT</span>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span
                  className="h-[7px] w-[7px] rounded-full bg-[#2D5A3D]"
                  style={{ animation: 'heroPulse 2s infinite' }}
                />
                <span className="text-[12px] font-normal text-[#1A1A1A]">1 sprint slot open this week</span>
              </div>

              <a
                href="#"
                data-ph-event="apply_cta_click"
                className="inline-flex items-center rounded-full bg-[#1A1A1A] px-[18px] py-[9px] text-[12px] font-medium tracking-[0.04em] text-[#F5F5F5]"
              >
                Apply now
              </a>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-[#D0D0D0]" style={{ borderTopWidth: '0.5px' }} />

        <div className="flex flex-col px-[clamp(20px,5vw,48px)] pb-[clamp(0px,2vh,32px)] pt-[clamp(60px,11.25vh,125px)] md:px-12">
          <div className="flex flex-col gap-0">
            <h1
              className="headline-font mt-[clamp(28px,4.5vh,56px)] w-full max-w-full text-[clamp(42px,5.2vw,76px)] uppercase leading-[1] tracking-[-0.03em] text-[#1A1A1A] md:max-w-[80%] lg:max-w-[58%]"
              style={{ fontWeight: 400, marginBottom: 'clamp(10px, 1.75vh, 18px)' }}
            >
              YOUR IDEA IS WORTHLESS UNTIL IT&apos;S LIVE.
            </h1>

            <div className="mt-[clamp(24px,4vh,48px)] flex w-full max-w-[820px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-[420px] text-[13px] font-light leading-[1.7] text-[#555555]">
                We turn rough startup ideas into launch-ready validation funnels in 48 hours — sales page, waitlist, preorder flow, lead capture, and analytics. Everything to go live and get real signal. Nothing you don&apos;t need.
              </p>

              <div className="lg:self-end">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-medium uppercase tracking-[0.07em] text-[#1A1A1A]">APPLY FOR A LAUNCH SPRINT</span>
                  <a
                    href="#"
                    data-ph-event="apply_cta_click"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]"
                    aria-label="Apply for a launch sprint"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6.5 4.5H11.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <p className="mt-2 text-[11px] font-light text-[#999999]">Delivered in 48 hours or you pay nothing.</p>
              </div>
            </div>
          </div>

          <div className="relative left-1/2 right-1/2 mt-[clamp(32px,5vh,56px)] -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
            <div
              className="flex w-max gap-4 px-[clamp(20px,5vw,48px)] md:px-12"
              style={{ animation: 'heroCarouselScroll 18s linear infinite' }}
            >
              {heroCarouselLoop.map(([name, category], index) => {
                const itemNumber = index + 1
                let background = '#D8D8D4'
                if (itemNumber % 4 === 0) background = '#E8E4DC'
                else if (itemNumber % 3 === 0) background = '#C8CFC9'
                else if (itemNumber % 2 === 0) background = '#2D2D2D'

                const isDark = background === '#2D2D2D'

                return (
                  <div
                    key={`${name}-${category}-${index}`}
                    className="relative h-[170px] w-[260px] flex-shrink-0 overflow-hidden rounded-[4px]"
                    style={{ backgroundColor: background }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-[75%] w-[85%] rounded-[4px] bg-white opacity-[0.15]" />
                    </div>
                    <span
                      className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.08em]"
                      style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }}
                    >
                      {name} — {category}
                    </span>
                  </div>
                )
              })}
            </div>
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
