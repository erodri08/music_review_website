
## Folder structure

```
/
├── index.html            ← Homepage
├── music.html            ← Music listing page
├── films.html            ← Film listing page
├── tv.html               ← TV listing page
├── 404.html
├── README.md
│
├── css/
│   └── style.css         ← All styles
│
├── js/
│   └── main.js           ← All JS: cursor, hero animation, lightbox, nav
│
├── assets/
│   ├── images/           ← Hero disc images: cd.png, vinyl.png, spool.png
│   ├── albums/           ← Album cover art (.png)
│   ├── concerts/         ← Concert photos (.jpg) and videos (.MOV)
│   └── movies-tv/        ← Film/TV posters and stills
│
└── articles/
    ├── _template.html    ← Copy this to start any new article
    ├── concerts/         ← One .html per concert review
    ├── music/            ← Album reviews + music articles
    └── movies-tv/        ← Film and TV articles
```

---

## How to add a new article (any category)

### Step 1 — Create the article file

Copy `articles/_template.html` and save it with a descriptive name, e.g.:
- `articles/concerts/radiohead-2026.html`
- `articles/music/review-ctrl.html`
- `articles/movies-tv/review-anora.html`

Fill in:
- `<title>` tag
- Hero badges (`badge-review` or `badge-article`, plus `badge-concert` if relevant)
- `<h1>` title and `.article-meta` line (venue/platform · date)
- Your text in `<p>` paragraphs
- Any `<figure>` blocks for images and videos (see below)

### Step 2 — Add images or videos

Put files in the appropriate asset folder:
- `assets/concerts/` for concert photos/videos
- `assets/albums/` for album art
- `assets/movies-tv/` for posters/stills

Reference them with `../../assets/concerts/yourfile.jpg`.

**Images** inside `<figure>` tags open in a **lightbox** automatically when clicked.
Zoom with buttons, scroll wheel, or `+`/`-` keys. Drag to pan. `Esc` to close.

**Videos** — do NOT add `controls` to the `<video>` tag. The JS adds a play-button
overlay and opens the video in the lightbox player automatically.

### Step 3 — Choose media layout

Three figure classes control how media sits with text:

| Class | Effect |
|---|---|
| `figure.wrap-right` | Floats right (~44% wide), text flows left |
| `figure.wrap-left` | Floats left (~44% wide), text flows right |
| `figure.full-width` | Full column width, breaks out of any float |

Always add `<div class="clearfix"></div>` after a floated block when you want
the next paragraph to start below it rather than beside it.

### Step 4 — Add a card to the listing page

Open `music.html`, `films.html`, or `tv.html` and copy one `<article class="article-item">` block.

Update:
- The `id` (unique slug, e.g. `id="radiohead-2026"`)
- `article-num` (next number in sequence)
- Badges: `badge-review` for a review, `badge-article` for a general piece, add `badge-concert` for concerts
- `article-item-title`, `article-item-excerpt`
- `.article-item-meta` (venue/platform and date using `<span class="content-date">`)
- `article-item-media > img` src
- Both `href` attributes (the `.read-more` link and the invisible `.article-item-link`)
- **Put the newest items at the top of the list** — the homepage pulls its featured cards
  from the first items on the music listing page.

---

## How to update the homepage featured cards

The three cards in the homepage grid are hand-coded in `index.html` inside
`.featured-grid`. Update the image src, badges, title, excerpt, date, and href
to match your most recent content. The card layout is:
- First card (`card-main`): large, left column, spans two rows
- Second and third cards (`card-side`): smaller, right column

---

## Navigation tabs

There are three tabs: **Music**, **Film**, **TV**.

Concerts live under **Music** (they appear on `music.html` with a `badge-concert` label).

To rename a tab, change the text in the `<a>` inside `.nav-links` in every HTML file,
and update the matching `href` if you rename the page file.

---

## How the hero banner works

`js/main.js` generates **16 disc objects** (CDs, vinyls, film spools) on the hero stage.
Each has a base position, size, spin speed, and opacity.

**Force-field repulsion:** the mouse pushes discs away. Closer = stronger push.
Discs spin faster while being pushed. They float back when the mouse leaves.

To adjust the effect, edit these constants in `initHero()` in `main.js`:
```js
const REPEL_RADIUS = 280;  // px — how close mouse needs to be
const REPEL_FORCE  = 200;  // px — max displacement
```

To add/remove/reposition discs, edit the `discDefs` array. Each entry:
```js
{ type:'cd', w:120, x:0.5, y:0.5, rot:0, rotSpeed:0.4, opacity:0.8 }
// type: 'cd' | 'vinyl' | 'spool'
// w: width in px
// x, y: position as fraction of hero size (0 = left/top, 1 = right/bottom)
// rot: starting rotation in degrees
// rotSpeed: degrees per frame (approx)
// opacity: 0–1
```

---

## How the subpage heroes work (Music / Film / TV)

Each listing page has a `<header class="page-hero ...">` containing a `.page-hero-stage`
with `<img class="ph-img">` elements. These images float around and repel from the mouse
exactly like the homepage discs, but using article images instead of disc graphics.

- **Music page** (`music-hero`): album covers float with a warm gold/red gradient
- **Film page** (`film-hero`): posters float, page gets a slight contrast boost on hover
- **TV page** (`tv-hero`): posters float under a CSS scanline overlay for a CRT effect

To swap the images in a hero, change the `src` attributes on the `.ph-img` elements
in the relevant listing page.

---

## How the CTA button works

The "Read Latest Reviews" button on the homepage scrolls down to the `#latest`
section. As you move the mouse near it, a red glow expands progressively
(`prox-near` → `prox-close` → `prox-touch`) and the button shifts slightly
toward the cursor. This is all in `initCTA()` in `main.js`.

---

## How the custom cursor works

A gold ring + dot follows the mouse. The ring lags slightly behind for a
smooth trailing effect. It turns red and expands when hovering over links/buttons,
and shrinks on click. All in `initCursor()` in `main.js`.

---

## Content badges

| Badge class | Meaning | Colour |
|---|---|---|
| `badge-review` | A full review | Red |
| `badge-article` | A general article or list | Blue |
| `badge-concert` | Concert-specific | Gold |

Use them in `article-hero-badges` (article pages) and `article-item-top` (listing cards).

---

## Deploying

The site is fully static — no server or build step needed.

- **Netlify**: drag and drop the root folder in the Netlify dashboard
- **GitHub Pages**: push to a repo, enable Pages in settings, set source to root
- **Any host**: upload via FTP — the folder structure must be preserved exactly
