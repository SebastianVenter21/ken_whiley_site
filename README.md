# Ken Whiley — African Guide (v3)

Multi-page React site: Home / Packages / Gallery / FAQ / Contact.
No backend — enquiries route to Ken's email (primary) and WhatsApp/phone.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
```

## Deploy (free)

Cloudflare Pages — build `npm run build`, output `dist`.
IMPORTANT: create it under the **Pages** tab, not Workers.
SPA fallback is configured (`public/_redirects`, `vercel.json`) so /packages,
/faq etc. work on refresh.

## Brand assets (already included)

- `public/fonts/Naturally.woff2` + `Naturally-Italic.woff2` — the client's
  display font, used for all headings/accents via the `--disp` CSS variable.
  Body text stays Karla.
- `public/logo/ken-whiley-white.png` — used in nav, footer, guide sign-off
- `public/logo/ken-whiley-black.png` — spare (for light backgrounds / print)

## Key edit points (all in src/App.jsx)

- `CONTACT` — phone / WhatsApp / email (currently whiley.kt@gmail.com)
- `VIDEO_SRC` — set to e.g. "/montage.mp4" (file in public/) to turn the
  homepage montage placeholder into an autoplaying, muted, looping video.
- `PACKAGES` — the 4 hunting packages. Set `price: "$5,450"` to show a price;
  `null` shows "Price on request".
- `EXPERIENCES` — each has `detail` (paragraphs) + `slides` (slideshow captions).
  Clicking a card opens the detail panel with an auto-advancing slideshow.
- `INCLUDES` / `EXCLUDES` — package terms
- `FAQS`, `TESTIMONIALS` — content arrays

## Contact model

Email is the primary channel (many clients are US-based and don't use WhatsApp).
The reusable `ContactChannels` block leads with an emphasized email option and
shows WhatsApp + phone as secondary. It appears on the Contact page and at the
bottom of the Packages page ("Don't see your safari here? / Let's build it together").

## Swapping in real media

Every image slot is `<Ph label="..." />` describing the shot needed. Replace with:

```jsx
<img src="/photos/hero.jpg" alt="..." style={{width:'100%',height:'100%',objectFit:'cover'}} />
```

Photos go in `public/photos/`. Compress first (squoosh.app): ~400 KB each,
hero ~700 KB, montage video ~8 MB max.

Priority media brief for Ken:
1. Hero landscape (min 2400px wide)
2. Montage: 20-40s video OR wide image (homepage, under hero)
3. Portrait of Ken (4:5) for the Guide section
4. 4 slides per experience (5 experiences = 20 shots) for the slideshows
5. One image per package (4) + gallery (12 per tab)

## What changed in v3

- Email is now the primary contact (was WhatsApp); email is whiley.kt@gmail.com
- Naturally font on all headings; real signature logos in nav/footer/sign-off
- Packages cut from 6 to 4
- Experiences: Cape Town removed; feature spans 2 rows; cards are clickable and
  open a detail panel with a photo slideshow
- Slow Safari: 7+3 day-block illustration replaced with tagline + contact button
- Packages page: species explorer replaced with a "Let's build it together"
  contact block
- Copyright year set to 2001
