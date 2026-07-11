/* Shared behaviour: theme toggle, mobile nav, active links, reveal on scroll */
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
      btn.textContent = theme === "dark" ? "\u2600\uFE0F" : "\u263E";
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
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open"))
      );
    }

    // Active nav link
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
    });

    // Reveal on scroll
    const revealables = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealables.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealables.forEach((el) => io.observe(el));
    } else {
      revealables.forEach((el) => el.classList.add("in"));
    }

    // Footer year
    const yr = document.querySelector("[data-year]");
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
