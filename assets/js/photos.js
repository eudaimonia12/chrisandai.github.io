/* Photo library: render gallery from photos/photos.json + lightbox viewer. */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  document.addEventListener("DOMContentLoaded", async function () {
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lb-img");
    const lbCaption = document.getElementById("lb-caption");
    const lbClose = document.getElementById("lb-close");
    if (!gallery) return;

    let photos = [];
    try {
      const res = await fetch("photos/photos.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("no index");
      photos = await res.json();
    } catch (err) {
      gallery.innerHTML =
        '<div class="empty-state">Couldn\'t load photos. If you\'re viewing locally, run a local server (see README).</div>';
      console.error(err);
      return;
    }

    if (!photos.length) {
      gallery.innerHTML =
        '<div class="empty-state">No photos yet. Add images to <code>assets/img/photos/</code> and list them in <code>photos/photos.json</code>.</div>';
      return;
    }

    gallery.innerHTML = photos
      .map(
        (p, i) => `<figure>
          <button type="button" data-index="${i}">
            <img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt || p.caption || "Photograph")}" loading="lazy" />
          </button>
          ${p.caption ? `<figcaption>${escapeHtml(p.caption)}</figcaption>` : ""}
        </figure>`
      )
      .join("");

    let opener;

    function openLightbox(button) {
      const p = photos[Number(button.dataset.index)];
      if (!p) return;
      opener = button;
      lbImg.src = p.src;
      lbImg.alt = p.alt || p.caption || "Photograph";
      lbCaption.textContent = p.caption || "";
      lightbox.showModal();
      document.body.style.overflow = "hidden";
    }

    gallery.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => openLightbox(button));
    });
    lbClose.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
      document.body.style.overflow = "";
      opener?.focus();
    });
  });
})();
