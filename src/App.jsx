import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Phone, Mail, MessageCircle, Camera, Menu, X, ChevronDown, ArrowRight,
  Compass, Crosshair, Fish, Telescope, Truck, Check, Film, Minus,
} from "lucide-react";

/* ============================================================
   KEN WHILEY — AFRICAN GUIDE  (v2)
   Multi-page single-file React site. No backend required.

   Pages: Home / Packages / Gallery / FAQ / Contact
   - Tiny built-in router (no react-router needed; works on
     static hosts and inside sandboxed previews)
   - Replace <Ph/> placeholders with real photos
   - Montage section: set VIDEO_SRC below to enable video
   ============================================================ */

const CONTACT = {
  phone: "+27 83 412 6003",
  phoneHref: "tel:+27834126003",
  waNumber: "27834126003",
  email: "whiley.kt@gmail.com",
};

/* Pre-filled mailto — the primary contact channel (many clients are US-based
   and don't use WhatsApp) */
const mailLink = (subject, body = "") =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

/* Drop an mp4 in public/ (e.g. /montage.mp4) and set it here to
   replace the montage placeholder with autoplaying video. */
const VIDEO_SRC = null; // e.g. "/montage.mp4"

const waLink = (text) =>
  `https://wa.me/${CONTACT.waNumber}?text=${encodeURIComponent(text)}`;

/* ---------------- global styles ---------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400;0,600;0,700;1,400&family=Karla:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

/* Client brand face — used for display headings & accents only */
@font-face{
  font-family:'Naturally';
  src:url('/fonts/Naturally.woff2') format('woff2');
  font-weight:400;font-style:normal;font-display:swap;
}
@font-face{
  font-family:'Naturally';
  src:url('/fonts/Naturally-Italic.woff2') format('woff2');
  font-weight:400;font-style:italic;font-display:swap;
}

:root{
  --ink:#161511;
  --ink-2:#1e1d16;
  --ink-3:#26251c;
  --veld:#39402e;
  --khaki:#a99b6e;
  --khaki-dim:rgba(169,155,110,.55);
  --bone:#efe8d8;
  --bone-dim:rgba(239,232,216,.68);
  --bone-faint:rgba(239,232,216,.42);
  --ember:#c05a2e;
  --line:rgba(169,155,110,.22);
  /* Naturally for display; Besley is the readable serif fallback while it loads */
  --disp:'Naturally', 'Besley', Georgia, serif;
  --body:'Karla', system-ui, sans-serif;
  --mono:'IBM Plex Mono', ui-monospace, monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--bone);font-family:var(--body);line-height:1.6;-webkit-font-smoothing:antialiased}
img,video{max-width:100%;display:block}
a{color:inherit}
.kw{overflow-x:hidden}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
section{padding:104px 0}
@media(max-width:760px){section{padding:72px 0}}

.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--khaki);display:flex;align-items:center;gap:12px;margin-bottom:20px}
.eyebrow::before{content:"";width:34px;height:1px;background:var(--khaki)}
h1,h2,h3{font-family:var(--disp);font-weight:400;line-height:1.15;letter-spacing:0}
h2{font-size:clamp(38px,5.2vw,66px);margin-bottom:22px}
h3{font-size:27px}
.lead{font-size:18px;color:var(--bone-dim);max-width:62ch}

.btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:13px;letter-spacing:.14em;text-transform:uppercase;padding:15px 26px;border:1px solid var(--khaki);color:var(--bone);text-decoration:none;background:transparent;cursor:pointer;transition:background .25s,color .25s,border-color .25s}
.btn:hover{background:var(--khaki);color:var(--ink)}
.btn.solid{background:var(--ember);border-color:var(--ember);color:var(--bone)}
.btn.solid:hover{background:#a94b24;border-color:#a94b24;color:var(--bone)}
.btn:focus-visible,a:focus-visible,button:focus-visible{outline:2px solid var(--ember);outline-offset:3px}

/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:60;transition:background .3s,border-color .3s;border-bottom:1px solid transparent}
.nav.scrolled,.nav.opaque{background:rgba(22,21,17,.94);backdrop-filter:blur(8px);border-color:var(--line)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:76px}
.logo{display:flex;align-items:center;text-decoration:none;background:none;border:none;cursor:pointer;padding:0}
.logo img{height:46px;width:auto;display:block}
@media(max-width:560px){.logo img{height:38px}}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links button,.nav-links a{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;color:var(--bone-dim);transition:color .2s;background:none;border:none;cursor:pointer;padding:0}
.nav-links button:hover,.nav-links a:hover{color:var(--bone)}
.nav-links button.active{color:var(--bone);border-bottom:1px solid var(--ember);padding-bottom:3px}
.nav-links .btn{padding:10px 18px;border:1px solid var(--khaki)}
.nav-links .btn:hover{color:var(--ink)}
.burger{display:none;background:none;border:none;color:var(--bone);cursor:pointer}
@media(max-width:980px){
  .nav-links{display:none}
  .nav-links.open{display:flex;position:absolute;top:76px;left:0;right:0;flex-direction:column;align-items:flex-start;background:var(--ink-2);padding:28px 24px;gap:22px;border-bottom:1px solid var(--line)}
  .burger{display:block}
}

/* hero — deliberately sparse */
.hero{position:relative;min-height:100svh;display:flex;align-items:center;padding:0}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-grad{position:absolute;inset:0;background:linear-gradient(to top,var(--ink) 2%,rgba(22,21,17,.45) 40%,rgba(22,21,17,.30) 100%);z-index:1}
.hero-in{position:relative;z-index:2;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center}
.hero .since{font-family:var(--mono);font-size:13px;letter-spacing:.3em;color:var(--khaki);text-transform:uppercase;margin-bottom:22px}
.hero h1{font-size:clamp(46px,8vw,104px);max-width:12ch;margin-bottom:22px}
.hero h1 em{font-style:italic;color:var(--khaki)}
.hero p{font-size:19px;color:var(--bone-dim);max-width:46ch;margin:0 0 38px}
.hero-ctas{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.hero-scroll{position:absolute;bottom:34px;left:50%;transform:translateX(-50%);z-index:2;color:var(--khaki);font-family:var(--mono);font-size:10px;letter-spacing:.3em;text-transform:uppercase;display:flex;flex-direction:column;align-items:center;gap:10px}
.hero-scroll::after{content:"";width:1px;height:44px;background:linear-gradient(var(--khaki),transparent)}

/* montage — media band that scrolls into the guide */
.montage{padding:0;position:relative}
.montage-frame{position:relative;height:78vh;min-height:420px;overflow:hidden}
.montage-media{position:absolute;inset:-12% 0;will-change:transform}
.montage-media video{width:100%;height:100%;object-fit:cover}
.montage-cap{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:26px 0;background:linear-gradient(transparent,rgba(22,21,17,.85))}
.montage-cap span{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--bone-dim);display:flex;align-items:center;gap:10px}

