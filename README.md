# Ken Whiley — African Guide

Private hunting-safari site for Ken Whiley. React + Vite, no backend —
enquiries route to Ken's email (primary) and WhatsApp/phone.

## Folder map

```
Ken_Whiley/
├── src/
│   ├── App.jsx            the entire site (pages, data, styles)
│   └── main.jsx           React entry point
├── public/                served as-is by Vite
│   ├── photos/            18 web-optimized safari photos (live)
│   ├── fonts/             Naturally.woff2 + italic (display font)
│   ├── logo/              ken-whiley-white.png / -black.png (web)
│   └── _redirects         SPA fallback for Cloudflare
├── index.html
├── package.json · vite.config.js · vercel.json
├── README.md              this file
└── _source/               raw originals — GITIGNORED, never deployed
    ├── photos-original/   20 full-res WeTransfer originals
    ├── brand/             logo, fonts, brand deck (originals)
    └── README.md          photo→slot map + what's still needed
```

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (live preview, hot reload)
npm run build      # -> dist/
```

## Deploy (Cloudflare Pages — auto-deploys on git push)

```bash
npm run build      # optional local check
git add .
git commit -m "your message"
git push           # Cloudflare rebuilds in ~90s
```

Build command `npm run build`, output `dist`. SPA fallback is configured
(`public/_redirects`, `vercel.json`) so /packages, /faq etc. work on refresh.

## Pages

Home (hero · montage · the guide · slow safari · experiences · packages
preview · testimonials · contact CTA), Packages, Gallery, FAQ, Contact.

## Key edit points — all in `src/App.jsx`

- `CONTACT`        phone / WhatsApp / email (whiley.kt@gmail.com)
- `VIDEO_SRC`      set to "/montage.mp4" (file in public/) to turn the
                   homepage montage image into an autoplaying muted video
- `PACKAGES`       the 4 hunting packages; set `price:` to show a figure
- `EXPERIENCES`    each has `detail` paragraphs + `slides` (photo slideshow)
- `FAQS`, `TESTIMONIALS`, `INCLUDES`, `EXCLUDES`

## Photos

Live photos are in `public/photos/`, referenced as `/photos/<name>.jpg`.
The full-res originals and the exact original→web mapping live in
`_source/` (see `_source/README.md`). To swap a photo: drop a new file in
`public/photos/` with the same name, or add one and point its `src` at it.

Email is the primary contact channel (many clients are US-based and don't
use WhatsApp); WhatsApp and phone are secondary throughout. Footer © 2001.
