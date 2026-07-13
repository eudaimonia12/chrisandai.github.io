/* Blog: list posts from posts/posts.json and render bilingual essays.
 * Each post has an English version (posts/en/<slug>.md) and a Mandarin
 * original (posts/zh/<slug>.md). The article page offers a language toggle.
 */

function formatDate(iso, lang) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  const locale = lang === "zh" ? "zh-CN" : "en-NZ";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function getLang() {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get("lang");
  if (fromUrl === "en" || fromUrl === "zh") return fromUrl;
  return localStorage.getItem("post-lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("post-lang", lang);
}

async function loadPosts() {
  const res = await fetch("posts/posts.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Could not load posts index");
  const posts = await res.json();
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function renderPostList(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const posts = await loadPosts();
    if (!posts.length) {
      el.innerHTML = '<div class="empty-state">No essays published yet. Check back soon.</div>';
      return;
    }
    el.innerHTML = posts
      .map((p) => {
        const tags = (p.tags || [])
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join("");
        const zhTitle = p.title_zh ? `<span class="post-title-zh">${escapeHtml(p.title_zh)}</span>` : "";
        return `<a class="post-item" href="post.html?p=${encodeURIComponent(p.slug)}">
            <span class="post-date">${formatDate(p.date, "en")}</span>
            <h3>${escapeHtml(p.title)} ${zhTitle}</h3>
            <p>${escapeHtml(p.excerpt || "")}</p>
            <div class="post-tags">${tags}</div>
          </a>`;
      })
      .join("");
  } catch (err) {
    el.innerHTML =
      '<div class="empty-state">Couldn\'t load essays. If you\'re viewing this locally, run a local server (see README).</div>';
    console.error(err);
  }
}

async function renderArticle() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("p");
  const titleEl = document.getElementById("article-title");
  const dateEl = document.getElementById("article-date");
  const tagsEl = document.getElementById("article-tags");
  const bodyEl = document.getElementById("article-body");
  const toggleEl = document.getElementById("lang-toggle");

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    titleEl.textContent = "Essay not found";
    bodyEl.innerHTML = '<p class="muted">No essay was specified. <a href="blog.html">Back to the blog.</a></p>';
    return;
  }

  let posts = [];
  let meta = null;
  try {
    posts = await loadPosts();
    meta = posts.find((p) => p.slug === slug);
  } catch (err) {
    console.error(err);
  }

  async function show(lang) {
    setLang(lang);
    // Toggle buttons
    if (toggleEl) {
      toggleEl.innerHTML =
        `<button type="button" data-lang="en" class="${lang === "en" ? "active" : ""}">EN</button>` +
        `<button type="button" data-lang="zh" class="${lang === "zh" ? "active" : ""}">中文</button>`;
      toggleEl.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => show(b.dataset.lang))
      );
    }

    const title = meta ? (lang === "zh" ? meta.title_zh || meta.title : meta.title) : slug;
    document.title = `${title} — Chris Dai`;
    titleEl.textContent = title;
    titleEl.setAttribute("lang", lang === "zh" ? "zh" : "en");
    if (meta) {
      dateEl.textContent = formatDate(meta.date, lang);
      tagsEl.innerHTML = (meta.tags || [])
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join("");
    }

    bodyEl.setAttribute("lang", lang === "zh" ? "zh" : "en");
    bodyEl.classList.toggle("article-zh", lang === "zh");
    bodyEl.innerHTML = '<p class="muted">Loading&hellip;</p>';

    try {
      const res = await fetch(`posts/${lang}/${slug}.md`, { cache: "no-cache" });
      if (!res.ok) throw new Error("markdown not found");
      let md = await res.text();
      md = md.replace(/^\s*#\s+.*(\r?\n)+/, ""); // strip any leading H1
      bodyEl.innerHTML = window.marked ? window.marked.parse(md) : `<pre>${escapeHtml(md)}</pre>`;
    } catch (err) {
      bodyEl.innerHTML =
        '<p class="muted">This version couldn\'t be loaded. <a href="blog.html">Back to the blog.</a></p>';
      console.error(err);
    }
  }

  show(getLang());
}
