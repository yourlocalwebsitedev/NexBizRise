NexBizRise - changes for git push (ok v126)

Copy each folder over the same path in your repo, then:
  git add -A
  git commit -m "v126: mobile plan picker, new pricing, video portraits, new logo"
  git push

Changed files:
  Order Card.dc.html, Tap Card.dc.html, NexBizRise Website v2.dc.html, Admin Panel.dc.html  <- source files (repo root)
  assets/*.png                      <- new logo images (source)
  deploy/single/_worker.js          <- the live site (health: ok v126)
  deploy/single/assets/*.png        <- new logo images (3 files)
  deploy/website/index.html         <- homepage
  deploy/website/order.html         <- order form
  deploy/website/Order Card.dc.html
  deploy/website/card.html          <- card page
  deploy/website/Tap Card.dc.html
  deploy/website/Admin Panel.dc.html
  supabase/ALL-IN-ONE.sql           <- re-run in Supabase after push

What changed:
  - Mobile plan step: radio tiles, card thumbnails, equal heights, Custom order (teams 20+) tile
  - Pricing: US $49 (was $69) / $79 (was $99); IN Rs 799 (was 999) / Rs 1799 (was 2499)
  - Back/Continue pill buttons on mobile
  - Digital: photo only. Motion: photo, GIF (<=5 MB, <=10 s) or phone video (auto-shrunk to <=10 s)
  - Video portraits play on cards; server accepts MP4/WebM with range requests; upload limit 5 MB
  - "Get a card like this ->" on every card opens the plan step; close returns to the card
  - Close on website order form returns to the page you came from
  - New elephant logo
