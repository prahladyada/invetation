# Priya & Rahul — Wedding Invitation

A premium, animated, single-page digital wedding invitation. Built with
plain **HTML5, CSS3, and vanilla JavaScript** — no React, no Bootstrap,
no jQuery, no build step. Unzip it and it works.

## ✨ What's inside

- Cinematic loading screen → gated cover screen → main invitation
- A gold ornamental corner frame that draws itself in with SVG on load
- Sticky glassmorphism navigation with active-section highlighting
- Live countdown to the wedding date
- Scroll-reveal animations (`IntersectionObserver`) + a subtle parallax
- Floating gold particles on the cover screen + falling petals throughout
- A desktop-only custom cursor and mouse-follow glow
- Masonry photo gallery with a fullscreen, keyboard- and swipe-accessible lightbox
- RSVP form (front-end only, ready to wire to any backend) + a WhatsApp RSVP shortcut
- Add-to-calendar (`.ics` download), Get Directions, native Share sheet + clipboard fallback
- A "Scan & Share" QR code for the invitation link
- Installable as a PWA with offline caching
- Respects `prefers-reduced-motion`, degrades gracefully with JavaScript off,
  and is keyboard accessible throughout

## Quick start

1. Unzip the folder.
2. Open `index.html` directly in a browser to preview it — no server or
   build step required.
3. To deploy, upload the whole folder as-is to any static host (see
   "Going live" below for PWA/offline notes).

## Make it yours: one config object

Open `js/main.js` and edit the `weddingConfig` object at the very top.
Everything else on the site — the countdown, the footer date, the
generated calendar file, the WhatsApp message, and the Get Directions
link — reads from here automatically:

```js
window.weddingConfig = {
  brideFirstName: "Priya",
  groomFirstName: "Rahul",
  weddingDate: "2026-12-25T18:00:00+05:30",   // ISO 8601 with UTC offset
  venueName: "The Grand Palace",
  city: "New Delhi, India",
  whatsappNumber: "919999999999",              // country code + number, digits only
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=...",
  invitationTitle: "Priya & Rahul Wedding",
  invitationMessage: "You are invited to celebrate our special day ❤️"
};
```

> Keep the `+05:30` (or your local) UTC offset in `weddingDate` — it's
> what makes the countdown show the same correct time to every guest,
> no matter their own timezone.

For the **Our Story** timeline, the three **event cards** (Mehndi /
Sangeet / Ceremony), and the **RSVP meal options**, edit the text
directly in `index.html` — look for the section comments, e.g.
`<!-- OUR STORY -->` and `<!-- WEDDING EVENTS -->`.

## Replace the placeholder photos

`assets/images/` ships with elegant gold-and-burgundy placeholder
graphics (each one clearly labelled "Replace with …") so the site looks
complete right out of the box instead of showing broken image icons.
Swap in real photos using the **same filenames** and everything just
works — no HTML/CSS changes needed:

| File | Notes |
|---|---|
| `bride.jpg`, `groom.jpg` | Square photos work best — they're cropped into a circle frame |
| `gallery-1.jpg` … `gallery-8.jpg` | Any aspect ratio — the masonry grid adapts automatically |

## Add your music

Drop an MP3 at `assets/music/wedding.mp3` (see the note in that folder).
The floating **♫** button and the "start music when Open Invitation is
clicked" behavior already point at that exact path, so there's no code
to touch. Until a file exists there, the music button is present but
simply does nothing — nothing breaks.

## Going live (PWA + offline support)

`service-worker.js` needs HTTPS (or `localhost`) to register — that's a
browser security rule, not a bug in this template. It works
automatically once you deploy to:

- **Cloudflare Pages** — drag-and-drop the folder, or connect a git repo. Zero config.
- Any other static HTTPS host — Netlify, Vercel, GitHub Pages, or a normal web host.

If you update core files after guests have already visited once, bump
`CACHE_NAME` near the top of `service-worker.js` (`v1` → `v2`) so
returning visitors fetch the fresh version instead of an old cached copy.

## The two CDN dependencies

Per the brief, this is a vanilla build with no UI frameworks. It does
load two small, single-purpose scripts from a CDN — neither is a
framework:

- **Google Fonts** — Cormorant Garamond, Great Vibes, and Poppins.
  Swap the `<link>` tag in `index.html`'s `<head>` to use different
  fonts.
- **qrcodejs** (~4KB, MIT licensed, zero dependencies) — powers the
  "Scan & Share" QR code. If it's ever unreachable, the QR section
  degrades gracefully to a plain, copyable link instead of an empty box.

The Venue map uses Google's key-free `output=embed` format, which is
fine for personal use. For a very high-traffic public wedding site,
consider a proper Google Maps Embed API key for guaranteed reliability.

## Connecting the RSVP form to a real backend

Right now RSVPs are saved to the guest's own browser (`localStorage`)
so you can see the entire flow with zero setup. To start collecting
real responses, open `js/rsvp.js` and replace the body of the
`submitRSVP(entry)` function with a `fetch()` call to whatever backend
you like — PHP, Node.js, Firebase, a Google Sheet (via an Apps Script
web app), or any REST API. Validation and the "Thank You" screen don't
need to change at all.

## File structure

```
wedding-invitation/
├── index.html
├── css/
│   ├── style.css          → variables, reset, layout, every component
│   ├── animations.css     → keyframes + the scroll-reveal system
│   └── responsive.css     → mobile-first breakpoints
├── js/
│   ├── main.js             → config, loading/cover screens, nav, music, cursor, petals, calendar
│   ├── animations.js       → IntersectionObserver reveals + parallax
│   ├── countdown.js        → the live countdown
│   ├── gallery.js          → the lightbox
│   ├── rsvp.js              → form validation + submission
│   └── share.js             → Web Share API + QR code
├── assets/
│   ├── images/             → bride/groom + 8 gallery placeholders (see above)
│   ├── music/                → put wedding.mp3 here
│   └── icons/                 → PWA/app icons (already generated, on-brand)
├── manifest.json           → PWA manifest
├── service-worker.js       → offline caching
└── README.md
```

## Browser support

Current evergreen browsers — Chrome, Safari, Firefox, Edge, on both
desktop and mobile. Progressive enhancement is used throughout: with
JavaScript unavailable, a `<noscript>` stylesheet turns the page into a
plain scrollable document instead of leaving a visitor stuck behind the
cover screen.

## Performance & accessibility

- Gallery images are lazy-loaded; the falling-petals effect is capped
  and automatically pauses when the browser tab isn't visible.
- Every animation respects `prefers-reduced-motion`.
- The gallery, lightbox, mobile menu, and RSVP form are fully keyboard
  operable; the lightbox traps focus while open and restores it on close.
- The custom cursor and mouse glow only ever appear on devices that
  report a fine pointer + hover support, and never on touch devices.

## Tested viewport widths

320 · 375 · 390 · 430 · 768 · 1024 · 1440 · 1920 px

---

Made with ❤️ for Priya & Rahul — and just as easy to make it yours.
