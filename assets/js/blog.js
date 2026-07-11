/* Blog: list posts from posts/posts.json and render markdown essays. */

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
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
      el.innerHTML =
        '<div class="empty-state">No essays published yet. Check back soon.</div>';
      return;
    }
    el.innerHTML = posts
      .map((p) => {
        const tags = (p.tags || [])
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join("");
        return `<a class="post-item" href="post.html?p=${encodeURIComponent(p.slug)}">
            <span class="post-date">${formatDate(p.date)}</span>
            <h3>${escapeHtml(p.title)}</h3>
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

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    titleEl.textContent = "Essay not found";
    bodyEl.innerHTML = '<p class="muted">No essay was specified. <a href="blog.html">Back to the blog.</a></p>';
    return;
  }

  try {
    const posts = await loadPosts();
    const meta = posts.find((p) => p.slug === slug);

    const res = await fetch(`posts/${slug}.md`, { cache: "no-cache" });
    if (!res.ok) throw new Error("Essay markdown not found");
    let md = await res.text();

    // Strip a leading H1 (we show the title in the header instead).
    md = md.replace(/^\s*#\s+.*(\r?\n)+/, "");

    const title = meta ? meta.title : slug;
    document.title = `${title} — Chris Dai`;
    titleEl.textContent = title;
    if (meta) {
      dateEl.textContent = formatDate(meta.date);
      tagsEl.innerHTML = (meta.tags || [])
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join("");
    }

    bodyEl.innerHTML = window.marked ? window.marked.parse(md) : `<pre>${escapeHtml(md)}</pre>`;
  } catch (err) {
    titleEl.textContent = "Essay not found";
    bodyEl.innerHTML =
      '<p class="muted">This essay couldn\'t be loaded. <a href="blog.html">Back to the blog.</a></p>';
    console.error(err);
  }
}