/* guide — overlaps montage */
.guide{padding-top:0;margin-top:-72px;position:relative;z-index:3}
.intro-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:72px;align-items:center}
.intro-card{background:var(--ink);border:1px solid var(--line);padding:64px 56px}
.intro-copy p{color:var(--bone-dim);margin-bottom:18px;font-size:17px}
.intro-copy .sign{margin-top:30px}
.intro-copy .sign img{height:64px;width:auto;opacity:.92}
.intro-photo{aspect-ratio:4/5}
.intro-photo .frame{position:relative;height:100%}
.intro-photo .frame::after{content:"";position:absolute;inset:0;transform:translate(16px,16px);border:1px solid var(--line);pointer-events:none}
@media(max-width:900px){.intro-grid{grid-template-columns:1fr;gap:44px}.intro-card{padding:44px 28px}}

/* slow safari band */
.slow{background:var(--ink-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.slow-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px}
.slow blockquote{font-family:var(--disp);font-style:italic;font-size:clamp(21px,2.5vw,28px);line-height:1.45;color:var(--bone)}
.slow blockquote footer{font-family:var(--mono);font-style:normal;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--khaki);margin-top:20px}
.slow .vm h3{color:var(--khaki);font-size:15px;font-family:var(--mono);letter-spacing:.2em;text-transform:uppercase;font-weight:500;margin-bottom:10px}
.slow .vm p{color:var(--bone-dim);margin-bottom:26px}
@media(max-width:860px){.slow-grid{grid-template-columns:1fr}}

/* 7+3 commitment ribbon */
.ribbon{margin-top:44px;padding:44px 40px;border:1px solid var(--khaki);background:linear-gradient(120deg,rgba(192,90,46,.10),transparent 55%);text-align:center}
.ribbon-tag{font-family:var(--mono);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--khaki);margin-bottom:14px}
.ribbon h3{font-family:var(--disp);font-size:clamp(28px,3.4vw,40px);margin-bottom:12px}
.ribbon p{color:var(--bone-dim);font-size:16px;margin:0 auto 26px;max-width:56ch}

/* experiences */
.exp-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:1px;background:var(--line);border:1px solid var(--line)}
.exp{background:var(--ink);padding:34px 30px;display:flex;flex-direction:column;gap:14px;min-height:230px;transition:background .25s;cursor:pointer;text-align:left;border:none;color:inherit;font:inherit;position:relative}
.exp:hover{background:var(--ink-2)}
.exp .ico{color:var(--khaki)}
.exp h3{font-size:24px}
.exp p{color:var(--bone-dim);font-size:15px;flex:1}
.exp .foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:4px}
.exp .where{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--khaki-dim)}
.exp .go{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--khaki);opacity:0;transform:translateX(-6px);transition:opacity .25s,transform .25s}
.exp:hover .go,.exp.active .go{opacity:1;transform:none}
.exp.active{background:var(--ink-2)}
.exp.active::after{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ember)}
/* feature spans the full left column, two rows tall */
.exp.feature{grid-row:span 2;background:var(--veld);justify-content:flex-start}
.exp.feature:hover,.exp.feature.active{background:#414833}
.exp.feature h3{font-size:30px;margin-top:8px}
.exp.feature p{font-size:16px}
@media(max-width:920px){.exp-grid{grid-template-columns:1fr 1fr}.exp.feature{grid-row:span 1;grid-column:span 2}}
@media(max-width:600px){.exp-grid{grid-template-columns:1fr}.exp.feature{grid-column:span 1}}

/* expandable detail panel — mirrors "The Guide" layout */
.exp-detail{border:1px solid var(--khaki);border-top:none;background:var(--ink-2);overflow:hidden;animation:expOpen .4s ease}
@keyframes expOpen{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.exp-detail-in{display:grid;grid-template-columns:1fr 1.1fr;gap:0}
.exp-detail .copy{padding:52px 48px}
.exp-detail .copy .ico{color:var(--khaki);margin-bottom:18px}
.exp-detail .copy h3{font-size:34px;margin-bottom:8px}
.exp-detail .copy .where{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--khaki);display:block;margin-bottom:22px}
.exp-detail .copy p{color:var(--bone-dim);font-size:16px;margin-bottom:16px}
.exp-detail .copy .btn{margin-top:14px}
.exp-detail .show{position:relative;min-height:420px}
@media(max-width:860px){.exp-detail-in{grid-template-columns:1fr}.exp-detail .copy{padding:36px 28px}.exp-detail .show{min-height:300px}}

/* slideshow */
.slides{position:absolute;inset:0}
.slide{position:absolute;inset:0;opacity:0;transition:opacity .8s ease}
.slide.on{opacity:1}
.slides-dots{position:absolute;bottom:18px;left:0;right:0;z-index:3;display:flex;gap:8px;justify-content:center}
.slides-dots button{width:8px;height:8px;border-radius:50%;border:none;background:rgba(239,232,216,.4);cursor:pointer;padding:0;transition:background .2s,transform .2s}
.slides-dots button.on{background:var(--ember);transform:scale(1.3)}

/* package cards */
.pk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.pk{border:1px solid var(--line);background:var(--ink-2);display:flex;flex-direction:column;transition:transform .25s,border-color .25s}
.pk:hover{transform:translateY(-4px);border-color:var(--khaki-dim)}
.pk.feature{border-color:var(--ember)}
.pk .img{aspect-ratio:16/10;position:relative}
.pk .flag{position:absolute;top:14px;left:14px;z-index:2;background:var(--ember);color:var(--bone);font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:6px 12px}
.pk .body{padding:26px;display:flex;flex-direction:column;flex:1}
.pk .meta{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--khaki);margin-bottom:8px}
.pk h3{font-size:23px;margin-bottom:12px}
.pk ul{list-style:none;margin:0 0 18px;flex:1}
.pk ul li{display:flex;gap:10px;align-items:baseline;font-size:14.5px;color:var(--bone-dim);padding:5px 0;border-bottom:1px solid var(--line)}
.pk ul li svg{flex-shrink:0;color:var(--khaki);transform:translateY(2px)}
.pk .price{font-family:var(--disp);font-size:20px;margin-bottom:16px}
.pk .price small{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-faint);margin-top:4px}
.pk .btn{justify-content:center}
@media(max-width:960px){.pk-grid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.pk-grid{grid-template-columns:1fr}}

