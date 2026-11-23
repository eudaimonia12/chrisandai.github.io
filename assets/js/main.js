/* Shared theme, navigation and footer year. */
(function () {
  "use strict";

  // ---- Theme ----
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.textContent = theme === "dark" ? "\u2600\uFE0E" : "\u263E";
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  // ---- On DOM ready ----
  document.addEventListener("DOMContentLoaded", function () {
    updateToggleIcon(root.getAttribute("data-theme"));

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(next);
      });
    });

    // Mobile nav
    const toggle = document.querySelector("[data-nav-toggle]");
    const links = document.getElementById("main-nav");
    if (toggle && links) {
      function setMenuOpen(open) {
        links.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
      }

      toggle.addEventListener("click", () => {
        const open = !links.classList.contains("open");
        setMenuOpen(open);
        if (open) links.querySelector("a")?.focus();
      });
      links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && links.classList.contains("open")) {
          setMenuOpen(false);
          toggle.focus();
        }
      });
    }

    // Active nav link
    const path = location.pathname.split("/").pop() || "index.html";
    const activePage = path === "post.html" ? "blog.html" : path;
    const activeLink = links?.querySelector(`a[href="${CSS.escape(activePage)}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
      activeLink.setAttribute("aria-current", path === "post.html" ? "location" : "page");
    }

    // Footer year
    const yr = document.querySelector("[data-year]");
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
