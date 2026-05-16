import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  idea: '',
  stage: '',
}

const STAGES = ['Just an idea', 'Some early validation', 'Already building']

const SECTION_IDS = [
  'problem',
  'how_it_works',
  'case_study',
  'offer',
  'final_cta',
]
const LAUNCH_SPRINT_PRICE = 'UGX 750K'
const CUSTOM_WEB_DESIGN_FROM = 'UGX 1M+'
const LAUNCH_SPRINT_ANCHOR_PRICE = 'UGX 950K'
const LAUNCH_SPRINT_DISCOUNT = 'UGX 200K'

function phCapture(eventName, properties = {}) {
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, properties)
  }
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastFieldTouched, setLastFieldTouched] = useState('')

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll('.fade-section').forEach((el) => revealObserver.observe(el))

    const firedScrollSections = new Set()
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionName = entry.target.getAttribute('data-ph-section')
          if (entry.isIntersecting && sectionName && !firedScrollSections.has(sectionName)) {
            phCapture('scroll_depth', { section: sectionName })
            firedScrollSections.add(sectionName)
            scrollObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.35 }
    )

    document.querySelectorAll('[data-ph-section]').forEach((el) => scrollObserver.observe(el))

    return () => {
      revealObserver.disconnect()
      scrollObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const marks = [30, 60, 120]
    const timers = marks.map((seconds) =>
      window.setTimeout(() => {
        phCapture('time_on_page', { seconds })
      }, seconds * 1000)
    )

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [])

  const ideaChars = useMemo(() => form.idea.length, [form.idea])

  const hasAnyFieldFilled = useMemo(
    () => Object.values(form).some((value) => String(value).trim().length > 0),
    [form]
  )

  function validate(values) {
    const nextErrors = {}

    if (!values.fullName.trim()) nextErrors.fullName = 'Please enter your name.'
    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!values.idea.trim()) {
      nextErrors.idea = 'Please share your idea.'
    }

    if (!values.stage) {
      nextErrors.stage = 'Please choose your current stage.'
    }

    return nextErrors
  }

  function openModal(trigger) {
    setIsModalOpen(true)
    phCapture('form_opened', { trigger })
  }

  function closeModal() {
    if (hasAnyFieldFilled && !isSubmitted) {
      phCapture('form_abandoned', {
        last_field_touched: lastFieldTouched || 'unknown',
      })
    }

    setIsModalOpen(false)
    setErrors({})

    if (!isSubmitted) {
      setForm(INITIAL_FORM)
      setLastFieldTouched('')
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setLastFieldTouched(field)
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Submission failed.')
      }

      phCapture('form_submitted')
      setIsSubmitted(true)
      setForm(INITIAL_FORM)

      window.setTimeout(() => {
        setIsModalOpen(false)
        setIsSubmitted(false)
        setErrors({})
        setLastFieldTouched('')
      }, 4000)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || 'Something went wrong. Please try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const heroCarouselItems = [
    { name: 'WebAlign', category: 'Studio', ratio: '3 / 2', height: 220, src: '/images/carousel/mix-webalign.webp', position: 'center 24%', fit: 'cover' },
    { name: 'Docket', category: 'Hero', ratio: '3 / 2', height: 232, src: '/images/carousel/docket-01.webp', position: 'center 20%', fit: 'cover' },
    { name: 'Haven', category: 'Landing', ratio: '3 / 2', height: 242, src: '/images/carousel/mix-haven.webp', position: 'center 20%', fit: 'cover' },
    { name: 'Docket', category: 'Three Steps', ratio: '3 / 2', height: 226, src: '/images/carousel/docket-05.webp', position: 'center 35%', fit: 'cover' },
    { name: 'FapCount', category: 'Feature', ratio: '3 / 2', height: 236, src: '/images/carousel/mix-fapcount.webp', position: 'center 20%', fit: 'cover' },
    { name: 'Docket', category: 'Mobile Overview', ratio: '3 / 2', height: 222, src: '/images/carousel/docket-06.webp', position: 'center 18%', fit: 'cover' },
    { name: 'Cherry', category: 'Hero', ratio: '3 / 2', height: 240, src: '/images/carousel/mix-cherry.webp', position: 'center 24%', fit: 'cover' },
    { name: 'Docket', category: 'Landing Hero', ratio: '1 / 1', height: 300, src: '/images/carousel/docket-08.webp', position: 'center top', fit: 'cover' },
  ]
  const heroCarouselLoop = [...heroCarouselItems, ...heroCarouselItems]
  const checklist = [
    ['High-converting sales page', 'Copywritten and designed for conversion.'],
    ['Mobile-first, fast-loading build', 'Built to perform cleanly on every device.'],
    ['Offer positioning and messaging', 'Clarify what you sell and why it matters.'],
    ['Waitlist or preorder system', 'Capture demand before full product build.'],
    ['Lead capture setup', 'Structured to collect and qualify interest.'],
    ['CTA optimization', 'Clear next actions that drive response.'],
    ['Analytics integration', 'Ready for PostHog or GA tracking.'],
    ['Launch-ready in 48 hours', 'Delivered on a hard timeline.'],
  ]
  const launchSprintIncludes = [
    'High-converting landing page designed and built',
    'Offer and messaging positioned for validation',
    'Lead capture and waitlist/preorder flow setup',
    'PostHog or GA baseline analytics integration',
    'Mobile optimization and launch QA pass',
  ]
  const customWebIncludes = [
    'Custom design direction and page architecture',
    'Multi-page responsive website build',
    'Conversion-focused copy and CTA structure',
    'Technical SEO basics and performance setup',
    'Scalable handoff for future growth',
  ]
  const bonusStack = [
    ['Bonus 1', 'Launch Messaging Sprint', 'UGX 120K value'],
    ['Bonus 2', 'Analytics Event Map', 'UGX 80K value'],
    ['Bonus 3', 'First Week Optimization Notes', 'UGX 50K value'],
  ]
  const addOns = [
    ['Extra landing page variant', 'UGX 250K'],
    ['Email capture sequence setup', 'UGX 180K'],
    ['Priority 24-hour revision round', 'UGX 150K'],
  ]

  return (
    <>
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
              <div className="flex items-center gap-3">
                <span className="type-overline font-normal text-[#888888]">LAUNCH SPRINT</span>
                <span className="type-overline rounded-full border border-[#D0D0D0] bg-[#E6E6E6] px-3 py-1 font-medium tracking-[0.06em] text-[#1A1A1A]">
                  FIXED {LAUNCH_SPRINT_PRICE}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-[#2D5A3D]"
                    style={{ animation: 'heroPulse 2s infinite' }}
                  />
                  <span className="type-caption font-normal text-[#1A1A1A]">
                    <span className="slot-count">1</span> sprint slot open this week
                  </span>
                </div>

                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'nav' })
                    openModal('nav_cta')
                  }}
                  className="type-caption inline-flex items-center rounded-full bg-[#1A1A1A] px-[18px] py-[9px] font-medium tracking-[0.04em] text-[#F5F5F5]"
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-[#D0D0D0]" style={{ borderTopWidth: '0.5px' }} />

          <div className="flex flex-col px-[clamp(20px,5vw,48px)] pb-[clamp(0px,2vh,32px)] pt-[clamp(60px,11.25vh,125px)] md:px-12">
            <h1
              className="type-hero mt-[clamp(28px,4.5vh,56px)] w-full max-w-full text-[#1A1A1A] md:max-w-[80%] lg:max-w-[58%]"
              style={{ marginBottom: 'clamp(10px, 1.75vh, 18px)' }}
            >
              YOUR IDEA IS WORTHLESS UNTIL IT&apos;S LIVE.
            </h1>

            <div className="mt-[clamp(24px,4vh,48px)] flex w-full max-w-[820px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="type-body-sm max-w-[420px] font-light text-[#555555]">
                We turn rough startup ideas into launch-ready validation funnels in 48 hours - sales page, waitlist,
                preorder flow, lead capture, and analytics. Everything to go live and get real signal for a fixed
                price of {LAUNCH_SPRINT_PRICE}.
              </p>

              <div className="lg:self-end">
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'hero' })
                    openModal('hero_cta')
                  }}
                  className="type-caption inline-flex items-center gap-3 uppercase tracking-[0.07em] text-[#1A1A1A]"
                  aria-label="Apply for a launch sprint"
                >
                  <span className="font-medium">APPLY FOR A LAUNCH SPRINT</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6.5 4.5H11.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <p className="type-overline mt-2 font-light normal-case tracking-normal text-[#999999]">Delivered in 48 hours or you pay nothing.</p>
              </div>
            </div>

            <div className="relative left-1/2 right-1/2 mt-[clamp(32px,5vh,56px)] -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
              <div
                className="flex w-max items-end gap-4 px-[clamp(20px,5vw,48px)] md:px-12"
                style={{ animation: 'heroCarouselScroll 18s linear infinite' }}
              >
                {heroCarouselLoop.map((item, index) => {
                  const { name, category, ratio, height, src, position, fit } = item
                  const itemNumber = index + 1
                  let background = '#D8D8D4'
                  if (itemNumber % 4 === 0) background = '#E8E4DC'
                  else if (itemNumber % 3 === 0) background = '#C8CFC9'
                  else if (itemNumber % 2 === 0) background = '#2D2D2D'

                  const isDark = background === '#2D2D2D'

                  return (
                    <div
                      key={`${name}-${category}-${index}`}
                      className="relative flex-shrink-0 overflow-hidden rounded-[6px] border border-[#D7D7D1] shadow-[0_8px_22px_rgba(0,0,0,0.14)]"
                      style={{
                        backgroundColor: background,
                        aspectRatio: ratio,
                        height: `${height}px`,
                      }}
                    >
                      <img
                        src={src}
                        alt={`${name} ${category} screenshot`}
                        className={`h-full w-full bg-[#EDEDE8] ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                        style={{ objectPosition: position || 'center center' }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/5" />
                      <span
                        className="type-overline absolute bottom-3 left-3 tracking-[0.08em]"
                        style={{ color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.46)' }}
                      >
                        {name} - {category}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[0]} data-ph-section={SECTION_IDS[0]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="type-overline tracking-[0.14em] text-[#888888]">The Problem</p>
              <h2 className="type-h2 mt-4">YOU&apos;RE NOT STUCK BECAUSE YOUR IDEA IS BAD.</h2>
              <p className="type-body-lg mt-7 max-w-[560px] text-[#444444]">
                You&apos;ve researched the market. You&apos;ve tweaked the name. You&apos;ve built the deck nobody asked for.
                You&apos;re waiting to feel ready, but that feeling never comes. Meanwhile, someone with a worse idea just
                launched. They&apos;re getting signups. You&apos;re getting nothing.
              </p>

              <div className="mt-8 space-y-1">
                {[
                  ["You don't have an idea problem.", 'You have a shipping problem.'],
                  ['Validation comes from live signal.', 'Not endless planning.'],
                  ['Launch speed beats polished drafts.', 'Especially the ones that never ship.'],
                  ['The fastest path to clarity.', 'Get in front of real users.'],
                ].map(([lead, rest]) => (
                  <p key={lead} className="type-body pb-1 text-[#303030]">
                    <span className="mr-1">&rarr;</span>
                    <span className="font-bold">{lead}</span> {rest}
                  </p>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-[6px] border border-[#D7D7D1] bg-[#E9E9E3]">
                <img
                  src="/images/carousel/docket-01.webp"
                  alt="Docket landing page hero screenshot"
                  className="h-full w-full object-cover bg-[#EDEDE8]"
                  style={{ objectPosition: 'center 22%' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[1]} data-ph-section={SECTION_IDS[1]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">The Process</p>
            <h2 className="type-h2 mt-4">HOW IT WORKS</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ['01', 'Send us your idea', "Rough idea, messy notes, voice memo; it doesn't matter. Fill out a short application and tell us what you're building and who it's for."],
                ['02', 'We build the launch system', 'In 48 hours we build a high-converting sales page, lead capture, waitlist or preorder flow, analytics, and a mobile-optimized funnel.'],
                ['03', 'You launch. You validate.', 'Go live. Get signups. Find out if people actually want this, before you spend months building the wrong thing.'],
              ].map(([n, t, d]) => (
                <div key={n} className="rounded-[4px] bg-[#383838] px-5 py-6">
                  <p className="headline-font text-6xl leading-none text-[#5C5C5C]">{n}</p>
                  <p className="type-body-lg mt-4 font-bold text-[#F5F5F5]">{t}</p>
                  <p className="type-body mt-3 text-[#AAAAAA]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[2]} data-ph-section={SECTION_IDS[2]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="type-overline tracking-[0.14em] text-[#888888]">Proof Of Execution</p>
              <h2 className="type-h2 mt-4">FROM IDEA TO LIVE FUNNEL IN UNDER 48 HOURS.</h2>
              <p className="type-body mt-3 text-[#888888]">How we launched Docket.</p>
              <p className="type-body-lg mt-6 max-w-[520px] text-[#444444]">
                Docket is a legal document management tool for Ugandan SMEs. The founder had the idea, knew the
                problem, and had zero online presence. We built the entire launch system in 48 hours.
              </p>
              <p className="type-h3 mt-8 text-[#2D5A3D]">THAT&apos;S WHAT VALIDATION LOOKS LIKE.</p>
            </div>

            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-[6px] border border-[#D7D7D1] bg-[#E9E9E3]">
                <img
                  src="/images/carousel/docket-01.webp"
                  alt="Docket launch page screenshot"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 22%' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-6 grid gap-1 sm:grid-cols-2">
                {[
                  ['Mobile-first landing page', 'With clear positioning.'],
                  ['Preorder flow', 'Built with a low-friction CTA.'],
                  ['Lead capture', 'Integrated and live.'],
                  ['Analytics tracking', 'Running from day one.'],
                  ['Funnel entry point', 'Ready for TikTok traffic.'],
                ].map(([lead, rest]) => (
                  <p key={lead} className="type-body pb-1 text-[#1A1A1A]">
                    <span className="mr-1">&rarr;</span>
                    <span className="font-bold">{lead}</span> {rest}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[3]} data-ph-section={SECTION_IDS[3]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">Pricing</p>
            <h2 className="type-h2 mt-4">PICK THE OFFER THAT MATCHES YOUR STAGE.</h2>
            <p className="type-body mt-4 max-w-[760px] text-[#AAAAAA]">
              Clear scope. Clear price. Launch Sprint is fixed at {LAUNCH_SPRINT_PRICE}. Custom Web Design starts at {CUSTOM_WEB_DESIGN_FROM} and scales with scope.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[4px] bg-[#353535] p-5">
                <p className="type-overline text-[#8FAE99]">Best for fast validation</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">Launch Sprint</h3>
                <div className="mt-3 flex items-end gap-3">
                  <p className="type-h2 text-[#F5F5F5]">{LAUNCH_SPRINT_PRICE}</p>
                  <p className="type-body pb-1 text-[#888888] line-through">{LAUNCH_SPRINT_ANCHOR_PRICE}</p>
                </div>
                <p className="type-body mt-1 text-[#8FAE99]">Save {LAUNCH_SPRINT_DISCOUNT} this week.</p>
                <p className="type-body mt-3 text-[#AAAAAA]">Best for founders who need validation fast in 48 hours.</p>
                <div className="mt-4 space-y-1">
                  {launchSprintIncludes.map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>{item}
                    </p>
                  ))}
                </div>
                <p className="type-overline mt-5 text-[#8FAE99]">Included Bonus Stack</p>
                <div className="mt-2 space-y-1">
                  {bonusStack.map(([label, item, value]) => (
                    <p key={label} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>
                      <span className="font-bold">{label}:</span> {item} <span className="text-[#A5A5A5]">({value})</span>
                    </p>
                  ))}
                </div>
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'pricing_launch_sprint' })
                    openModal('pricing_launch_sprint')
                  }}
                  className="type-caption mt-5 inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
                >
                  <span>Book Launch Sprint - {LAUNCH_SPRINT_PRICE}</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">?</span>
                </button>
              </div>

              <div className="rounded-[4px] bg-[#313131] p-5">
                <p className="type-overline text-[#888888]">For Bigger Builds</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">Custom Web Design</h3>
                <p className="type-h2 mt-3 text-[#F5F5F5]">From {CUSTOM_WEB_DESIGN_FROM}</p>
                <p className="type-body mt-3 text-[#AAAAAA]">Best for teams that need custom scope, more pages, and deeper design systems.</p>
                <div className="mt-4 space-y-1">
                  {customWebIncludes.map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>{item}
                    </p>
                  ))}
                </div>
                <p className="type-overline mt-5 text-[#888888]">Helpful Add-Ons</p>
                <div className="mt-2 space-y-1">
                  {addOns.map(([item, price]) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>
                      <span className="font-bold">{item}</span> <span className="text-[#A5A5A5]">({price})</span>
                    </p>
                  ))}
                </div>
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'pricing_custom_web' })
                    openModal('pricing_custom_web')
                  }}
                  className="type-caption mt-5 inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
                >
                  <span>Request Custom Web Quote</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">?</span>
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="type-h3 text-[#F5F5F5]">DELIVERED IN 48 HOURS OR YOU PAY NOTHING.</p>
                <p className="type-body mt-3 max-w-[600px] text-[#AAAAAA]">
                  The guarantee removes risk: if we miss the delivery window for Launch Sprint, you get a full refund.
                </p>
              </div>
              <button
                type="button"
                data-ph-event="apply_cta_click"
                onClick={() => {
                  phCapture('apply_cta_click', { location: 'pricing_section_bottom' })
                  openModal('pricing_section_bottom')
                }}
                className="type-caption inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
              >
                <span>Start Your Project</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">?</span>
              </button>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[4]} data-ph-section={SECTION_IDS[4]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="type-h2">STOP PLANNING.<br/>START LAUNCHING.</h2>
                <p className="type-body-lg mt-6 max-w-[520px] text-[#444444]">
                  Every day you don&apos;t launch is a day someone else validates the same idea.
                </p>
              </div>
              <div className="text-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => openModal('hero_cta')}
                  className="type-caption inline-flex items-center gap-3 uppercase tracking-wide"
                >
                  <span>Apply For A Launch Sprint</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">?</span>
                </button>
                <p className="type-body-sm mt-3 text-[#888888]">Applications take 3 minutes. We review within 24 hours.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="form-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
          <div className="form-modal-panel">
            <button type="button" className="form-modal-close" onClick={closeModal} aria-label="Close form">X</button>

            {!isSubmitted ? (
              <form className="form-shell" onSubmit={handleSubmit} noValidate>
                <h2 id="form-modal-title" className="headline-font form-title">Apply for a Launch Sprint</h2>

                <label className="form-label" htmlFor="fullName">FULL NAME</label>
                <input id="fullName" className={`form-input ${errors.fullName ? 'is-error' : ''}`} value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Your name" />
                {errors.fullName && <p className="form-error">{errors.fullName}</p>}

                <label className="form-label" htmlFor="email">EMAIL ADDRESS</label>
                <input id="email" type="email" className={`form-input ${errors.email ? 'is-error' : ''}`} value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" />
                {errors.email && <p className="form-error">{errors.email}</p>}

                <label className="form-label" htmlFor="idea">WHAT'S YOUR IDEA?</label>
                <div className="form-textarea-wrap">
                  <textarea id="idea" className={`form-input form-textarea ${errors.idea ? 'is-error' : ''}`} value={form.idea} onChange={(e) => updateField('idea', e.target.value.slice(0, 500))} placeholder="Describe it rough - a sentence or two is fine" maxLength={500} />
                  <span className="form-counter">{ideaChars}/500</span>
                </div>
                {errors.idea && <p className="form-error">{errors.idea}</p>}

                <label className="form-label">WHERE ARE YOU AT?</label>
                <div className="stage-toggle-row" role="radiogroup" aria-label="Where are you at?">
                  {STAGES.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      className={`stage-toggle ${form.stage === stage ? 'is-active' : ''} ${errors.stage ? 'is-error' : ''}`}
                      onClick={() => updateField('stage', stage)}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
                {errors.stage && <p className="form-error">{errors.stage}</p>}

                {errors.submit && <p className="form-error">{errors.submit}</p>}

                <button type="submit" className="form-submit" disabled={isSubmitting} data-ph-event="form_submitted">
                  <span>SEND APPLICATION</span>
                  <span className="form-submit-circle">?</span>
                </button>
              </form>
            ) : (
              <div className="form-confirmation" aria-live="polite">
                <h3 className="headline-font">YOU'RE IN THE QUEUE.</h3>
                <p>
                  We'll review your application and get back to you within 24 hours. Check your email - and your spam folder just in case.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