/* includes / excludes */
.incl-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:56px}
.incl{border:1px solid var(--line);padding:34px;background:var(--ink-2)}
.incl h3{font-family:var(--mono);font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:500;margin-bottom:18px}
.incl.yes h3{color:var(--khaki)}
.incl.no h3{color:var(--bone-faint)}
.incl li{display:flex;gap:12px;align-items:baseline;list-style:none;padding:7px 0;color:var(--bone-dim);font-size:15px}
.incl li svg{flex-shrink:0;transform:translateY(2px)}
.incl.yes li svg{color:var(--khaki)}
.incl.no li svg{color:var(--bone-faint)}
@media(max-width:760px){.incl-grid{grid-template-columns:1fr}}

/* species */
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:30px 0 34px}
.chip{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:9px 18px;border:1px solid var(--line);background:transparent;color:var(--bone-dim);cursor:pointer;transition:all .2s}
.chip:hover{border-color:var(--khaki)}
.chip.on{background:var(--khaki);border-color:var(--khaki);color:var(--ink)}
.sp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.sp{border:1px solid var(--line);background:var(--ink-2);display:flex;flex-direction:column;transition:transform .25s,border-color .25s}
.sp:hover{transform:translateY(-4px);border-color:var(--khaki-dim)}
.sp .img{aspect-ratio:4/3}
.sp .body{padding:18px}
.sp h3{font-size:18px;margin-bottom:4px}
.sp .cat{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ember)}
.sp p{font-size:13.5px;color:var(--bone-dim);margin-top:8px}
@media(max-width:1000px){.sp-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:720px){.sp-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:440px){.sp-grid{grid-template-columns:1fr}}

/* gallery */
.tabs{display:flex;gap:10px;margin-bottom:30px;flex-wrap:wrap}
.gal-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:190px;gap:14px}
.gal-grid .ph:nth-child(6n+1){grid-column:span 2;grid-row:span 2}
.gal-grid .ph:nth-child(6n+4){grid-row:span 2}
@media(max-width:820px){.gal-grid{grid-template-columns:repeat(2,1fr)}}

/* testimonials */
.tst-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.tst{border:1px solid var(--line);padding:30px;background:var(--ink-2)}
.tst p{font-family:var(--disp);font-style:italic;font-size:17px;line-height:1.55;color:var(--bone-dim)}
.tst footer{margin-top:20px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--khaki)}
@media(max-width:820px){.tst-grid{grid-template-columns:1fr}}

/* faq */
.faq-item{border-bottom:1px solid var(--line)}
.faq-q{width:100%;background:none;border:none;color:var(--bone);font-family:var(--disp);font-size:19px;text-align:left;padding:24px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;cursor:pointer}
.faq-q svg{flex-shrink:0;color:var(--khaki);transition:transform .25s}
.faq-item.open .faq-q svg{transform:rotate(180deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
.faq-item.open .faq-a{max-height:340px}
.faq-a p{color:var(--bone-dim);padding:0 0 24px;max-width:70ch;font-size:15.5px}

/* page hero (interior pages) */
.page-hero{padding:170px 0 70px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,var(--ink-2),var(--ink))}
.page-hero h1{font-size:clamp(38px,5.6vw,66px);margin-bottom:14px}

/* contact */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px}
.c-list{display:flex;flex-direction:column;gap:6px;margin-top:30px}
.c-item{display:flex;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid var(--line);text-decoration:none;color:var(--bone);transition:color .2s}
.c-item:hover{color:var(--khaki)}
.c-item svg{color:var(--khaki);flex-shrink:0}
.c-item span{font-size:17px;display:flex;flex-direction:column;gap:2px}
.c-item span em{font-style:normal;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--khaki-dim)}
.c-item.primary{padding:22px 20px;border:1px solid var(--ember);background:linear-gradient(120deg,rgba(192,90,46,.12),transparent 60%);margin-bottom:8px}
.c-item.primary:hover{color:var(--bone);border-color:var(--ember);background:linear-gradient(120deg,rgba(192,90,46,.2),transparent 60%)}
.c-item.primary svg{color:var(--ember)}
.c-item.primary span{font-size:19px}
.form .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form input,.form textarea{width:100%;background:var(--ink-2);border:1px solid var(--line);color:var(--bone);font-family:var(--body);font-size:15px;padding:14px 16px;margin-bottom:14px}
.form input:focus,.form textarea:focus{outline:none;border-color:var(--khaki)}
.form ::placeholder{color:var(--bone-faint)}
@media(max-width:860px){.contact-grid{grid-template-columns:1fr}.form .row{grid-template-columns:1fr}}

/* cta band */
.cta-band{background:var(--veld);border-top:1px solid var(--line);text-align:center}
.cta-band h2{max-width:20ch;margin:0 auto 14px}
.cta-band p{color:var(--bone-dim);max-width:52ch;margin:0 auto 34px}

/* footer */
.foot{border-top:1px solid var(--line);padding:44px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.foot small{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--bone-faint);text-transform:uppercase}
.foot nav{display:flex;gap:20px;flex-wrap:wrap}
.foot nav button{background:none;border:none;cursor:pointer;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-dim)}
.foot nav button:hover{color:var(--bone)}

/* placeholder */
.ph{position:relative;background:
  repeating-linear-gradient(45deg,rgba(169,155,110,.06) 0 12px,transparent 12px 24px),
  linear-gradient(160deg,var(--ink-3),var(--ink-2));
  border:1px dashed var(--khaki-dim);display:flex;align-items:center;justify-content:center;overflow:hidden;width:100%;height:100%;min-height:180px}
.ph-tag{display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--khaki);text-align:center;padding:18px}
.ph-tag span{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;max-width:28ch;line-height:1.7}

