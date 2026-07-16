# Ken Whiley — African Guide (v2)

Multi-page React site: Home / Packages / Gallery / FAQ / Contact.
No backend — enquiries route to Ken's WhatsApp and email.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
```

## Deploy (free)

Cloudflare Pages or Vercel: build `npm run build`, output `dist`.
SPA fallback is already configured (`public/_redirects` for Cloudflare,
`vercel.json` for Vercel) so /packages, /faq etc. work on refresh.

## Key edit points (all in src/App.jsx)

- `CONTACT` — phone / WhatsApp / email
- `VIDEO_SRC` — set to e.g. "/montage.mp4" (file in public/) to turn the
  homepage montage placeholder into an autoplaying, muted, looping video.
  Keep it under ~8 MB; export 1080p, no audio track needed.
- `PACKAGES` — the hunting packages. Set `price: "$5,450"` on any package
  to display a price; `null` shows "Price on request".
- `INCLUDES` / `EXCLUDES` — the package terms lists
- `SPECIES`, `FAQS`, `TESTIMONIALS` — content arrays

## Swapping in real media

Every image slot is `<Ph label="..." />` describing the shot needed. Replace with:

```jsx
<img src="/photos/hero.jpg" alt="..." style={{width:'100%',height:'100%',objectFit:'cover'}} />
```

Photos go in `public/photos/`. Compress first (squoosh.app): ~400 KB each,
hero ~700 KB, montage video ~8 MB max.

Priority media brief for Ken:
1. Hero landscape (min 2400px wide)
2. 20–40s montage video (tracking, glassing, fireside, sunrise drive) OR one wide image
3. Portrait of Ken (4:5)
4. One image per package (6) + per species (12) + gallery (12 per tab)
5. Signature logo as SVG to replace the script-font wordmark

## Routing note

Uses a tiny built-in router (no react-router). To add a page: add it to
`PAGES`, write a component, add a case in `Pages()`, add a nav/footer link.
