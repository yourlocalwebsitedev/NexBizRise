# NexBizRise Website v2 — change list

Direction: **day mode only**, one brand teal `#0B7C86` (white text on buttons), no glows, faint grid, real product UI, mono labels for "live/system" details. Dark mode removed (one look = less to maintain, more consistent, matches the order form).

Legend: ✅ done in `NexBizRise Website v2.dc.html` · ⬜ to do

## Global (every page)
- ✅ Day mode only; theme toggle removed (desktop + mobile)
- ✅ Neon cyan → brand teal everywhere (buttons, chips, links, focus, selection)
- ✅ Drifting glows removed (hero, service pages, missed-call, final CTA)
- ✅ Mobile: sticky "Get a Free Demo" bar removed on all pages
- ⬜ Header: one CTA only ("Get a Free Demo") on desktop; on mobile it lives only inside the menu
- ⬜ Section eyebrows: switch to the mono "pill" style used in the hero (consistent system feel)
- ⬜ Cards/panels: one radius (16px), one border (1px, 8% ink), no shadows except product mockups
- ⬜ Footer: add Pricing, Industries, Privacy, Terms, Refund links (needed for Stripe)
- ⬜ Logo: check the mark reads well on white (use teal-only version if the gradient looks washed out)
- ⬜ Remove leftover `@keyframes nbrDrift` and dark theme tokens from code

## Home
- ✅ Hero: live "AGENTIC AI FOR GROWING BUSINESSES" pill, workflow header "LIVE · 142 RUNS TODAY", stat tiles (4 sec / 100% / 24/7)
- ✅ Quick replies are industry-neutral (New booking · Get a quote · Question · Other)
- ✅ Phone mock hidden on mobile so proof shows sooner; pill overlap fixed
- ✅ Benefits grid: 4 / 2 / 1 columns (no empty grey cell)
- ✅ "Works with" row (Google Calendar, Gmail, WhatsApp, SMS, Stripe, Google Business)
- ⬜ Missed-call cost calculator (calls/week × job value = lost per month vs $300/mo)
- ⬜ Pricing strip: Cards from $49/yr · Automation from $300/mo · Book a demo
- ⬜ Testimonial slot (add when first client quote exists)
- ⬜ Headline: keep current, or switch to "Websites and AI agents that win you more customers." (your call)

## Services (list)
- ⬜ Reorder cards by revenue: Missed-Call Recovery → AI Automations → Websites → Digital Business Card
- ⬜ Each card: one-line outcome + "from" price

## Service pages (Websites · AI Automations · Missed-Call Recovery · Digital Business Card)
- ✅ "Back to services" button
- ⬜ Hero icon tile: teal outline style, no glow
- ⬜ "What's included" box and steps: same panel style as home
- ⬜ Missed-Call Recovery: add the live workflow + calculator (main sales page)
- ⬜ Digital Business Card: sample-card switcher chips in teal; "Order your card" button teal

## How It Works
- ⬜ Steps as a numbered workflow (same node style as hero), not plain cards

## Results
- ⬜ Replace generic stats with example dashboard (card views · leads · booked); label as example until real data

## About
- ⬜ Short founder story + photo; "Built in Kansas City" line; remove filler

## Contact / Demo
- ⬜ Form inputs: white fields, teal focus ring, 48px height
- ⬜ Add "What happens next" (reply within 1 business day · 15-min call · live demo)

## Order your card (website + card.nexbizrise.com/order)
- ✅ Website version: day mode only, teal buttons/progress/selection (matches v2)
- ✅ Card-subdomain version keeps its cream/green card skin (product side, matches client cards)
- ⬜ Plan cards: same panel style as home; "Popular" pill in teal
- ⬜ Confirmation screen: teal primary button

## Client card pages
- ✅ Keep their own styles (Personal / Professional / Luxury) — customer choice
- ⬜ "Get a card like this" plans sheet: link to website pricing

## Admin panel (internal, last)
- ⬜ Switch accent to teal and day mode for consistency (low priority)

## Go-live
- ⬜ When approved: v2 → `NexBizRise Website.dc.html`, rebuild deploy copies + `_worker.js`
  (Order Card changes are in source now; they reach the live site with the next rebuild)
