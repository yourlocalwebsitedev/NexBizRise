# Business types review — order form, mobile (v127)

> Fixed in v128: placeholders per business, Home Services in picker, per-business style names, office/clinic address for Health & Legal, Beauty prices in Services, US "license" spelling, India brokerage optional, per-business Instagram/LinkedIn, Corporate category "Consulting", consistent picker names. Not done: languages / insurance-accepted fields for Health (need card display first).

Scoring: ✅ Good · 🟡 Needs changes · 🔴 Bad
Checked: the business picker, the fields shown, the labels and placeholders, the design collections, and the default tagline.

## Summary
| Type | Score | Main fix |
|---|---|---|
| Real Estate | ✅ | Label the licence as RERA no. for India, and make Brokerage optional there |
| Health & Clinics | 🟡 | Design style names are real-estate words; add clinic address and specialty |
| Legal & Finance | 🟡 | Add office address; spell it "license" for the US |
| Beauty & Wellness | 🟡 | Add a price list or starting price; hide LinkedIn |
| Corporate & Consultants | 🟡 | Default tagline "Let's connect" is generic; put LinkedIn first |
| Personal | ✅ | Fine as the catch-all |
| Home Services (hidden) | 🔴 | Fields and colours exist but it's not in the picker |

## Issues that affect every type
1. 🔴 **Placeholders are real-estate examples for everyone:** Job title "Property Consultant" and Business name "Skyline Realty". A dentist sees "Property Consultant". Make placeholders match the business, for example Health "Dentist / Clinic Owner", Beauty "Hair Stylist", Legal "Advocate / CA".
2. 🟠 **The picker uses two sets of names:** the dropdown says "Property / Health / Beauty / Legal", but the rest of the form says "Real Estate / Health & Clinics / Beauty & Wellness / Legal & Finance". Pick one set.
3. 🟠 **Design style names are real-estate words:** every business uses the same 4 styles, named Poster / List / Blueprint / Home. "Blueprint" and "Home" make sense for property, not a clinic or salon. Rename them per business (e.g. Health "Clinic / Clean / Calm / Classic"), or use neutral names (Bold / List / Grid / Classic).
4. 🟠 **Three professions exist in the code but can't be picked:** Home Services, Interior / Design and Retail / Shop. Plumbers, electricians and shop owners fall back to "Personal" and lose their fields. Home Services is already built (licence no., service area, insured, 24×7, quote link, colour palette). Adding it to the picker is a quick win.
5. ⚪ **Instagram and LinkedIn show for every type:** decide per business which to show first and which to hide (see below).

## Per type

### Real Estate ✅
- **Fields:** brokerage, licence no. and state, listings page, showing booking link, office address, Facebook and the Texas IABS form.
- **Designs:** 4 real-estate styles.
- **Tagline:** "Buy · Sell · Rent".
- **Fix:**
  - India: label "License number" as "RERA no.", make Brokerage optional (many agents are independent) and hide Facebook-first ordering.

### Health & Clinics 🟡
- **Good:** registration no. (Medical Council / NPI), qualifications, opening hours and an appointment booking link.
- **Missing:** clinic address with a map link (most important for patients), specialty (e.g. Orthodontist), languages spoken. For the US, "insurance accepted".
- **Remove:** LinkedIn from the default fields.
- **Tagline** "Care · Treat · Heal" is fine.

### Legal & Finance 🟡
- **Good:** Bar / CA / ARN no., practice areas and a consultation booking link.
- **Missing:** office address. It's only on for Real Estate now, but clients visit lawyers and CAs.
- **Fix:**
  - US spelling: "State Bar / license no."
  - The India example "K/1234/2008" is right.
- **Consider:** an optional short disclaimer line, since some bar councils restrict advertising.

### Beauty & Wellness 🟡
- **Good:** services list, opening hours, booking link (Fresha / Booksy).
- **Missing:** a starting price or a short price list (the most-asked question for salons).
- **Order:** put Instagram first and hide LinkedIn.
- **Tagline mismatch:** the collection sets "Style · Care · Glow", but the preset still says "Design · Style · Transform". Keep one.

### Corporate & Consultants 🟡
- **Fields:** only a meeting link beyond the basics. That's fine, but:
  - Put LinkedIn first and make it prominent.
  - Hide Instagram by default.
- **Default category** "Let's connect" is generic. Use the job title, or "Consulting".

### Personal ✅
- It works as the catch-all.
- It has 3 design collections (Personal / Professional / Luxury), which is good choice without clutter.
- **Minor:** "Any profession" as the subtitle is clear.

## Suggested order of work
1. Business-specific placeholders (small change, big improvement).
2. Add Home Services to the picker (already built).
3. Rename the design styles per business.
4. Add address for Health and Legal, a price field for Beauty, and RERA for India.
5. Per-business social link order.

## Not checked here
The live card preview inside the form: the screenshot tool can't capture it. Check each type's design on a real phone.
