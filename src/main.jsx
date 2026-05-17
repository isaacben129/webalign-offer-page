import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const INITIAL_LAUNCH_FORM = {
  fullName: '',
  email: '',
  idea: '',
  stage: '',
}

const INITIAL_CUSTOM_WEB_FORM = {
  fullName: '',
  email: '',
  company: '',
  currentSite: '',
  projectType: '',
  timeline: '',
  budget: '',
  goals: '',
}

const STAGES = ['Just an idea', 'Some early validation', 'Already building']
const CUSTOM_WEB_PROJECT_TYPES = ['Brand-new website', 'Redesign an existing website', 'Landing page + sales funnel', 'Not sure yet']
const CUSTOM_WEB_TIMELINES = ['48 hours', 'ASAP (1-2 weeks)', 'This month', '1-2 months', 'Flexible timeline']
const CUSTOM_WEB_BUDGETS = ['UGX 1M - 2M', 'UGX 2M - 4M', 'UGX 4M+', 'Need guidance']

const SECTION_IDS = [
  'problem',
  'how_it_works',
  'case_study',
  'offer',
  'final_cta',
]
const LAUNCH_SPRINT_PRICE = 'UGX 250K'
const CUSTOM_WEB_DESIGN_FROM = 'UGX 1M+'
const LAUNCH_SPRINT_ANCHOR_PRICE = 'UGX 950K'
const LAUNCH_SPRINT_DISCOUNT = 'UGX 200K'
const DOCKET_PAGE_URL = 'https://docketapp.us'
const WEBALIGN_HOME_URL = 'https://webalign.studio/'
const WEBALIGN_PORTFOLIO_URL = 'https://webalign.studio/project/'
const WEBALIGN_BLOG_URL = 'https://webalign.studio/blog/'
const WEBALIGN_BEHANCE_URL = 'https://www.behance.net/webalignstudio'
const PRIVACY_POLICY_URL = (import.meta.env.VITE_PRIVACY_POLICY_URL || '').trim()
const FOOTER_COMPANY_LINKS = [
  ['Home', WEBALIGN_HOME_URL],
  ['Portfolio', WEBALIGN_PORTFOLIO_URL],
  ['Blog', WEBALIGN_BLOG_URL],
]
const FOOTER_PORTFOLIO_LINKS = [['Behance', WEBALIGN_BEHANCE_URL]]

function getOpenSprintSlotsFromEnv() {
  const rawSlots = import.meta.env.VITE_OPEN_SPRINT_SLOTS
  const parsedSlots = Number.parseInt(String(rawSlots ?? ''), 10)
  if (!Number.isInteger(parsedSlots) || parsedSlots <= 0) return null
  return parsedSlots
}

function CtaArrowIcon({ size = 16, strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6.5 4.5H11.5V9.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getInitialForm(formType) {
  if (formType === 'custom_web') return { ...INITIAL_CUSTOM_WEB_FORM }
  return { ...INITIAL_LAUNCH_FORM }
}

function phCapture(eventName, properties = {}) {
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, properties)
  }
}

