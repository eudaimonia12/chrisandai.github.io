/* Contact form.
 *
 * Two modes:
 *  1. Formspree (recommended for real submissions): set FORMSPREE_ID below to
 *     your form id (e.g. "xldeyabc") from https://formspree.io. The form will
 *     POST via fetch and show an inline success message — no page reload.
 *  2. Mail-client fallback (default, zero config): if no Formspree id is set,
 *     the form opens the visitor's email client with the message pre-filled.
 */
(function () {
  "use strict";

  const FORMSPREE_ID = ""; // <-- put your Formspree form id here to enable direct submissions
  const TO_EMAIL = "chris.dai2023@outlook.com";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const subject = (data.get("subject") || "Message from your website").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      if (FORMSPREE_ID) {
        try {
          note.textContent = "Sending\u2026";
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data,
          });
          if (res.ok) {
            form.reset();
            note.textContent = "Thanks — your message has been sent. I'll be in touch soon.";
          } else {
            throw new Error("Formspree error");
          }
        } catch (err) {
          note.textContent = "Something went wrong. Please email me directly at " + TO_EMAIL + ".";
          console.error(err);
        }
        return;
      }

      // Fallback: open the visitor's mail client.
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href =
        `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = "Opening your email app\u2026 If nothing happens, email me at " + TO_EMAIL + ".";
    });
  });
})();
