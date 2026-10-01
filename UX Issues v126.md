# UI/UX review — v126 (29 Sep 2026)

Legend: 🔴 fix before promoting · 🟠 should fix · ⚪ polish

## Order form — mobile
1. 🔴 Step 2 fields sit two per row at 390px. Email, Instagram and LinkedIn get cut off ("psandeepk33@…", "https://instagra…"). Use one per row on phones.
2. 🔴 The sticky Back/Continue bar covers content. The photo hint, the coupon "Apply" button and the last tile's text slide under it with no divider or fade.
3. 🔴 Payment step still says "Includes 2 changes to your card, made by our team". The confirmation email says "2 / 4 changes a year" too. The plan step no longer promises this.
4. 🟠 "Place order · $49" fills the whole button. With a higher price or ₹1,799 it will overflow. Use "Pay $49" or let the button grow.
5. 🟠 The step 2 heading says "Your Digital Card" even when Motion is selected.
6. 🟠 The step 1 heading "Choose a plan" and "Payment" use a serif font, while step 2 "Your Digital Card" uses the sans font. Headings are inconsistent across steps.
7. 🟠 There's a Back button on step 1 (Plan). There's no step before it, and ✕ already exits. Hide it or make it the same as ✕.
8. 🟠 The India Motion tile breaks the price across 3 lines (₹2,499 / ₹1,799 / "/ year + GST"). Digital also puts "/ year + GST" on its own line. US fits on one line.
9. 🟠 Because all tiles are the same height, the Custom order tile has a large empty gap above "Contact us". In India, Digital has empty space at the bottom.
10. ⚪ The subtitle says "Both plans include…", but there are 3 tiles now.
11. ⚪ The thumbnail grey bars look like a loading skeleton. Either use real mini buttons or leave them out.
12. ⚪ Motion features wrap to 3 lines next to the thumbnail ("Upload a short selfie video or GIF (up to 10 seconds)"). Shorten it to "Selfie video or GIF, up to 10 s".
13. ⚪ The Payment step has a large empty gap between the coupon and the "payment link" note.
14. ⚪ "State Bar / licence no." wraps onto 2 lines in a half-width field with an empty column beside it. Also, "licence" is the UK spelling, but the audience is US.
15. ⚪ "Contact us" is only a mailto link. Many phones have no mail app set up. Add WhatsApp or a form.

## Order form — desktop
16. 🟠 Plan tiles are too narrow. "Digital Card" and "Custom order" wrap to 2 lines, and the "TEAMS 20+" badge breaks in two.
17. 🟠 Desktop shows 3 steps (Plan / Your card / Payment) and mobile shows 4 (with Preview). This is confusing if a user switches devices, and in support conversations.
18. ⚪ The "Create your card" button stays in the header while you're already on the order page.
19. ⚪ The order page H1 is a serif font ("Your digital card, ready to share.") while the rest of the website uses the sans font.

## Website
20. 🔴 The footer phone number is the placeholder "(402) 555-0187". Replace it or remove it.
21. 🟠 In the hero, the animated word "Customers." renders smaller and on a different baseline than "Get More".
22. 🟠 The Digital Business Card page shows both a "Back to services" pill and a breadcrumb for the same thing. Keep one.
23. 🟠 "How it works" has 4 steps in a 3-column grid, so step 04 sits alone on a second row. Use 4 columns, or 2×2.
24. ⚪ Check where the social icons in the footer link to (they may still be placeholders).
25. ⚪ "Get a Free Demo" appears 3 times on the home page. That's fine, but the header one could be quieter.

## Card page
26. 🟠 The "Get a card like this →" link is about 12px tall, below the 44px minimum tap size. Make its tap area larger.
27. ⚪ "POWERED BY NEXBIZRISE" is low contrast on dark cards (about 3:1).
28. ⚪ The name text sits over the portrait's hands, and "TAP" overlaps the portrait. It reads fine on this photo but may clash with other photos.

## Not tested (needs real devices / live data)
- Video upload and playback on iPhone and Android.
- A real order through to the confirmation email, and the edit link.
- The admin panel with live data.
- Prices charged after re-running the SQL.
