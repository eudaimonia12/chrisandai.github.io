# chrisandai.github.io

Personal website for **Chris Dai** — CV, blog, photography and contact — built as a
fast, dependency‑free static site and hosted on GitHub Pages.

**Live site:** https://eudaimonia12.github.io/chrisandai.github.io/
_(or your custom domain, once configured)_

## Structure

```
.
├── index.html          # Home / landing (Projects section + "More about me")
├── projects.html       # Project portfolio (detailed cards)
├── cv.html             # CV (as text, with a PDF download)
├── blog.html           # Essay listing
├── post.html           # Renders a single essay from Markdown (?p=slug)
├── photos.html         # Photo gallery with lightbox
├── contact.html        # Contact details + message form
├── Chris Dai.pdf       # Downloadable CV
├── posts/
│   ├── posts.json      # Index of essays (sorted newest-first automatically)
│   ├── en/<slug>.md    # English version of each essay
│   └── zh/<slug>.md    # Mandarin original of each essay
├── photos/
│   └── photos.json     # Index of gallery images
└── assets/
    ├── css/style.css   # All styling (light + dark themes)
    ├── js/             # main.js, blog.js, photos.js, contact.js
    ├── img/photos/     # Image files for the gallery
    └── img/projects/   # Project screenshots / previews
```

## Everyday tasks

### Add / edit a project
Projects live directly in `projects.html` as `<article class="project">` blocks,
with a matching compact card on the home page (`index.html`). Each detailed card
has four labelled facts — **Problem, Stack, My contribution, Outcome** — plus
`Source code` and `Live demo` links and a preview image in `assets/img/projects/`.
Duplicate an existing block (e.g. `#safeguardnz`, `#travel-blog`, `#spawtify`),
swap the text/links, and drop a screenshot (PNG/JPG/SVG) into
`assets/img/projects/`. Full write-up PDFs live in `assets/reports/`.

### Add a blog post / essay (bilingual)
Each essay has an English file and a Mandarin file that share one `slug`. A
language toggle (EN / 中文) appears on every article.
1. Create `posts/en/my-new-essay.md` (English) and `posts/zh/my-new-essay.md`
   (Mandarin). If you only have one language, create just that file — the
   toggle to the missing language will simply show a "couldn't load" note.
2. Add an entry to `posts/posts.json`:
   ```json
   {
     "slug": "my-new-essay",
     "title": "My New Essay",
     "title_zh": "我的新文章",
     "date": "2026-02-01",
     "excerpt": "A one-line teaser shown on the blog list.",
     "tags": ["prose"]
   }
   ```
   The `slug` must match both `.md` filenames. Posts are sorted by `date`
   automatically. Don't start the Markdown with an `# H1` title — the title
   comes from `posts.json` and is shown in the page header.

### Add photos
1. Drop image files into `assets/img/photos/` (JP/PNG/WebP/SVG).
2. Add entries to `photos/photos.json`:
   ```json
   { "src": "assets/img/photos/beach.jpg", "caption": "Piha, 2026", "alt": "Black-sand beach at dusk" }
   ```
   Delete the `sample-*.svg` placeholders when you're ready.

### Enable the contact form to actually send email
By default the form opens the visitor's email app. For direct submissions:
1. Create a free form at [formspree.io](https://formspree.io) and copy its form id.
2. Put the id in `assets/js/contact.js` → `FORMSPREE_ID = "yourid"`.

## Running locally

Because the blog and gallery load JSON/Markdown via `fetch`, open the site through a
local web server (not `file://`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying (GitHub Pages)

```bash
git add .
git commit -m "Update site"
git push
```

Then in the repo: **Settings → Pages → Build and deployment → Source: Deploy from a
branch**, branch `main`, folder `/ (root)`. The site publishes within a minute or two.
