# chrisandai.github.io

Personal website for **Chris Dai** — CV, blog, photography and contact — built as a
fast, dependency‑free static site and hosted on GitHub Pages.

**Live site:** https://eudaimonia12.github.io/chrisandai.github.io/
_(or your custom domain, once configured)_

## Structure

```
.
├── index.html          # Home / landing
├── cv.html             # CV (as text, with a PDF download)
├── blog.html           # Essay listing
├── post.html           # Renders a single essay from Markdown (?p=slug)
├── photos.html         # Photo gallery with lightbox
├── contact.html        # Contact details + message form
├── Chris Dai.pdf       # Downloadable CV
├── posts/
│   ├── posts.json      # Index of essays (newest first is automatic)
│   └── *.md            # One Markdown file per essay
├── photos/
│   └── photos.json     # Index of gallery images
└── assets/
    ├── css/style.css   # All styling (light + dark themes)
    ├── js/             # main.js, blog.js, photos.js, contact.js
    └── img/photos/     # Image files for the gallery
```

## Everyday tasks

### Add a blog post / essay
1. Create `posts/my-new-essay.md` and write it in Markdown.
2. Add an entry to `posts/posts.json`:
   ```json
   {
     "slug": "my-new-essay",
     "title": "My New Essay",
     "date": "2026-02-01",
     "excerpt": "A one-line teaser shown on the blog list.",
     "tags": ["essays"]
   }
   ```
   The `slug` must match the `.md` filename. Posts are sorted by `date` automatically.

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
