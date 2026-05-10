# webalign-offer-page


Build a single-page, direct-response landing page for "Web Align – 48 Hour Launch Sprint" that matches the exact design system of the existing Web Align site (webalign.studio).

DESIGN SYSTEM:

Typography:
- Headlines: Bebas Neue (Google Fonts) — all-caps, tight-tracked, large and stacked
- Body: DM Sans (Google Fonts) — light weight (300–400), clean, readable
- Section labels: small uppercase DM Sans, muted color, sparse use

Colors:
- Light sections: #EFEFEF background, #1A1A1A text
- Dark sections: #2D2D2D background, #F5F5F5 text
- Accent: Deep forest green #2D5A3D — used only on CTA button and checklist checkmarks
- No gradients. No neon. Flat and editorial throughout.

CTA Button Style (used identically every time):
- Plain text link + circular icon button with ↗ arrow in deep green (#2D5A3D)
- Example: "Apply For A Launch Sprint" [circular ↗ button]
- Never use a pill or rectangle button anywhere on the page

Navigation:
- Top bar with thin horizontal rule below it
- Left label: "LAUNCH SPRINT" | Right: "© WA 2025"
- Hamburger icon top right (decorative, no functionality needed)
- No sticky nav. Nothing else.

Layout rules:
- Mobile-first, full-width sections
- Generous vertical padding between sections (except inside hero — see below)
- Headlines large enough to feel aggressive — let them dominate
- No cards, no shadows, no border-radius anywhere
- Thin horizontal rules used to separate items and sections
- Flat, editorial, typography-driven throughout

---

SECTIONS IN ORDER:

---

1. HERO — Dark background (#2D2D2D)
   Single column. Everything above the fold. No scrolling.
      Treat every pixel of vertical space as expensive.

      Top navigation bar:
      - Left: "LAUNCH SPRINT" small uppercase DM Sans, muted #888888
      - Right: "© WA 2025"
      - Hamburger top right
      - Thin horizontal rule below

      Main content — single column, stacked, compact:

      - Headline (Bebas Neue, clamp(48px, 11vw, 88px), line-height 0.95, #F5F5F5):
        "YOUR IDEA IS WORTHLESS UNTIL IT'S LIVE."
          Let it wrap naturally. Tight and aggressive.

          - Body (DM Sans, 14px, #AAAAAA, margin-top: 12px):
            "We build your launch-ready validation funnel in 48 hours."

            - Offer strip — horizontal scrolling row on mobile, full row on desktop:
              Single line of items separated by a thin vertical rule ( | )
                DM Sans, 12px, #888888, all on one line:
                  Sales Page  |  Waitlist  |  Preorder Flow  |  Lead Capture  |  Analytics  |  Mobile-First  |  CTA Optimization  |  48 Hours

                  - Thin horizontal rule above and below the strip

                  - CTA (margin-top: 16px):
                    "Apply For A Launch Sprint" + circular green ↗ button
                      data-ph-event="apply_cta_click"

                      - Guarantee (DM Sans, 12px, #888888, margin-top: 8px, no gap from CTA):
                        "Delivered in 48 hours or you pay nothing. No questions asked."

                        Sizing rules:
                        - Use clamp() on headline so it never pushes content below the fold
                        - Total vertical space budget: treat 812px height as the ceiling (iPhone SE is the floor)
                        - Spacing between elements: never more than 16px
                        - No decorative elements, no images, no padding waste
                        - The offer strip does the job of the checklist — scannable in one line

                        ---

                        2. PROBLEM — Light background (#EFEFEF)

                        - Section label (small uppercase DM Sans, muted #888888): "THE PROBLEM"

                        - Headline (Bebas Neue, massive, #1A1A1A):
                          "YOU'RE NOT STUCK
                            BECAUSE YOUR IDEA
                              IS BAD."

                              - Body (DM Sans, 18px, #444444, max-width 520px):
                                "You've researched the market. You've tweaked the name. You've built the deck nobody asked for. You're waiting to feel ready — but that feeling never comes. Meanwhile, someone with a worse idea just launched. They're getting signups. You're getting nothing."

                                - Diagnostic block — full width:
                                  Thin horizontal rule above the block
                                    Each item: thin rule above, DM Sans 16px, left-aligned, #1A1A1A
                                      3px solid left border in #2D5A3D on entire block
                                        Em dash prefix on each item:

                                          — Been sitting on this idea for 3+ months?
                                            — Redesigned your logo more than once?
                                              — Built features nobody's asked for yet?
                                                — Waiting until it's "ready enough"?
                                                  — Still in research mode?

                                                  - Closing line below the block (DM Sans, 20px, #1A1A1A):
                                                    "You don't have an idea problem. You have a shipping problem."

                                                    ---

                                                    3. HOW IT WORKS — Dark background (#2D2D2D)

                                                    - Section label (small uppercase DM Sans, muted #888888): "THE PROCESS"

                                                    - Headline (Bebas Neue, large, #F5F5F5):
                                                      "HOW IT WORKS"

                                                      - Three steps stacked vertically on mobile, horizontal row on desktop:
                                                        Each step separated by thin rule on mobile, thin vertical rule on desktop

                                                          Step format:
                                                            - Number: Bebas Neue, large, muted #555555 — "01" "02" "03"
                                                              - Title: DM Sans, bold, #F5F5F5
                                                                - Description: DM Sans, light, #AAAAAA

                                                                  01
                                                                    Send us your idea
                                                                      "Rough idea, messy notes, voice memo — doesn't matter. Fill out a short application and tell us what you're building and who it's for."

                                                                        02
                                                                          We build the launch system
                                                                            "In 48 hours we build a high-converting sales page, lead capture, waitlist or preorder flow, analytics, and a mobile-optimized funnel."

                                                                              03
                                                                                You launch. You validate.
                                                                                  "Go live. Get signups. Find out if people actually want this — before you spend months building the wrong thing."

                                                                                  ---

                                                                                  4. CASE STUDY — Light background (#EFEFEF)

                                                                                  - Section label (small uppercase DM Sans, muted #888888): "PROOF OF EXECUTION"

                                                                                  - Headline (Bebas Neue, large, #1A1A1A):
                                                                                    "FROM IDEA TO LIVE FUNNEL IN UNDER 48 HOURS."

                                                                                    - Subheadline (DM Sans, 16px, muted #888888):
                                                                                      "How we launched Docket."

                                                                                      - Body (DM Sans, 18px, #444444, max-width 520px):
                                                                                        "Docket is a legal document management tool for Ugandan SMEs. The founder had the idea, knew the problem, and had zero online presence. We built the entire launch system in 48 hours."

                                                                                        - Deliverables list:
                                                                                          Same style as diagnostic block — 3px solid left border in #2D5A3D, thin rule between items, em dash prefix:

                                                                                            — Mobile-first landing page with clear positioning
                                                                                              — Preorder flow with low-friction CTA
                                                                                                — Lead capture integrated and live
                                                                                                  — Analytics tracking from day one
                                                                                                    — TikTok-ready funnel entry point

                                                                                                    - Full-width image placeholder:
                                                                                                      Grey rectangle (#CCCCCC), 16:9 ratio
                                                                                                        Centered label text (DM Sans, #888888): "[ Docket — Launch Page Screenshot ]"
                                                                                                          No border. No border-radius. Flush edges. I'll swap in real screenshot later.

                                                                                                          - Closing line (Bebas Neue, 48px, deep green #2D5A3D):
                                                                                                            "THAT'S WHAT VALIDATION LOOKS LIKE."

                                                                                                            ---

                                                                                                            5. OFFER + GUARANTEE — Dark background (#2D2D2D)
                                                                                                               ONE unified section. The guarantee is part of the offer, not separate from it.

                                                                                                               - Section label (small uppercase DM Sans, muted #888888): "WHAT YOU GET"

                                                                                                               - Headline (Bebas Neue, large, #F5F5F5):
                                                                                                                 "EVERYTHING YOU NEED TO LAUNCH.
                                                                                                                   NOTHING YOU DON'T."

                                                                                                                   - Checklist — two columns desktop, single column mobile:
                                                                                                                     Each item: thin horizontal rule above, DM Sans 15px, #F5F5F5
                                                                                                                       Checkmark (✓) in deep green #2D5A3D before each item

                                                                                                                         ✓ High-converting sales page — copywritten and designed
                                                                                                                           ✓ Mobile-first, fast-loading build
                                                                                                                             ✓ Offer positioning and messaging
                                                                                                                               ✓ Waitlist or preorder system
                                                                                                                                 ✓ Lead capture setup
                                                                                                                                   ✓ CTA optimization
                                                                                                                                     ✓ Analytics integration ready for PostHog or GA
                                                                                                                                       ✓ Launch-ready in 48 hours

                                                                                                                                       - IMMEDIATELY below the checklist, flush, no gap, no section break:
                                                                                                                                         Full-width inset block:
                                                                                                                                           Background: #1A1A1A
                                                                                                                                             Padding: 40px horizontal, 36px vertical
                                                                                                                                               No border-radius. Stamped feel.

                                                                                                                                                 Inside the block:
                                                                                                                                                   — Headline (Bebas Neue, 52px, #F5F5F5):
                                                                                                                                                       "DELIVERED IN 48 HOURS OR YOU PAY NOTHING."
                                                                                                                                                         — Body (DM Sans, 15px, #888888, max-width 480px):
                                                                                                                                                             "No vague timelines. No chasing. If we miss the window, you get a full refund. No questions asked."

                                                                                                                                                             ---

                                                                                                                                                             6. FINAL CTA — Light background (#EFEFEF)

                                                                                                                                                             - Headline (Bebas Neue, massive, #1A1A1A — second largest text on the page after hero):
                                                                                                                                                               "STOP PLANNING.
                                                                                                                                                                 START LAUNCHING."

                                                                                                                                                                 - Body (DM Sans, 18px, #444444, max-width 460px):
                                                                                                                                                                   "Every day you don't launch is a day someone else validates the same idea."

                                                                                                                                                                   - CTA:
                                                                                                                                                                     "Apply For A Launch Sprint" + circular green ↗ button
                                                                                                                                                                       data-ph-event="apply_cta_click"

                                                                                                                                                                       - Small muted line below (DM Sans, 13px, #888888):
                                                                                                                                                                         "Applications take 3 minutes. We review within 24 hours."

                                                                                                                                                                         ---

                                                                                                                                                                         7. FOOTER — Dark background (#2D2D2D)

                                                                                                                                                                         Match the existing Web Align footer exactly:

                                                                                                                                                                         - Top: "WA" in large Bebas Neue as logo placeholder
                                                                                                                                                                         - Two-column link grid:

                                                                                                                                                                           Left column:
                                                                                                                                                                               COMPANY (label, small uppercase DM Sans, #888888)
                                                                                                                                                                                   Home
                                                                                                                                                                                       Portfolio
                                                                                                                                                                                           Blog

                                                                                                                                                                                             Right column:
                                                                                                                                                                                                 PORTFOLIO (label)
                                                                                                                                                                                                     Behance
                                                                                                                                                                                                         Dribble
                                                                                                                                                                                                             Pinterest

                                                                                                                                                                                                               Left column:
                                                                                                                                                                                                                   SOCIAL (label)
                                                                                                                                                                                                                       X
                                                                                                                                                                                                                           Whatsapp
                                                                                                                                                                                                                               YouTube

                                                                                                                                                                                                                                 Right column:
                                                                                                                                                                                                                                     CONTACTS (label)
                                                                                                                                                                                                                                         hello@webalign.studio
                                                                                                                                                                                                                                             +256 708 349458

                                                                                                                                                                                                                                             - Thin horizontal rule
                                                                                                                                                                                                                                             - Bottom bar: "PRIVACY POLICY" left | "© WA 2025" right
                                                                                                                                                                                                                                               Both in small uppercase DM Sans, #888888

                                                                                                                                                                                                                                               ---

                                                                                                                                                                                                                                               TECHNICAL REQUIREMENTS:
                                                                                                                                                                                                                                               - React + Tailwind
                                                                                                                                                                                                                                               - Google Fonts: Bebas Neue + DM Sans loaded via @import in global CSS
                                                                                                                                                                                                                                               - Mobile-first. Every section stacks cleanly on small screens.
                                                                                                                                                                                                                                               - Subtle opacity fade-in on scroll via IntersectionObserver — lightweight CSS only
                                                                                                                                                                                                                                               - No sticky nav
                                                                                                                                                                                                                                               - No backend logic — all buttons are static UI only
                                                                                                                                                                                                                                               - data-ph-event="apply_cta_click" on every CTA button — PostHog wired later via Codex
                                                                                                                                                                                                                                               - Image placeholders as grey div boxes with labeled text — no stock images
                                                                                                                                                                                                                                               - Zero heavy dependencies. Fast load is non-negotiable.
                                                                                                                                                                                                                                               - No border-radius anywhere on the page
                                                                                                                                                                                                                                               - No shadows anywhere on the page
                                                                                                                                                                                                                                               - No gradients anywhere on the page