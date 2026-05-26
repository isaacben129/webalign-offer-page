import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const POSTHOG_API_KEY = (import.meta.env.VITE_POSTHOG_API_KEY || '').trim()
const POSTHOG_API_HOST = (import.meta.env.VITE_POSTHOG_API_HOST || 'https://us.i.posthog.com').trim()

function initPostHog() {
  if (typeof window === 'undefined' || window.posthog) return
  if (!POSTHOG_API_KEY) {
    console.warn('[PostHog] Missing VITE_POSTHOG_API_KEY. Analytics disabled.')
    return
  }

  ;(function (t, e) {
    let o
    let n
    let p
    let r
    e.__SV = 1
    window.posthog = e
    e._i = []
    e.init = function (i, s, a) {
      function g(target, key) {
        const parts = key.split('.')
        if (parts.length === 2) {
          target = target[parts[0]]
          key = parts[1]
        }
        target[key] = function () {
          target.push([key].concat(Array.prototype.slice.call(arguments, 0)))
        }
      }
      p = t.createElement('script')
      p.type = 'text/javascript'
      p.crossOrigin = 'anonymous'
      p.async = true
      p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js'
      r = t.getElementsByTagName('script')[0]
      r.parentNode.insertBefore(p, r)
      let u = e
      const methods = 'init capture register register_once unregister identify alias set_config reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group setPersonProperties setPersonPropertiesForFlags'.split(' ')
      if (a !== undefined) {
        u = e[a] = []
      } else {
        a = 'posthog'
      }
      u.people = u.people || []
      u.toString = function (stub) {
        let name = 'posthog'
        if (a !== 'posthog') name += '.' + a
        if (!stub) name += ' (stub)'
        return name
      }
      u.people.toString = function () {
        return u.toString(1) + '.people (stub)'
      }
      for (o = 0, n = methods.length; o < n; o += 1) g(u, methods[o])
      e._i.push([i, s, a])
    }
  })(document, window.posthog || [])

  window.posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_API_HOST,
    person_profiles: 'identified_only',
  })
}

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
  const openSprintAvailabilityText = '5 founder slots at UGX 450K'

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
    phCapture('pageview', { page: window.location.pathname })
  }, [])

  useEffect(() => {
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
    { name: 'Web Align', category: 'Studio site', ratio: '3 / 2', height: 220, src: '/images/carousel/mix-webalign.webp', position: 'center 24%', fit: 'cover' },
    { name: 'Docket', category: '48-hour launch test', ratio: '3 / 2', height: 232, src: '/images/carousel/docket-01.webp', position: 'center 20%', fit: 'cover' },
    { name: 'Fapcount', category: 'Product page', ratio: '16 / 9', height: 242, src: '/images/carousel/Screenshot 2026-05-15 171205.png', position: 'center top', fit: 'cover', zoom: 1.04 },
    { name: 'Docket', category: 'Preorder flow', ratio: '1 / 1', height: 300, src: '/images/carousel/Screenshot 2026-05-15 170440.png', position: 'center center', fit: 'cover' },
    { name: 'Cherry', category: 'Waitlist hero', ratio: '3 / 2', height: 240, src: '/images/carousel/mix-cherry.webp', position: 'center 24%', fit: 'cover' },
  ]
  const heroCarouselLoop = [...heroCarouselItems, ...heroCarouselItems]
  const testimonial = {
    testimonial_quote:
      'Creative, fast, and easy to work with. Their minimal design approach makes every project stand out, and they genuinely listen while giving great recommendations.',
    testimonial_name: 'Jesse Miti',
    testimonial_role: 'Serenity',
  }

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
                <span className="type-overline hidden font-normal text-[#888888] sm:inline">LAUNCH SPRINT</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-[#2D5A3D]"
                    style={{ animation: 'heroPulse 2s infinite' }}
                  />
                  <span className="type-caption font-normal text-[#1A1A1A]">
                    {openSprintAvailabilityText}
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
              GO FROM ROUGH IDEA TO LIVE DEMAND TEST IN 48 HOURS.
            </h1>

            <div className="mt-[clamp(12px,2.5vh,28px)] flex w-full max-w-[820px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="type-body-sm max-w-[420px] font-light text-[#555555]">
                You bring the messy idea. We sharpen the promise, build the page, set up the CTA, connect basic
                tracking, and give you the launch messages to put it in front of real people. 48 hours later,
                you&apos;re not guessing anymore. You have something live and a way to read the signal.
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
                <p className="type-overline mt-2 max-w-[320px] font-light normal-case leading-[1.35] tracking-[0.01em] text-[#7A7A7A]">
                  48 hours after completed intake. No live test, no final payment.
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
                It&apos;s not that you&apos;re lazy. It&apos;s not that the idea is bad. It&apos;s that the work you&apos;re doing
                still cannot answer the only question that matters: do real people care enough to act? There&apos;s a
                version of this where you spend six more months refining something nobody has seen, and there&apos;s a
                version where you put a clear test in front of people in 48 hours. Both start today.
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

        <section data-ph-section="reframe" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="type-overline tracking-[0.14em] text-[#888888]">THE REFRAME</p>
              <h2 className="type-h2 mt-4 max-w-[760px]">THIS IS NOT A WEBSITE SPRINT. IT&apos;S A DEMAND TEST.</h2>
              <p className="type-body-lg mt-6 max-w-[760px] text-[#444444]">
                A normal landing page tells people your idea exists. A demand test helps you find out if anyone cares.
                That means the message, page, CTA, tracking, and first-user launch plan all work together. The goal is
                not to look polished. The goal is to get real behaviour from real people.
              </p>
              <p className="type-body-lg mt-8 max-w-[740px] text-[#444444]">
                You do not need a perfect product to learn. You need a test people can react to.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[4px] border border-[#D7D7D1] bg-[#E8E8E3] px-5 py-6">
                <p className="type-overline flex items-center gap-2 tracking-[0.08em] text-[#888888]">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#B94B4B] bg-[#F3DADA] text-[#8F2A2A]"
                    aria-hidden="true"
                  >
                    x
                  </span>
                  Not this
                </p>
                <p className="type-body mt-3 text-[#303030]">
                  A pretty &apos;coming soon&apos; page with a vague waitlist and no plan for getting it in front of users.
                </p>
              </div>
              <div className="rounded-[4px] border border-[#D7D7D1] bg-[#E8E8E3] px-5 py-6">
                <p className="type-overline flex items-center gap-2 tracking-[0.08em] text-[#888888]">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#2D5A3D] bg-[#DCECDD] text-[#1F4A2E]"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  This
                </p>
                <p className="type-body mt-3 text-[#303030]">
                  A focused launch system with a clear promise, working CTA, tracking, and messages you can send to
                  your first users.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS[1]} data-ph-section={SECTION_IDS[1]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">The Process</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">Three steps. 48 hours. Done.</h2>
            <p className="type-body mt-4 max-w-[680px] text-[var(--text-muted)]">
              We&apos;ve done this before. Docket went from a rough idea and a gut feeling to a live demand test with 604
              visitors, preorder intent, and real behaviour to learn from in 48 hours.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                [
                  '01',
                  'Send us the messy version',
                  "Rough notes, a voice memo, screenshots, competitor links, a paragraph, a gut feeling - that's enough. You fill out a short intake telling us what you're building, who it's for, and what action would prove interest.",
                  'Day 0',
                ],
                [
                  '02',
                  'We build the demand test',
                  "We sharpen the promise, write the page, build the funnel, set up the CTA, connect basic analytics, and prepare the first-user launch assets. You don't touch a single line of code.",
                  'Hours 1-48',
                ],
                [
                  '03',
                  'You launch. You read the signal.',
                  'You share the page using the launch kit. Then you watch what people do: visits, clicks, replies, signups, bookings, preorder intent, objections. You find out in days what months of private planning could not tell you.',
                  'Hour 48+',
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

        <section data-ph-section="what_we_build" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">WHAT WE BUILD</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">EVERYTHING YOU NEED TO RUN THE FIRST TEST.</h2>
            <p className="type-body mt-4 max-w-[760px] text-[#444444]">
              Not a full MVP. Not a brand identity. Not a 20-page website. Just the minimum launch system that lets
              real people react.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  'Idea Compression Brief',
                  "Your idea starts messy. That's normal. We turn your notes, voice memo, screenshots, or rough explanation into a clear launch brief: who it's for, what pain it solves, why people should care now, and what this test is trying to prove.",
                ],
                [
                  'Proof-First Landing Page',
                  'We build a page around one question: will a stranger take the next step? The page includes a clear hero, problem section, solution explanation, CTA, FAQ, and trust-building copy.',
                ],
                [
                  'Commitment-Based CTA',
                  'We help choose the right action for the idea. That could be a waitlist, early-access request, call booking, preorder click, paid beta interest, or demo request.',
                ],
                [
                  'Analytics Event Map',
                  'You should not launch and guess what happened. We set up simple tracking for page views, CTA clicks, form submissions, booking intent, preorder intent, and other key actions.',
                ],
                [
                  'First-User Launch Kit',
                  'A page with no audience is not a test. You get launch posts, DM scripts, a feedback ask, and suggested places to share the idea.',
                ],
                [
                  'Signal Scorecard',
                  'After launch, the numbers need interpretation. We give you a simple scorecard to decide whether the signal means build, tweak, narrow, or kill the idea.',
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[4px] border border-[#D7D7D1] bg-[#E8E8E3] px-5 py-6">
                  <p className="type-body-lg font-bold text-[#1A1A1A]">{title}</p>
                  <p className="type-body mt-3 text-[#444444]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-ph-section="signal_ladder" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">WHAT COUNTS AS SIGNAL?</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">SIGNUPS ARE NICE. SIGNAL IS BETTER.</h2>
            <p className="type-body-lg mt-6 max-w-[760px] text-[#444444]">
              A random email signup does not always mean demand. Someone may sign up and forget. Someone may click
              because they&apos;re curious. Someone may say &quot;cool idea&quot; and never pay. So we look for stronger behaviour.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ['Weak signal', ['Page views', 'Likes', '"This is cool"', 'Random email signups']],
                ['Better signal', ['CTA clicks', 'Qualified form responses', 'Replies to outreach', 'Specific pain notes', 'People asking how it works']],
                ['Strong signal', ['Booked calls', 'Preorder clicks', 'Paid beta interest', 'People asking when it launches', 'People comparing it to something they already use']],
              ].map(([title, items]) => (
                <div key={title} className="rounded-[4px] border border-[#D7D7D1] bg-[#E8E8E3] px-5 py-6">
                  <p className="type-body-lg font-bold text-[#1A1A1A]">{title}</p>
                  <div className="mt-3 space-y-1">
                    {items.map((item) => (
                      <p key={item} className="type-body text-[#303030]">
                        <span className="mr-1">&rarr;</span>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="type-body-lg mt-8 max-w-[760px] text-[#444444]">
              The goal is not to collect false hope. The goal is to know what happened and what to do next.
            </p>
          </div>
        </section>

        <section id={SECTION_IDS[2]} data-ph-section={SECTION_IDS[2]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="type-overline tracking-[0.14em] text-[#888888]">Proof Of Execution</p>
              <h2 className="type-h2 mt-4 max-w-[760px]">Docket. 48 hours. Here&apos;s what happened.</h2>
              <p className="type-body mt-3 text-[#888888]">
                Docket started as a simple observation: people lose money on things they&apos;ve already bought. Return
                windows expire. Warranties go unclaimed. Deductibles get forgotten. The question was not
                &quot;can we build this?&quot; The question was &quot;will anyone show interest before the product exists?&quot;
                So we built the demand test.
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
          <p className="type-body-lg mt-8 max-w-[780px] text-[#444444]">
            That did not prove Docket would become a huge company. It did something more useful at the start: it gave
            us real behaviour to learn from.
          </p>
        </section>

        <section id={SECTION_IDS[3]} data-ph-section={SECTION_IDS[3]} className="fade-section bg-[#2D2D2D] px-5 py-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">PRICING</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">PICK THE FASTEST PATH TO SIGNAL.</h2>
            <p className="type-body mt-4 max-w-[760px] text-[#AAAAAA]">
              Not sure if your idea is ready enough? It doesn&apos;t need to be. That&apos;s the whole point of the sprint.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[4px] bg-[#353535] p-5">
                <p className="type-overline text-[#8FAE99]">PRIMARY OFFER</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">48-HOUR FIRST SIGNAL SPRINT</h3>
                <div className="mt-3 flex flex-col items-start gap-1">
                  <p className="type-h2 text-[#F5F5F5]">UGX 450K</p>
                  <p className="type-body-sm text-[#8FAE99]">
                    Founding batch price. Moves to UGX 750K+ after the first 5 founder slots.
                  </p>
                </div>
                <p className="type-body mt-4 text-[#AAAAAA]">
                  Best for founders who need to stop planning and start finding out. You bring the idea. We turn it
                  into a live demand test with a clear page, working CTA, tracking, launch copy, and a scorecard for
                  what to do next.
                </p>
                <div className="mt-4 space-y-1">
                  {[
                    'Idea Compression Brief',
                    'Proof-first landing page',
                    'Waitlist, preorder, or call-booking CTA',
                    'Lead capture setup',
                    'Basic analytics + event map',
                    'First-user launch kit',
                    'Signal Scorecard',
                    'Mobile QA + handoff Loom',
                  ].map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>
                      {item}
                    </p>
                  ))}
                </div>
                <p className="type-overline mt-5 text-[#8FAE99]">INCLUDED FREE:</p>
                <div className="mt-2 space-y-1">
                  {[
                    'Kill-or-Continue Scorecard',
                    'First-Week Signal Tracker',
                    'Objection FAQ Pack',
                    '72-Hour Signal Review',
                    'One Free Angle Revision',
                  ].map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>
                      {item}
                    </p>
                  ))}
                </div>
                <p className="type-body-sm mt-5 text-[#8FAE99]">
                  50% upfront. 50% on delivery. Mobile Money and bank transfer accepted.
                </p>
                <button
                  type="button"
                  data-ph-event="apply_cta_click"
                  onClick={() => {
                    phCapture('apply_cta_click', { location: 'pricing_launch_sprint' })
                    openModal('pricing_launch_sprint')
                  }}
                  className="type-caption mt-5 inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
                >
                  <span>CLAIM MY SPRINT SLOT - UGX 450K</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <CtaArrowIcon />
                  </span>
                </button>
              </div>

              <div className="rounded-[4px] bg-[#313131] p-5">
                <p className="type-overline text-[#888888]">SECONDARY OFFER</p>
                <h3 className="type-h3 mt-2 text-[#F5F5F5]">CUSTOM WEB DESIGN</h3>
                <p className="type-h2 mt-3 text-[#F5F5F5]">FROM UGX 1M+</p>
                <p className="type-body mt-3 text-[#AAAAAA]">
                  For teams that already know what they&apos;re building and need a more complete site, stronger brand
                  presence, or multi-page web experience.
                </p>
                <div className="mt-4 space-y-1">
                  {[
                    'Custom site structure',
                    'Multi-page design and development',
                    'Clear copy and CTAs',
                    'Basic SEO and speed setup',
                    'Handoff your team can build on',
                  ].map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">&rarr;</span>
                      {item}
                    </p>
                  ))}
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
                  <span>REQUEST CUSTOM WEB QUOTE</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                    <CtaArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section data-ph-section="bonuses" className="fade-section bg-[#2D2D2D] px-5 pb-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">INCLUDED BONUSES</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">THE EXTRAS THAT STOP YOU FROM LAUNCHING BLIND.</h2>
            <p className="type-body mt-4 max-w-[760px] text-[#AAAAAA]">
              These are included in the founding sprint to help you understand what happens after the page goes live.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                ['Kill-or-Continue Scorecard', 'UGX 150K value', 'Know what your first signal actually means. This scorecard helps you decide whether to build, tweak, narrow, or kill the idea after launch.'],
                ['First-Week Signal Tracker', 'UGX 80K value', 'A simple tracker for your first week after launch: posts sent, DMs sent, replies, clicks, signups, calls booked, objections, and notes from real users.'],
                ['Objection FAQ Pack', 'UGX 100K value', 'We write answers to the questions people are likely to ask before they take action: who it&apos;s for, how much it costs, why they should trust it, and what happens after they sign up.'],
                ['Founder Launch Copy Pack', 'UGX 120K value', "You get launch posts, DM scripts, a feedback request, a founder story post, and a 'looking for first users' post."],
                ['72-Hour Signal Review', 'UGX 150K value', "After your first few days of sharing the page, send us your early numbers and responses. We'll help you understand what the signal probably means and what to change next."],
                ['One Free Angle Revision', 'UGX 200K value', "If you complete the agreed launch actions and get zero usable signal, we'll rewrite your main angle and CTA once for free. Sometimes the idea is not the problem. Sometimes the first angle is."],
              ].map(([title, value, body]) => (
                <div key={title} className="rounded-[4px] bg-[#383838] px-5 py-6">
                  <p className="type-body-lg font-bold text-[#F5F5F5]">{title}</p>
                  <p className="type-overline mt-2 tracking-[0.08em] text-[#8FAE99]">{value}</p>
                  <p className="type-body mt-3 text-[#AAAAAA]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-ph-section="value_stack" className="fade-section bg-[#2D2D2D] px-5 pb-20 text-[#F5F5F5] md:px-10">
          <div className="w-full rounded-[4px] bg-[#353535] p-6 md:p-8">
            <p className="type-overline tracking-[0.14em] text-[#8FAE99]">VALUE STACK</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">UGX 2M+ OF LAUNCH WORK FOR UGX 450K.</h2>
            <p className="type-body mt-4 max-w-[820px] text-[#AAAAAA]">
              The founding sprint price is low because we&apos;re opening a small batch, collecting more proof, and
              sharpening the process. This will not stay at 450K forever.
            </p>
            <div className="mt-8 grid gap-1 sm:grid-cols-2">
              {[
                'Idea Compression Brief - UGX 150K value',
                'Proof-First Landing Page - UGX 500K value',
                'Commitment CTA Setup - UGX 150K value',
                'Lead Capture / Preorder / Booking Flow - UGX 200K value',
                'Analytics Event Map - UGX 100K value',
                'First-User Launch Kit - UGX 200K value',
                'Signal Scorecard - UGX 150K value',
                'Mobile QA + Launch Handoff - UGX 100K value',
                'Loom Walkthrough - UGX 80K value',
                'Kill-or-Continue Scorecard - UGX 150K value',
                'First-Week Signal Tracker - UGX 80K value',
                'Objection FAQ Pack - UGX 100K value',
                'Founder Launch Copy Pack - UGX 120K value',
                '72-Hour Signal Review - UGX 150K value',
                'One Free Angle Revision - UGX 200K value',
              ].map((item) => (
                <p key={item} className="type-body text-[#F5F5F5]">
                  <span className="mr-1">&rarr;</span>
                  {item}
                </p>
              ))}
            </div>
            <p className="type-body-lg mt-8 text-[#F5F5F5]">Founding batch price: UGX 450K</p>
            <p className="type-body mt-2 text-[#8FAE99]">50% upfront. 50% on delivery.</p>
            <button
              type="button"
              data-ph-event="apply_cta_click"
              onClick={() => {
                phCapture('apply_cta_click', { location: 'value_stack' })
                openModal('value_stack')
              }}
              className="type-caption mt-6 inline-flex items-center gap-3 uppercase tracking-wide text-[#F5F5F5]"
            >
              <span>APPLY FOR A SPRINT SLOT</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                <CtaArrowIcon />
              </span>
            </button>
          </div>
        </section>

        <section data-ph-section="guarantee" className="fade-section bg-[#2D2D2D] px-5 pb-20 text-[#F5F5F5] md:px-10">
          <div className="w-full">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="type-h3 text-[#F5F5F5]">NO LIVE TEST, NO FINAL PAYMENT.</p>
                <p className="type-body mt-3 max-w-[740px] text-[#AAAAAA]">
                  Once your intake is complete and your sprint starts, we have 48 hours to deliver your live demand
                  test:
                </p>
                <div className="mt-4 space-y-1">
                  {['Page', 'CTA', 'Lead capture', 'Tracking', 'Launch assets', 'Handoff'].map((item) => (
                    <p key={item} className="type-body text-[#F5F5F5]">
                      <span className="mr-1">-</span>
                      {item}
                    </p>
                  ))}
                </div>
                <p className="type-body mt-4 max-w-[740px] text-[#AAAAAA]">
                  If we miss that window, you do not pay the final 50%. And if you complete the agreed first-user
                  launch actions and get zero usable signal, we&apos;ll rewrite your main angle and CTA once for free.
                  No fake &quot;guaranteed customers.&quot; No pretending every idea is validated. Just a fast, honest test
                  that gets you closer to the truth.
                </p>
              </div>
              <button
                type="button"
                data-ph-event="apply_cta_click"
                onClick={() => {
                  phCapture('apply_cta_click', { location: 'guarantee_cta' })
                  openModal('guarantee_cta')
                }}
                className="type-caption inline-flex items-center gap-3 uppercase tracking-[0.07em] text-[#F5F5F5]"
              >
                <span className="font-medium">CLAIM MY SPRINT SLOT</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5A3D] text-[#F5F5F5]">
                  <CtaArrowIcon />
                </span>
              </button>
            </div>
            <p className="type-body-sm mt-3 text-[#8FAE99]">
              Reviewed within 24 hours. Live within 48 after completed intake.
            </p>
          </div>
        </section>

        <section data-ph-section="your_part" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <p className="type-overline tracking-[0.14em] text-[#888888]">YOUR PART</p>
            <h2 className="type-h2 mt-4 max-w-[760px]">A PAGE SITTING QUIETLY ON THE INTERNET IS NOT A LAUNCH.</h2>
            <p className="type-body-lg mt-6 max-w-[760px] text-[#444444]">
              To qualify for the free angle revision, the test has to actually get tested. That means completing the
              agreed first-user launch actions within 72 hours of delivery.
            </p>
            <div className="mt-8 space-y-1">
              {[
                'Send at least 20 DMs',
                'Publish at least 3 posts',
                'Share in at least 3 relevant groups, communities, or channels',
                'Give the test 72 hours to collect responses',
                'Send us the numbers and replies',
              ].map((item) => (
                <p key={item} className="type-body pb-1 text-[#303030]">
                  <span className="mr-1">&rarr;</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
            <p className="type-body-lg mt-8 max-w-[760px] text-[#444444]">
              If you do the launch actions and still get nothing useful, we&apos;ll help you change the angle. Fair for
              you. Fair for us.
            </p>
          </div>
        </section>
        <section data-ph-section="social_proof" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <div className="mx-auto max-w-[760px] text-center">
              <p className="type-overline tracking-[0.14em] text-[var(--text-muted)]">WHAT HAPPENS AFTER 48 HOURS</p>
              <p className="type-body-lg mt-8 text-[#444444]" style={{ fontStyle: 'italic', fontWeight: 300, lineHeight: 1.8 }}>
                &quot;{testimonial.testimonial_quote}&quot;
              </p>
              <span className="type-caption mt-4 block text-[var(--text-muted)]">
                - {testimonial.testimonial_name}, {testimonial.testimonial_role}
              </span>
            </div>
          </div>
        </section>

        <section data-ph-section="faq" className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <h2 className="type-h2 max-w-[760px]">QUESTIONS FOUNDERS ASK BEFORE THEY STOP OVERTHINKING.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                ['Do I need a finished product?', 'No. The sprint is designed for ideas before the full product exists. We can test early access, preorder interest, beta demand, call-booking, or demo requests depending on the idea.'],
                ['What if I only have messy notes?', 'That is fine. Messy notes, voice memos, screenshots, competitor links, or a half-clear idea are enough. We turn that into a testable launch brief.'],
                ['Does this guarantee customers?', 'No. Anyone promising guaranteed customers in 48 hours is probably selling fumes. We guarantee a live demand test, not market demand.'],
                ['What if nobody signs up?', 'That is still useful. We look at whether people visited, clicked, replied, objected, ignored it completely, or showed interest but did not act. Then we decide whether to change the angle, audience, CTA, channel, or idea.'],
                ['Do you run the outreach for me?', 'The core sprint gives you the launch assets and tells you where to start. Done-for-you outreach can be added separately if you want us to help execute the first-user outreach.'],
                ['Can you build the actual MVP too?', 'Not inside this sprint. This is for testing demand before building. If the signal is strong, we can discuss the next build.'],
                ['When does the 48-hour timer start?', 'After your intake is complete and the deposit is paid. If key details are missing, the timer has not started yet. That protects the process and keeps the deadline real.'],
                ['What happens after the 48 hours?', 'You launch with the page, messages, and scorecard. Then you watch what real people do. If they click, sign up, reply, book, object, or ignore it, you have something to learn from. The sprint gives you the first test. The market gives you the answer.'],
              ].map(([question, answer]) => (
                <div key={question} className="rounded-[4px] border border-[#D7D7D1] bg-[#E8E8E3] px-5 py-6">
                  <p className="type-body-lg font-bold text-[#1A1A1A]">{question}</p>
                  <p className="type-body mt-3 text-[#444444]">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id={SECTION_IDS[4]} data-ph-section={SECTION_IDS[4]} className="fade-section bg-[#EFEFEF] px-5 py-20 md:px-10">
          <div className="w-full">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="type-h2">STOP PLANNING.<br/>START LAUNCHING.</h2>
                <p className="type-body-lg mt-6 max-w-[620px] text-[#444444]">
                  You already know what you want to build. The only thing left is to find out if people care enough to
                  act. In 48 hours, we can turn the idea into a live demand test and put you closer to the truth.
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
                <p className="type-body-sm mt-3 text-[#888888]">Applications take 3 minutes. Reviewed within 24 hours.</p>
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

initPostHog()

ReactDOM.createRoot(document.getElementById('root')).render(<App />)