/* reveal */
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){
  *{transition:none!important;animation:none!important}
  .rv{opacity:1;transform:none}
  .montage-media{transform:none!important}
  html{scroll-behavior:auto}
}
`;

/* ---------------- data ---------------- */

const EXPERIENCES = [
  {
    id: "hunting",
    icon: Crosshair, feature: true,
    title: "Private Hunting Safaris",
    where: "South Africa · Best area for your species",
    text: "The core of what I do. We are not stuck on one property — I plan your hunt around your target species and take you to the best ground for it.",
    detail: [
      "This is where twenty-five years of guiding earns its keep. I am not tied to a single fence line — I plan the hunt around your wishlist and take you to the ground where those animals actually are, whether that's the open Karoo flats for gemsbok or thick riverine bush for a bushbuck.",
      "You hunt one-on-one with me from the first morning to the last. I'm personally involved from the planning stages until I put you back on the plane — no middleman, no corporate sales desk, no strangers rotated through your camp.",
    ],
    slides: [
      { src: "/photos/tracking-on-foot.jpg", label: "Walking in toward the mountains at first light" },
      { src: "/photos/kudu-ridge.jpg", label: "Kudu on the ridge" },
      { src: "/photos/ken-portrait.jpg", label: "Glassing the far slope" },
      { src: "/photos/kudu-recovered.jpg", label: "A kudu taken on foot, Eastern Cape" },
    ],
  },
  {
    id: "photographic",
    icon: Telescope,
    title: "Big Five Photographic Safaris",
    where: "Southern Africa",
    text: "For the non-hunters in your party, or the days between hunts — get close to the Big Five with a guide who has spent 25 years reading this bush.",
    detail: [
      "Not everyone in the party carries a rifle, and not every day is a hunting day. A photographic safari puts you close to elephant, lion, buffalo, leopard and rhino with someone who knows how they move and where they'll be.",
      "It's the perfect counterweight to the hunt — a slower, camera-in-hand way to read the same wilderness, ideal for spouses, kids and the rest days built into every slow safari.",
    ],
    slides: [
      { src: "/photos/giraffe-silhouette.jpg", label: "Giraffe against a moody sky" },
      { src: "/photos/buffalo-herd.jpg", label: "Buffalo herd in the green veld" },
      { src: "/photos/zebra-herd.jpg", label: "Zebra on the move" },
      { src: "/photos/giraffe-pair.jpg", label: "A pair of giraffe at dusk" },
    ],
  },
  {
    id: "fishing",
    icon: Fish,
    title: "Tailored Fishing Trips",
    where: "Cape Coast & Inland Waters",
    text: "From deep-sea runs off the Cape to quiet inland waters. Built around your group, your pace, your species.",
    detail: [
      "A change of pace and a change of quarry. We run anything from deep-sea trips off the Cape coast to quiet days on inland waters, shaped entirely around your group and what you'd like to chase.",
      "It slots neatly into a longer safari — a day or two on the water between hunts, or a dedicated trip for the anglers in the family.",
    ],
    slides: [
      { label: "Deep-sea catch held up on the boat" },
      { label: "Boat heading out past the Cape swells" },
      { label: "Quiet inland water at dawn" },
      { label: "Client with a fish, big grin" },
    ],
  },
  {
    id: "okavango",
    icon: Compass,
    title: "Okavango Delta Experiences",
    where: "Botswana",
    text: "Exclusive Delta experiences for you and your people — one of the last truly wild places on earth.",
    detail: [
      "The Okavango is one of the last genuinely wild places on earth — a maze of channels, islands and floodplains that comes alive with game. I put together exclusive Delta experiences for you and your people, well away from the crowds.",
      "Mokoro at dawn, game everywhere you look, and nights under a sky with no light for a hundred miles. It's the Africa people picture before they ever arrive.",
    ],
    slides: [
      { label: "Mokoro gliding through Delta channels at dawn" },
      { label: "Aerial of the Okavango waterways" },
      { label: "Elephants wading between islands" },
      { label: "Camp at golden hour, Delta" },
    ],
  },
  {
    id: "selfdrive",
    icon: Truck,
    title: "Self-Drive Camping Safaris",
    where: "Botswana · Zimbabwe · Namibia",
    text: "Raw Africa: Okavango, Chobe, Moremi, Victoria Falls. Camp under the stars with the odd elephant, lion or hyena walking into camp.",
    detail: [
      "This is raw Africa, first-hand. We convoy through the wilderness of Botswana, Zimbabwe and Namibia — Okavango, Chobe, Moremi National Park, Victoria Falls and much more — with me planning and leading the route.",
      "Camping under the stars with the genuine thrill of the odd elephant, lion or hyena wandering through camp at night. These are the trips people talk about for the rest of their lives.",
    ],
    slides: [
      { src: "/photos/vista-karoo.jpg", label: "Big country, open road" },
      { label: "Rooftop tents under a baobab at dusk" },
      { label: "Victoria Falls from the Zimbabwe side" },
      { label: "Elephant walking past camp, Chobe" },
    ],
  },
];

/* Set price to a string (e.g. "$5,450") to display it.
   null renders "Price on request" — safe until Ken confirms numbers. */
const PACKAGES = [
  {
    name: "The Slow Safari",
    feature: true,
    meta: "7 hunting days + 3 free days · 10 days total",
    price: null,
    ph: "Kudu bull at last light, wide landscape", phSrc: "/photos/kudu-recovered.jpg",
    items: [
      "5 plains game trophies of your choice*",
      "3 additional days FREE — Cape Town, coast or photographic",
      "1×1 professional hunter — Ken, personally",
      "Observers welcome",
    ],
    note: "*e.g. kudu, gemsbok, springbok, blue wildebeest, warthog",
  },
  {
    name: "The Karoo Classic",
    meta: "7 days / 8 nights · Plains game",
    price: null,
    ph: "Gemsbok in open Karoo veld", phSrc: "/photos/kudu-ridge.jpg",
    items: [
      "Kudu", "Gemsbok", "Springbok", "Blue wildebeest", "Warthog",
    ],
    note: "Animals may be substituted at package pricing.",
  },
  {
    name: "Buffalo Pursuit",
    meta: "10 days / 11 nights · Dangerous game",
    price: null,
    ph: "Cape buffalo bull, hard boss, thick bush", phSrc: "/photos/buffalo-herd.jpg",
    items: [
      "Cape buffalo — hard-bossed bull",
      "2 plains game trophies of your choice",
      "Tracking on foot in big-bore country",
    ],
    note: "Area selected to suit the season and your fitness.",
  },
  {
    name: "Build Your Own",
    meta: "Any length · Any species",
    price: null,
    ph: "Ken glassing from the high ground", phSrc: "/photos/ken-portrait.jpg",
    items: [
      "Tell me your wishlist and your dates",
      "I find the best ground for your species",
      "Every safari above can be tailored too",
    ],
    note: "No two safaris I run are the same — by design.",
  },
];

const INCLUDES = [
  "Professional hunter (Ken — 1×1, start to finish)",
  "Tracker, skinner and field staff",
  "Accommodation, meals and local drinks",
  "Daily laundry at the lodge",
  "Field preparation of trophies",
  "All transport during the safari + airport transfers",
];

const EXCLUDES = [
  "International flights",
  "Accommodation before / after the safari",
  "Taxidermy, dip & pack, and trophy shipping",
  "Permits for species that require them (e.g. CITES)",
  "Rifle hire and ammunition (available on request)",
  "Gratuities",
];

/* NOTE: species explorer was removed from the packages page.
   If you want a dedicated Species page later, re-add a SPECIES array here
   and the .sp-grid CSS is still in place to render it. */

const FAQS = [
  {
    q: "Can I bring my own rifle to South Africa?",
    a: "Yes. Visiting hunters can bring their own rifles on a temporary import permit (SAPS 520 form), issued on arrival. I walk every client through the paperwork before you fly, and I'm at the airport when you land. Regulations do change, so we confirm current requirements together during planning. Don't want to travel with a rifle? Hire one of mine.",
  },
  {
    q: "When is the best time to hunt?",
    a: "The main season runs roughly March to October — our autumn and winter — with cool mornings, mild days and animals in prime condition. That said, we build the safari around your dates and your species, not the other way around.",
  },
  {
    q: "What does the 7 + 3 Slow Safari commitment mean?",
    a: "Simple: for every 7 hunting days you book with me, I add 3 additional days for free. Those extra days are for the things a rushed safari misses — Cape Town, the coast, a photographic day, or simply more time on the ground.",
  },
  {
    q: "Can my spouse, kids or non-hunting friends come along?",
    a: "Please bring them. The slow safari is designed around real connection — observers are welcome on the hunt, and the photographic, fishing and touring days are built with them in mind.",
  },
  {
    q: "Are the packages fixed?",
    a: "No — they're honest starting points. Animals can be substituted, days added, and every package tailored to your wishlist. If the packages don't fit, we build from scratch.",
  },
  {
    q: "How do trophies get home?",
    a: "After the hunt, your trophies go to a registered taxidermist / dip-and-pack facility, and export is handled by professional shipping agents. Certain species require CITES permits — I'll flag that during planning so there are no surprises.",
  },
  {
    q: "Why are slots limited?",
    a: "After 20+ years of guiding full-time, I'm slowing down to prioritise family. I now take on a limited number of safaris per year — reserved for hunters who want a deeply personalised experience, guided by me personally from start to finish.",
  },
];

const TESTIMONIALS = [
  { quote: "Placeholder — drop a real client quote here. Aim for specifics: the species taken, the moment around the fire, why they'd come back.", who: "Client Name · USA · 2025" },
  { quote: "Placeholder — a second testimonial. Ask past clients for two or three sentences by WhatsApp; real words beat polished copy.", who: "Client Name · Germany · 2024" },
  { quote: "Placeholder — a third testimonial, ideally from a repeat client or a family group.", who: "Client Name · Canada · 2023" },
];

/* ---------------- mini router ---------------- */

const PAGES = {
  home: "/",
  packages: "/packages",
  gallery: "/gallery",
  faq: "/faq",
  contact: "/contact",
};

const RouterCtx = createContext({ page: "home", go: () => {} });
const useRouter = () => useContext(RouterCtx);

function pageFromPath() {
  try {
    const p = window.location.pathname;
    const hit = Object.entries(PAGES).find(([, path]) => path === p);
    return hit ? hit[0] : "home";
  } catch {
    return "home";
  }
}

function RouterProvider({ children }) {
  const [page, setPage] = useState(pageFromPath);
  const [hash, setHash] = useState(null);

  const go = (next, nextHash = null) => {
    setPage(next);
    setHash(nextHash);
    try {
      window.history.pushState({}, "", PAGES[next] + (nextHash || ""));
    } catch { /* sandboxed preview — state routing only */ }
  };

  useEffect(() => {
    const onPop = () => { setPage(pageFromPath()); setHash(null); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* scroll to top on page change, or to the section if a hash was given */
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo({ top: 0 });
  }, [page, hash]);

  return <RouterCtx.Provider value={{ page, go }}>{children}</RouterCtx.Provider>;
}

/* ---------------- utilities ---------------- */

function Ph({ label, src, alt, className = "", style }) {
  // Real image when a src is provided; labelled placeholder otherwise.
  if (src) {
    return (
      <img
        src={src}
        alt={alt || label || ""}
        className={className}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
      />
    );
  }
  return (
    <div className={`ph ${className}`} style={style} aria-label={`Image placeholder: ${label}`}>
      <div className="ph-tag">
        <Camera size={22} strokeWidth={1.5} />
        <span>{label}</span>
      </div>
    </div>
  );
}

function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && (el.classList.add("in"), ob.disconnect()),
      { threshold: 0.12 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return <Tag ref={ref} className={`rv ${className}`} {...rest}>{children}</Tag>;
}

/* ---------------- chrome ---------------- */

const NAV_ITEMS = [
  { label: "The Guide", page: "home", hash: "#guide" },
  { label: "Slow Safari", page: "home", hash: "#slow" },
  { label: "Experiences", page: "home", hash: "#experiences" },
  { label: "Packages", page: "packages" },
  { label: "Gallery", page: "gallery" },
  { label: "FAQ", page: "faq" },
];

function Nav() {
  const { page, go } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const click = (item) => { setOpen(false); go(item.page, item.hash || null); };
  return (
    <header className={`nav ${scrolled ? "scrolled" : ""} ${page !== "home" ? "opaque" : ""}`}>
      <div className="wrap nav-in">
        <button className="logo" onClick={() => go("home")} aria-label="Ken Whiley — African Guide, home">
          <img src="/logo/ken-whiley-white.png" alt="Ken Whiley — African Guide" />
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {NAV_ITEMS.map((it) => (
            <button
              key={it.label}
              className={!it.hash && page === it.page ? "active" : ""}
              onClick={() => click(it)}
            >
              {it.label}
            </button>
          ))}
          <button className="btn" onClick={() => click({ page: "contact" })}>Contact</button>
        </nav>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  const { go } = useRouter();
  return (
    <div className="wrap foot">
      <button className="logo" onClick={() => go("home")} style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <img src="/logo/ken-whiley-white.png" alt="Ken Whiley — African Guide" style={{ height: 40 }} />
      </button>
      <nav aria-label="Footer">
        <button onClick={() => go("packages")}>Packages</button>
        <button onClick={() => go("gallery")}>Gallery</button>
        <button onClick={() => go("faq")}>FAQ</button>
        <button onClick={() => go("contact")}>Contact</button>
      </nav>
      <small>© 2001 Ken Whiley · Southern Africa</small>
    </div>
  );
}

/* Button that routes to the contact page */
function ContactButton({ label = "Contact Ken", solid = true }) {
  const { go } = useRouter();
  return (
    <button className={`btn ${solid ? "solid" : ""}`} onClick={() => go("contact")}>
      {label}
    </button>
  );
}

function CtaBand({ title, text }) {
  const { go } = useRouter();
  return (
    <section className="cta-band">
      <div className="wrap">
        <Reveal>
          <h2>{title}</h2>
          <p>{text}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn solid" onClick={() => go("contact")}>Start planning</button>
            <a className="btn" href={waLink("Hi Ken — I'd like to talk about a safari.")} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp Ken
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PageHero({ eyebrow, title, lead }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}

/* ---------------- home page ---------------- */

function Hero() {
  const { go } = useRouter();
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <Ph src="/photos/hero-karoo-valley.jpg" alt="Karoo valley at first light" label="HERO" style={{ minHeight: "100%", border: "none" }} />
      </div>
      <div className="hero-grad" />
      <div className="wrap hero-in">
        <p className="since">Guiding Since 2001 · Southern Africa</p>
        <h1>Slow down <em>the safari.</em></h1>
        <p>
          Private, personally guided hunting safaris — one guide, start to finish,
          a limited number of times a year.
        </p>
        <div className="hero-ctas">
          <button className="btn solid" onClick={() => go("packages")}>View packages</button>
          <a className="btn" href={waLink("Hi Ken — I'd like to talk about a safari.")} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> WhatsApp Ken
          </a>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">Scroll</div>
    </section>
  );
}

/* Full-width media band with a slow parallax drift that hands
   the scroll over to the guide section (which overlaps it). */
function Montage() {
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const f = frameRef.current, m = mediaRef.current;
        if (!f || !m) return;
        const r = f.getBoundingClientRect();
        const progress = 1 - (r.bottom / (window.innerHeight + r.height)); // 0..1
        m.style.transform = `translateY(${(progress - 0.5) * 12}%)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="montage" aria-label="Film montage">
      <div className="montage-frame" ref={frameRef}>
        <div className="montage-media" ref={mediaRef}>
          {VIDEO_SRC ? (
            <video src={VIDEO_SRC} autoPlay muted loop playsInline preload="metadata" />
          ) : (
            <Ph
              src="/photos/sunset-antelope.jpg"
              alt="Two antelope against a Karoo sunset"
              label="MONTAGE"
              style={{ minHeight: "100%", border: "none" }}
            />
          )}
        </div>
        <div className="montage-cap">
          <div className="wrap">
            <span><Film size={14} /> From the field — Southern Africa</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Guide() {
  return (
    <section id="guide" className="guide">
      <div className="wrap intro-grid">
        <Reveal className="intro-copy intro-card">
          <p className="eyebrow">The Guide</p>
          <h2>One guide. Your whole safari.</h2>
          <p>
            After 20 incredible years guiding full-time across Southern Africa, I am
            slowing down to prioritise family time. But the bush is in my blood.
          </p>
          <p>
            I now guide a <strong>limited number of safaris per year</strong> — slots
            reserved for hunters seeking a deeply personalised experience. I am
            personally involved from the planning stages until I put you back on the
            plane. No middleman, no corporate marketing sales, and no bullshit.
          </p>
          <p style={{ color: "var(--bone)" }}>
            Thank you for being part of my journey. See you around the campfire.
          </p>
          <div className="sign"><img src="/logo/ken-whiley-white.png" alt="Ken Whiley — African Guide" /></div>
        </Reveal>
        <Reveal className="intro-photo">
          <div className="frame">
            <Ph src="/photos/ken-portrait.jpg" alt="Ken glassing from the high ground" label="PORTRAIT — Ken" style={{ objectPosition: "center" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SlowSafari() {
  return (
    <section className="slow" id="slow">
      <div className="wrap">
        <Reveal><p className="eyebrow">The Slow Safari</p></Reveal>
        <div className="slow-grid">
          <Reveal>
            <blockquote>
              "Don't rush the moment. The heartbeat of a safari isn't the harvest; it is
              the tension of the pursuit, the small wonders at your feet, and the vast,
              unforgettable wilderness."
              <footer>— The Mission</footer>
            </blockquote>
          </Reveal>
          <Reveal className="vm">
            <h3>My Vision</h3>
            <p>
              A slow safari designed to celebrate global friendship and God's creation.
              By slowing down, we make room for real connection and let the natural
              adventure steal the show.
            </p>
            <h3>My Promise</h3>
            <p>
              Personally involved from the planning stages until I put you back on the
              plane. No middleman, no corporate marketing sales, and no bullshit.
            </p>
          </Reveal>
        </div>
        <Reveal className="ribbon">
          <p className="ribbon-tag">My commitment to the slow safari</p>
          <h3>Book 7 hunting days, and 3 more are on me.</h3>
          <p>Time is the whole point — so I give you more of it. Every seven-day hunt comes with three extra days to explore, rest, or simply stay a while longer.</p>
          <ContactButton label="Talk to Ken about dates" />
        </Reveal>
      </div>
    </section>
  );
}

/* Auto-advancing crossfade slideshow. Swap <Ph> for <img> when photos land. */
function Slideshow({ slides }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, [slides]);
  return (
    <div className="slides">
      {slides.map((sl, n) => (
        <div className={`slide ${n === i ? "on" : ""}`} key={n} aria-hidden={n !== i}>
          <Ph src={sl.src} label={`PHOTO — ${sl.label}`} alt={sl.label} style={{ minHeight: "100%", border: "none" }} />
        </div>
      ))}
      <div className="slides-dots">
        {slides.map((_, n) => (
          <button
            key={n}
            className={n === i ? "on" : ""}
            onClick={() => setI(n)}
            aria-label={`Slide ${n + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Experiences() {
  const [open, setOpen] = useState(null);
  const active = EXPERIENCES.find((e) => e.id === open);
  return (
    <section id="experiences">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Experiences</p>
          <h2>Not stuck on one property.</h2>
          <p className="lead" style={{ marginBottom: 44 }}>
            We explore the best places to match your target species — and build the rest
            of the journey around you and your people. Tap any experience to see more.
          </p>
        </Reveal>
        <Reveal className="exp-grid">
          {EXPERIENCES.map((e) => (
            <button
              className={`exp ${e.feature ? "feature" : ""} ${open === e.id ? "active" : ""}`}
              key={e.id}
              onClick={() => setOpen(open === e.id ? null : e.id)}
              aria-expanded={open === e.id}
            >
              <e.icon className="ico" size={26} strokeWidth={1.5} />
              <h3>{e.title}</h3>
              <p>{e.text}</p>
              <div className="foot">
                <span className="where">{e.where}</span>
                <span className="go">{open === e.id ? "Close" : "Explore"} <ArrowRight size={13} /></span>
              </div>
            </button>
          ))}
        </Reveal>
        {active && (
          <div className="exp-detail" key={active.id}>
            <div className="exp-detail-in">
              <div className="copy">
                <active.icon className="ico" size={28} strokeWidth={1.5} />
                <h3>{active.title}</h3>
                <span className="where">{active.where}</span>
                {active.detail.map((para, i) => <p key={i}>{para}</p>)}
                <a className="btn solid" href={mailLink(
                  `Safari enquiry — ${active.title}`,
                  `Hi Ken,\n\nI'd like to know more about your ${active.title}. `
                )}>
                  <Mail size={16} /> Enquire about this
                </a>
              </div>
              <div className="show">
                <Slideshow slides={active.slides} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PackageCard({ p }) {
  return (
    <article className={`pk ${p.feature ? "feature" : ""}`}>
      <div className="img">
        {p.feature && <span className="flag">7 + 3 Free Days</span>}
        <Ph src={p.phSrc} label={`PHOTO — ${p.ph}`} alt={p.name} />
      </div>
      <div className="body">
        <span className="meta">{p.meta}</span>
        <h3>{p.name}</h3>
        <ul>
          {p.items.map((it) => (
            <li key={it}><Check size={14} /> {it}</li>
          ))}
        </ul>
        <div className="price">
          {p.price || "Price on request"}
          <small>{p.note}</small>
        </div>
        <a className="btn" href={waLink(`Hi Ken — I'm interested in the "${p.name}" package. Can you send me details and pricing?`)} target="_blank" rel="noreferrer">
          Enquire about this safari
        </a>
      </div>
    </article>
  );
}

function PackagesPreview() {
  const { go } = useRouter();
  return (
    <section id="packages-preview" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Hunting Packages</p>
          <h2>Honest starting points.</h2>
          <p className="lead" style={{ marginBottom: 44 }}>
            Clear, end-to-end packages — days, animals, and what's included. Every one
            of them can be tailored, or we build yours from scratch.
          </p>
        </Reveal>
        <Reveal className="pk-grid">
          {PACKAGES.slice(0, 3).map((p) => <PackageCard p={p} key={p.name} />)}
        </Reveal>
        <Reveal style={{ marginTop: 36, textAlign: "center" }}>
          <button className="btn" onClick={() => go("packages")}>
            All packages & species <ArrowRight size={15} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="stories" className="slow">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Around the Campfire</p>
          <h2>Old friends, new friends.</h2>
        </Reveal>
        <div className="tst-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="blockquote" className="tst" key={i}>
              <p>"{t.quote}"</p>
              <footer>{t.who}</footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Montage />
      <Guide />
      <SlowSafari />
      <Experiences />
      <PackagesPreview />
      <Testimonials />
      <CtaBand
        title="Ready to slow down?"
        text="Tell me your species wishlist and your dates — I'll take it from there, personally."
      />
    </>
  );
}

/* ---------------- packages page ---------------- */

function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hunting Packages"
        title="Days, animals, no fine print."
        lead="End-to-end packages built the way a safari should be — with everything on the table up front. Animals may be substituted, days added, and every package tailored to your wishlist."
      />
      <section>
        <div className="wrap">
          <Reveal className="pk-grid">
            {PACKAGES.map((p) => <PackageCard p={p} key={p.name} />)}
          </Reveal>
          <Reveal className="incl-grid">
            <div className="incl yes">
              <h3>Every package includes</h3>
              <ul>{INCLUDES.map((i) => <li key={i}><Check size={15} /> {i}</li>)}</ul>
            </div>
            <div className="incl no">
              <h3>Not included</h3>
              <ul>{EXCLUDES.map((i) => <li key={i}><Minus size={15} /> {i}</li>)}</ul>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="slow" id="build-together">
        <div className="wrap">
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>Tailored Safaris</p>
            <h2 style={{ marginBottom: 10 }}>Don't see your safari here?</h2>
            <p className="lead" style={{ margin: "0 auto", fontSize: 22, color: "var(--bone)" }}>
              Let's build it together.
            </p>
          </Reveal>
          <Reveal className="contact-grid">
            <ContactChannels />
            <div>
              <Ph src="/photos/ken-bw-rear.jpg" alt="Ken looking out over the veld" label="PHOTO — Ken" style={{ aspectRatio: "4/3", minHeight: 0 }} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---------------- gallery page ---------------- */

function GalleryPage() {
  const [tab, setTab] = useState("On Safari");
  const sets = {
    "On Safari": [
      { src: "/photos/tracking-on-foot.jpg", label: "Walking in toward the mountains" },
      { src: "/photos/kudu-recovered.jpg", label: "A kudu taken on foot" },
      { src: "/photos/ken-portrait.jpg", label: "Glassing from the high ground" },
      { src: "/photos/sunset-antelope.jpg", label: "Antelope against a Karoo sunset" },
      { src: "/photos/kudu-ridge.jpg", label: "Kudu on the ridge" },
      { src: "/photos/buffalo-herd.jpg", label: "Buffalo herd in the green veld" },
      { src: "/photos/zebra-herd.jpg", label: "Zebra on the move" },
      { src: "/photos/zebra-kudu-plains.jpg", label: "Plains game, open country" },
      { src: "/photos/giraffe-pair.jpg", label: "Giraffe at dusk" },
      { src: "/photos/hero-karoo-valley.jpg", label: "Morning over the Karoo" },
      { src: "/photos/glassing-sunrise.jpg", label: "First light, glassing the slopes" },
      { src: "/photos/acacia-sunset.jpg", label: "Sundown through the thorn trees" },
    ],
    "Exploring South Africa": [
      { src: "/photos/vista-karoo.jpg", label: "The vast Karoo escarpment" },
      { src: "/photos/bush-dinner-sunset.jpg", label: "Dinner set up in the veld at sunset" },
      { src: "/photos/sunset-hills.jpg", label: "Sun going down over the hills" },
      { src: "/photos/giraffe-silhouette.jpg", label: "Giraffe against a moody sky" },
      { src: "/photos/ken-bw-rear.jpg", label: "Taking it all in" },
      { src: "/photos/sunrise-glass-silhouette.jpg", label: "Sunrise on the mountain" },
      { label: "Table Mountain from the V&A" },
      { label: "Garden Route viewpoint" },
      { label: "Winelands lunch with guests" },
      { label: "Okavango mokoro at dawn" },
      { label: "Victoria Falls from the Zimbabwe side" },
      { label: "Penguins at Boulders Beach" },
    ],
  };
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="From the field."
        lead="Trophies, travels, and the moments in between — the parts of a slow safari a brochure can't show you."
      />
      <section>
        <div className="wrap">
          <div className="tabs">
            {Object.keys(sets).map((t) => (
              <button key={t} className={`chip ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className="gal-grid">
            {sets[tab].map((l, i) => <Ph key={tab + i} src={l.src} alt={l.label} label={`PHOTO — ${l.label}`} />)}
          </div>
        </div>
      </section>
      <CtaBand
        title="Your photo belongs up here."
        text="Every safari ends with a hard drive full of these. Come make your own."
      />
    </>
  );
}

/* ---------------- faq page ---------------- */

function FaqPage() {
  const [open, setOpen] = useState(0);
  const { go } = useRouter();
  return (
    <>
      <PageHero
        eyebrow="Good to Know"
        title="Before you fly."
        lead="The practical side of an African safari — rifles, seasons, trophies, family. If your question isn't here, just ask me directly."
      />
      <section>
        <div className="wrap" style={{ maxWidth: 860 }}>
          {FAQS.map((f, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}
                <ChevronDown size={20} />
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
          <div style={{ marginTop: 44, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn solid" onClick={() => go("contact")}>Ask Ken directly</button>
            <a className="btn" href={waLink("Hi Ken — quick question about a safari:")} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- contact page ---------------- */

/* Reusable contact block — email is the primary channel (many clients are
   US-based and don't use WhatsApp). Used on the Contact page and Packages page. */
function ContactChannels({ heading = "Talk to Ken. Not a sales desk." }) {
  return (
    <>
      <h2 style={{ fontSize: 30 }}>{heading}</h2>
      <p className="lead">
        Email is the best way to start — I answer every message personally. Prefer
        to talk? WhatsApp and phone work too.
      </p>
      <div className="c-list">
        <a className="c-item primary" href={mailLink(
          "Safari enquiry",
          "Hi Ken,\n\nI'd like to talk about a safari.\n\n"
        )}>
          <Mail size={22} strokeWidth={1.5} />
          <span>
            {CONTACT.email}
            <em>Email — the best way to reach me</em>
          </span>
        </a>
        <a className="c-item" href={waLink("Hi Ken — I'd like to talk about a safari.")} target="_blank" rel="noreferrer">
          <MessageCircle size={20} strokeWidth={1.5} /><span>WhatsApp</span>
        </a>
        <a className="c-item" href={CONTACT.phoneHref}>
          <Phone size={20} strokeWidth={1.5} /><span>{CONTACT.phone}</span>
        </a>
      </div>
    </>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", when: "", msg: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const body = `Name: ${form.name}\nEmail: ${form.email}\nTimeframe: ${form.when}\n\n${form.msg}`;
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="See you around the campfire."
        lead="If you are an old friend coming back, or a new friend looking for your first adventure with me — thank you for trusting me to be your guide here in Africa."
      />
      <section>
        <div className="wrap contact-grid">
          <Reveal>
            <ContactChannels />
          </Reveal>
          <Reveal className="form" as="form" onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Safari enquiry — " + (form.name || "website"))}&body=${encodeURIComponent(body)}`;
          }}>
            <div className="row">
              <input required placeholder="Your name" value={form.name} onChange={set("name")} aria-label="Your name" />
              <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} aria-label="Email" />
            </div>
            <input placeholder="Rough timeframe (e.g. May 2027)" value={form.when} onChange={set("when")} aria-label="Timeframe" />
            <textarea rows="6" placeholder="Tell me about the safari you have in mind — species, party, pace…" value={form.msg} onChange={set("msg")} aria-label="Message" />
            <button className="btn solid" type="submit" style={{ width: "100%", justifyContent: "center" }}>
              Send enquiry
            </button>
            <p style={{ fontSize: 12.5, color: "var(--bone-faint)", marginTop: 12 }}>
              Opens in your email app, addressed to Ken directly.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---------------- app ---------------- */

function Pages() {
  const { page } = useRouter();
  switch (page) {
    case "packages": return <PackagesPage />;
    case "gallery": return <GalleryPage />;
    case "faq": return <FaqPage />;
    case "contact": return <ContactPage />;
    default: return <HomePage />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <div className="kw">
        <style>{CSS}</style>
        <Nav />
        <main><Pages /></main>
        <Footer />
      </div>
    </RouterProvider>
  );
}