function App() {
  const openSprintSlots = getOpenSprintSlotsFromEnv()
  const hasConfiguredOpenSprintSlots = openSprintSlots !== null
  const openSprintAvailabilityText = hasConfiguredOpenSprintSlots
    ? `sprint slot${openSprintSlots === 1 ? '' : 's'} open this week`
    : 'Limited sprint capacity this week'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('launch_sprint')
  const [modalTrigger, setModalTrigger] = useState('')
  const [form, setForm] = useState(INITIAL_LAUNCH_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastFieldTouched, setLastFieldTouched] = useState('')
  const isCustomWebForm = modalType === 'custom_web'

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

  const detailChars = useMemo(() => {
    if (isCustomWebForm) return (form.goals || '').length
    return (form.idea || '').length
  }, [form.goals, form.idea, isCustomWebForm])

  const hasAnyFieldFilled = useMemo(
    () => Object.values(form).some((value) => String(value).trim().length > 0),
    [form]
  )

  function validate(values, formType) {
    const nextErrors = {}

    if (!values.fullName.trim()) nextErrors.fullName = 'Please enter your name.'
    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (formType === 'custom_web') {
      if (!values.company.trim()) nextErrors.company = 'Please enter your company or project name.'
      if (!values.projectType) nextErrors.projectType = 'Please select your project type.'
      if (!values.timeline) nextErrors.timeline = 'Please select your preferred timeline.'
      if (!values.budget) nextErrors.budget = 'Please select your budget range.'
      if (!values.goals.trim()) nextErrors.goals = 'Please share your project goals.'
    } else {
      if (!values.idea.trim()) {
        nextErrors.idea = 'Please share your idea.'
      }

      if (!values.stage) {
        nextErrors.stage = 'Please choose your current stage.'
      }
    }

    return nextErrors
  }

  function openModal(trigger, formType = 'launch_sprint') {
    setModalType(formType)
    setModalTrigger(trigger)
    setForm(getInitialForm(formType))
    setErrors({})
    setIsSubmitted(false)
    setIsModalOpen(true)
    phCapture('form_opened', { trigger, form_type: formType })
  }

  function closeModal() {
    if (hasAnyFieldFilled && !isSubmitted) {
      phCapture('form_abandoned', {
        last_field_touched: lastFieldTouched || 'unknown',
        form_type: modalType,
        trigger: modalTrigger || 'unknown',
      })
    }

    setIsModalOpen(false)
    setIsSubmitted(false)
    setErrors({})
    setForm(getInitialForm(modalType))
    setLastFieldTouched('')
    setModalTrigger('')
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setLastFieldTouched(field)
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(form, modalType)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          formType: modalType,
          trigger: modalTrigger || 'unknown',
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Submission failed.')
      }

      phCapture('form_submitted', { form_type: modalType, trigger: modalTrigger || 'unknown' })
      setIsSubmitted(true)
      setForm(getInitialForm(modalType))

      window.setTimeout(() => {
        setIsModalOpen(false)
        setIsSubmitted(false)
        setErrors({})
        setLastFieldTouched('')
        setModalTrigger('')
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
    { name: 'FapCount', category: 'Feature', ratio: '16 / 9', height: 242, src: '/images/carousel/Screenshot 2026-05-15 171205.png', position: 'center top', fit: 'cover', zoom: 1.04 },
    { name: 'Docket', category: 'Pricing', ratio: '1 / 1', height: 300, src: '/images/carousel/Screenshot 2026-05-15 170440.png', position: 'center center', fit: 'cover' },
    { name: 'Cherry', category: 'Hero', ratio: '3 / 2', height: 240, src: '/images/carousel/mix-cherry.webp', position: 'center 24%', fit: 'cover' },
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
  const testimonials = [
    ['Founder, Docket', 'Web Align moved us from idea to a live funnel in two days. We stopped guessing and started getting real signal.'],
    ['SaaS Operator', 'The messaging and offer clarity changed everything. We launched faster and the page converted better than our first draft.'],
    ['Ecommerce Team', 'Fast turnaround, clean execution, and zero fluff. The launch sprint gave us momentum we could build on immediately.'],
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
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-[#2D5A3D]"
                    style={{ animation: 'heroPulse 2s infinite' }}
                  />
                  <span className="type-caption font-normal text-[#1A1A1A]">
                    {hasConfiguredOpenSprintSlots ? (
                      <>
                        <span className="slot-count">{openSprintSlots}</span> {openSprintAvailabilityText}
                      </>
                    ) : (
                      openSprintAvailabilityText
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'nav' })
                    openModal('nav_cta')
                  }}
                  className="type-caption inline-flex items-center whitespace-nowrap rounded-full bg-[#1A1A1A] px-[18px] py-[9px] font-medium tracking-[0.04em] text-[#F5F5F5]"
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
              GO FROM IDEA TO FIRST SIGNUP IN 48 HOURS.
            </h1>

            <div className="mt-[clamp(12px,2.5vh,28px)] flex w-full max-w-[820px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="type-body-sm max-w-[420px] font-light text-[#555555]">
                You bring the idea. We handle the page, the funnel, the copy, the setup. 48 hours later you&apos;re
                live and finding out if people actually want this.
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
                  <span className="font-medium">CLAIM MY SPRINT SLOT</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M6.5 4.5H11.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <p className="type-overline mt-2 max-w-[320px] font-light normal-case leading-[1.35] tracking-[0.01em] text-[#7A7A7A] lg:text-right">
                  48 hours. Or you pay nothing.
                </p>
              </div>
            </div>

            <div className="relative left-1/2 right-1/2 mt-[clamp(32px,5vh,56px)] -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
              <div
                className="flex w-max items-end gap-4 px-[clamp(20px,5vw,48px)] md:px-12"
                style={{ animation: 'heroCarouselScroll 18s linear infinite' }}
              >
                {heroCarouselLoop.map((item, index) => {
                  const { name, category, ratio, height, src, position, fit, zoom } = item
                  const itemNumber = index + 1
                  let background = '#D8D8D4'
                  if (itemNumber % 4 === 0) background = '#E8E4DC'
                  else if (itemNumber % 3 === 0) background = '#C8CFC9'
                  else if (itemNumber % 2 === 0) background = '#2D2D2D'

                  const isDark = background === '#2D2D2D'

                  return (
                    <div
                      key={`${name}-${category}-${index}`}
                      className="relative flex-shrink-0 overflow-hidden rounded-[6px] border border-[#D7D7D1]"
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
                        style={{
                          objectPosition: position || 'center center',
                          transform: zoom ? `scale(${zoom})` : undefined,
                          transformOrigin: zoom ? 'top center' : undefined,
                        }}
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
              <h2 className="type-h2 mt-4">You&apos;re not stuck because your idea is bad.</h2>
              <p className="type-body-lg mt-7 max-w-[560px] text-[#444444]">
                It&apos;s not that you&apos;re not working. It&apos;s that the work you&apos;re doing can&apos;t answer the only
                question that matters - do people actually want this. There&apos;s a version of this where you spend
                six more months refining something nobody has seen. And a version where you find out in 48 hours. Both
                start today.
              </p>

              <button
                type="button"
                data-ph-event="apply_cta_click"
                onClick={() => {
                  phCapture('apply_cta_click', { location: 'problem_cta' })
                  openModal('problem_cta')
                }}
                className="type-caption mt-7 inline-flex items-center gap-3 uppercase tracking-[0.07em] text-[#1A1A1A]"
              >
                <span className="font-medium">CLAIM MY SPRINT SLOT</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                  <CtaArrowIcon />
                </span>
              </button>

              <div className="mt-8 space-y-1">
                {[
                  "You've been working on this for months. Nothing is live.",
                  "You know the market. You've done the research. You haven't shipped.",
                  'The logo has had three versions. The landing page has had zero.',
                  "You tell yourself you'll launch when it's ready. It's never ready.",
                  "You've explained the idea to ten people. None of them can sign up for it.",
                ].map((item) => (
                  <p key={item} className="type-body pb-1 text-[#303030]">
                    <span className="mr-1">&rarr;</span>
                    <span>{item}</span>
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
                <a
                  href={`#${SECTION_IDS[2]}`}
                  className="type-overline absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-[#2D5A3D] bg-[#1F3D2A] px-4 py-2 tracking-[0.06em] text-[#F5F5F5] transition-colors hover:bg-[#2D5A3D]"
                >
                  See how we helped Docket launch
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[1]} data-ph-section={SECTION_IDS[1]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">The Process</p>
            <h2 className="type-h2 mt-4">Three steps. 48 hours. Done.</h2>
            <p className="type-body mt-4 max-w-[480px] text-[var(--text-muted)]">
              We&apos;ve done this before. Docket went from a paragraph and a gut feeling to a live page with 604 visitors and real preorder interest. In 48 hours.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                [
                  '01',
                  'Send us your idea',
                  "Rough notes, a voice memo, a napkin sketch - it doesn't matter. Fill out a short application and tell us what you're building and who it's for. We've launched ideas that were a paragraph and a gut feeling. That's enough.",
                  'Day 0',
                ],
                [
                  '02',
                  'We build the launch system',
                  "We build the whole thing. Sales page, lead capture, waitlist or preorder flow, analytics. Written, designed, and live. You don't touch a single line of code.",
                  'Hour 1-48',
                ],
                [
                  '03',
                  'You launch. You find out.',
                  'You share it. You watch what happens. You find out in days what would have taken months to guess.',
                  'Hour 48',
                ],
              ].map(([n, t, d, tag]) => (
                <div key={n} className="rounded-[4px] bg-[#383838] px-5 py-6">
                  <p className="headline-font text-6xl leading-none text-[#5C5C5C]">{n}</p>
                  <p className="type-body-lg mt-4 font-bold text-[#F5F5F5]">{t}</p>
                  <p className="type-body mt-3 text-[#AAAAAA]">{d}</p>
                  <p className="type-overline mt-4 tracking-[0.08em] text-[#8FAE99]">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[2]} data-ph-section={SECTION_IDS[2]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="type-overline tracking-[0.14em] text-[#888888]">Proof Of Execution</p>
              <h2 className="type-h2 mt-4">Docket. 48 hours. Here&apos;s what happened.</h2>
              <p className="type-body mt-3 text-[#888888]">
                Docket started as a simple observation, people lose money every day on things they&apos;ve already
                bought. Return windows expire. Warranties go unfiled. Deductibles get forgotten. The question was
                whether anyone would pay for a solution before it existed.
              </p>
              <p className="type-body-lg mt-6 max-w-[520px] text-[#444444]">
                We built the entire launch system in 48 hours to find out.
              </p>
              <div className="mt-6 grid gap-1 sm:grid-cols-1">
                {[
                  ['Mobile-first landing page with clear positioning', ''],
                  ['Preorder flow with real payment integration', ''],
                  ['Lead capture and founding member structure', ''],
                  ['Analytics tracking from day one', ''],
                  ['TikTok-ready funnel entry point', ''],
                ].map(([lead, rest]) => (
                  <p key={lead} className="type-body pb-1 text-[#1A1A1A]">
                    <span className="mr-1">&rarr;</span>
                    <span className="font-bold">{lead}</span> {rest}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <a
                href={DOCKET_PAGE_URL}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-video w-full overflow-hidden rounded-[6px] border border-[#D7D7D1] bg-[#E9E9E3]"
              >
                <img
                  src="/images/carousel/docket-01.webp"
                  alt="Docket launch page screenshot"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 22%' }}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <p className="type-overline mt-7 tracking-[0.08em] text-[#777777]">Stats:</p>
              <div className="mt-7 grid gap-6 sm:grid-cols-3">
                {[
                  ['604', 'First page views'],
                  ['1.32%', 'Preorder conversion'],
                  ['3M 17S', 'Average time on page'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="type-h3 leading-[1] text-[#1A1A1A]">{value}</p>
                    <p className="type-overline mt-2 tracking-[0.06em] text-[#777777]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[3]} data-ph-section={SECTION_IDS[3]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">PRICING</p>
            <h2 className="type-h2 mt-4">Pick the offer that matches your stage.</h2>
            <p className="type-body mt-4 max-w-[760px] text-[#AAAAAA]">
              Not sure if your idea is ready enough? It doesn&apos;t need to be. That&apos;s the whole point of a sprint.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[4px] bg-[#353535] p-5">
                <p className="type-overline text-[#8FAE99]">BEST FOR FAST VALIDATION</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">Launch Sprint</h3>
                <div className="mt-3 flex items-end gap-3">
                  <p className="type-h2 text-[#F5F5F5]">UGX 250K</p>
                  <p className="pb-1" style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'var(--green)' }}>Increases to UGX 500K after this week.</p>
                </div>
                <p className="type-body mt-3 text-[#AAAAAA]">Best for founders who need to stop planning and start finding out. Same full sprint, same deliverables — this is what it costs before everyone knows about it.</p>
                <div className="mt-4 space-y-1">
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>A landing page built to get signups</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Simple, clear messaging for your offer</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>A waitlist or preorder flow set up for you</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Basic analytics so you can track results</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Mobile checks and launch QA before going live</p>
                </div>
                <p className="type-overline mt-5 text-[#8FAE99]">INCLUDED FREE:</p>
                <div className="mt-2 space-y-1">
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Launch Messaging Sprint <span className="text-[#A5A5A5]">(UGX 120K value)</span></p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Analytics Event Map <span className="text-[#A5A5A5]">(UGX 80K value)</span></p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>First Week Optimisation Notes <span className="text-[#A5A5A5]">(UGX 50K value)</span></p>
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
                  <span>CLAIM MY SPRINT SLOT — UGX 250K</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <CtaArrowIcon />
                  </span>
                </button>
              </div>

              <div className="rounded-[4px] bg-[#313131] p-5">
                <p className="type-overline text-[#888888]">FOR BIGGER BUILDS</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">Custom Web Design</h3>
                <p className="type-h2 mt-3 text-[#F5F5F5]">FROM UGX 1M+</p>
                <p className="type-body mt-3 text-[#AAAAAA]">Best for teams that need more than a sprint. If you need a bigger site, more pages, and a stronger brand system, we plan and build it with you from start to launch.</p>
                <div className="mt-4 space-y-1">
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>A custom look and structure for your site</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>A full multi-page website that works on all screens</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Clear copy and calls to action on each page</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Basic SEO and speed setup</p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>A handoff your team can easily keep building on</p>
                </div>
                <p className="type-overline mt-5 text-[#888888]">HELPING YOU GROW:</p>
                <div className="mt-2 space-y-1">
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Extra landing page variant <span className="text-[#A5A5A5]">(UGX 350K value)</span></p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Email capture sequence setup <span className="text-[#A5A5A5]">(UGX 80K value)</span></p>
                  <p className="type-body text-[#F5F5F5]"><span className="mr-1">&rarr;</span>Priority 24-hour revision round <span className="text-[#A5A5A5]">(UGX 150K value)</span></p>
                </div>
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'pricing_custom_web' })
                    openModal('pricing_custom_web', 'custom_web')
                  }}
                  className="type-caption mt-5 inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
                >
                  <span>Request Custom Web Quote</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <CtaArrowIcon />
                  </span>
                </button>
              </div>
            </div>

            <p className="type-body mt-6 max-w-[920px] text-[#AAAAAA]">
              Payment plans available. 50% upfront, 50% on delivery. Mobile Money and bank transfer accepted.
            </p>
            <div className="mt-3 grid gap-1 sm:grid-cols-3">
              <p className="type-body text-[#F5F5F5]"><span className="mr-1">-</span>No long contracts</p>
              <p className="type-body text-[#F5F5F5]"><span className="mr-1">-</span>Starts within 24 hours of payment</p>
              <p className="type-body text-[#F5F5F5]"><span className="mr-1">-</span>Real person, not an agency machine</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="type-h3 text-[#F5F5F5]">DELIVERED IN 48 HOURS OR YOU PAY NOTHING.</p>
                <p className="type-body mt-3 max-w-[600px] text-[#AAAAAA]">
                  If we don&apos;t deliver within 48 hours, you pay nothing. Full refund, no questions. We only take on sprints we know we can ship - which is why we cap it at one per week. And if nobody signs up after you launch — that&apos;s not failure. That&apos;s the cheapest possible way to find out what needs to change. Either way, you&apos;re further along than you were.
                </p>
              </div>
              <button
                type="button"
                data-ph-event="apply_cta_click"
                onClick={() => {
                  phCapture('apply_cta_click', { location: 'pricing_section_bottom' })
                  openModal('pricing_section_bottom')
                }}
                className="type-caption inline-flex items-center gap-3 uppercase tracking-[0.07em] text-[#F5F5F5]"
              >
                <span className="font-medium">CLAIM MY SPRINT SLOT</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                  <CtaArrowIcon />
                </span>
              </button>
            </div>
            <p className="type-body-sm mt-3 text-[#8FAE99]">Reviewed within 24 hours. Live within 48.</p>
          </div>
        </section>

        <section data-ph-section="social_proof" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <div className="mx-auto max-w-[640px] text-center">
              <p className="type-overline tracking-[0.14em] text-[var(--text-muted)]">WHAT HAPPENS AFTER 48 HOURS</p>
              <p className="type-body-lg mt-8 text-[#444444]" style={{ fontStyle: 'italic', fontWeight: 300, lineHeight: 1.8 }}>
                &quot;[REAL TESTIMONIAL GOES HERE]&quot;
              </p>
              <span className="type-caption mt-4 block text-[var(--text-muted)]">— [Name], [Company]</span>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[4]} data-ph-section={SECTION_IDS[4]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="type-h2">STOP PLANNING.<br/>START LAUNCHING.</h2>
                <p className="type-body-lg mt-6 max-w-[520px] text-[#444444]">
                  You already know what you want to build. You&apos;ve known for a while. The only thing left is to find out if it works - and the only way to find that out is to put it in front of real people. That&apos;s what this is for.
                </p>
              </div>
              <div className="text-[#1A1A1A]">
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'final_cta' })
                    openModal('final_cta')
                  }}
                  className="type-caption inline-flex items-center gap-3 uppercase tracking-[0.07em] text-[#1A1A1A]"
                >
                  <span className="font-medium">CLAIM MY SPRINT SLOT</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <CtaArrowIcon />
                  </span>
                </button>
                <p className="type-body-sm mt-3 text-[#888888]">Applications take 3 minutes. We review within 24 hours.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2D2D2D] px-5 pb-6 pt-10 md:px-10">
        <div className="w-full">
          <img
            src="/images/carousel/WA logo mark white.svg"
            alt="Web Align logo"
            className="h-9 w-auto"
            loading="lazy"
            decoding="async"
          />
          <span className="type-body mt-4 mb-8 block max-w-[520px] text-[#888888]">Built and run by Isaac - Web Align, Kampala.</span>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="type-overline tracking-[0.1em] text-[#888888]">Company</p>
              <div className="mt-3 space-y-2">
                {FOOTER_COMPANY_LINKS.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="type-body block text-[#F5F5F5]">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="type-overline tracking-[0.1em] text-[#888888]">Portfolio</p>
              <div className="mt-3 space-y-2">
                {FOOTER_PORTFOLIO_LINKS.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="type-body block text-[#F5F5F5]">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="type-overline tracking-[0.1em] text-[#888888]">Contacts</p>
              <div className="mt-3 space-y-2">
                <a href="mailto:hello@webalign.studio" className="type-body text-[#F5F5F5]">hello@webalign.studio</a>
                <a href="tel:+256708349458" className="type-body block text-[#F5F5F5]">+256 708 349458</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#444444] pt-4">
            <div className={`flex items-center ${PRIVACY_POLICY_URL ? 'justify-between' : 'justify-end'}`}>
              {PRIVACY_POLICY_URL && (
                <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer" className="type-overline tracking-[0.08em] text-[#888888]">
                  PRIVACY POLICY
                </a>
              )}
              <p className="type-overline tracking-[0.08em] text-[#888888]">&copy; WA 2025</p>
            </div>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="form-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
          <div className="form-modal-panel">
            <button type="button" className="form-modal-close" onClick={closeModal} aria-label="Close form">&times;</button>

            {!isSubmitted ? (
              <form className="form-shell" onSubmit={handleSubmit} noValidate>
                <h2 id="form-modal-title" className="headline-font form-title">
                  {isCustomWebForm ? 'Request a Custom Web Quote' : 'Apply for a Launch Sprint'}
                </h2>
                <p className="form-subtitle">
                  {isCustomWebForm
                    ? 'Tell us your scope, timeline, and goals. We will send you a tailored plan.'
                    : 'Share your idea and stage. We will respond within 24 hours.'}
                </p>

                <label className="form-label" htmlFor="fullName">FULL NAME</label>
                <input id="fullName" className={`form-input ${errors.fullName ? 'is-error' : ''}`} value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Your name" />
                {errors.fullName && <p className="form-error">{errors.fullName}</p>}

                <label className="form-label" htmlFor="email">EMAIL ADDRESS</label>
                <input id="email" type="email" className={`form-input ${errors.email ? 'is-error' : ''}`} value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" />
                {errors.email && <p className="form-error">{errors.email}</p>}

                {isCustomWebForm ? (
                  <>
                    <label className="form-label" htmlFor="company">COMPANY / PROJECT NAME</label>
                    <input id="company" className={`form-input ${errors.company ? 'is-error' : ''}`} value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Your brand or project name" />
                    {errors.company && <p className="form-error">{errors.company}</p>}

                    <label className="form-label" htmlFor="currentSite">CURRENT WEBSITE (OPTIONAL)</label>
                    <input id="currentSite" className="form-input" value={form.currentSite} onChange={(e) => updateField('currentSite', e.target.value)} placeholder="https://yourwebsite.com" />

                    <div className="form-grid">
                      <div>
                        <label className="form-label" htmlFor="projectType">PROJECT TYPE</label>
                        <select id="projectType" className={`form-input form-select ${errors.projectType ? 'is-error' : ''}`} value={form.projectType} onChange={(e) => updateField('projectType', e.target.value)}>
                          <option value="">Select project type</option>
                          {CUSTOM_WEB_PROJECT_TYPES.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors.projectType && <p className="form-error">{errors.projectType}</p>}
                      </div>
                      <div>
                        <label className="form-label" htmlFor="timeline">TIMELINE</label>
                        <select id="timeline" className={`form-input form-select ${errors.timeline ? 'is-error' : ''}`} value={form.timeline} onChange={(e) => updateField('timeline', e.target.value)}>
                          <option value="">Select timeline</option>
                          {CUSTOM_WEB_TIMELINES.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors.timeline && <p className="form-error">{errors.timeline}</p>}
                      </div>
                    </div>

                    <label className="form-label" htmlFor="budget">BUDGET RANGE</label>
                    <select id="budget" className={`form-input form-select ${errors.budget ? 'is-error' : ''}`} value={form.budget} onChange={(e) => updateField('budget', e.target.value)}>
                      <option value="">Select budget range</option>
                      {CUSTOM_WEB_BUDGETS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.budget && <p className="form-error">{errors.budget}</p>}

                    <label className="form-label" htmlFor="goals">WHAT ARE YOU TRYING TO ACHIEVE?</label>
                    <div className="form-textarea-wrap">
                      <textarea id="goals" className={`form-input form-textarea ${errors.goals ? 'is-error' : ''}`} value={form.goals} onChange={(e) => updateField('goals', e.target.value.slice(0, 700))} placeholder="Goals, target users, pages you need, and what success looks like." maxLength={700} />
                      <span className="form-counter">{detailChars}/700</span>
                    </div>
                    {errors.goals && <p className="form-error">{errors.goals}</p>}
                  </>
                ) : (
                  <>
                    <label className="form-label" htmlFor="idea">WHAT'S YOUR IDEA?</label>
                    <div className="form-textarea-wrap">
                      <textarea id="idea" className={`form-input form-textarea ${errors.idea ? 'is-error' : ''}`} value={form.idea} onChange={(e) => updateField('idea', e.target.value.slice(0, 500))} placeholder="Describe it rough - a sentence or two is fine" maxLength={500} />
                      <span className="form-counter">{detailChars}/500</span>
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
                  </>
                )}

                {errors.submit && <p className="form-error">{errors.submit}</p>}

                <button type="submit" className="form-submit" disabled={isSubmitting} data-ph-event="form_submitted">
                  <span>{isCustomWebForm ? 'SEND QUOTE REQUEST' : 'SEND APPLICATION'}</span>
                  <span className="form-submit-circle">
                    <CtaArrowIcon />
                  </span>
                </button>
              </form>
            ) : (
              <div className="form-confirmation" aria-live="polite">
                <h3 className="headline-font">{isCustomWebForm ? 'REQUEST RECEIVED.' : "YOU'RE IN THE QUEUE."}</h3>
                <p>
                  {isCustomWebForm
                    ? 'Thanks. We will review your requirements and send a tailored next step within 24 hours.'
                    : "We'll review your application and get back to you within 24 hours. Check your email - and your spam folder just in case."}
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
