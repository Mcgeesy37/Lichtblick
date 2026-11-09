(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");

  /* Kontaktadresse für das Bewertungsformular */
  var CONTACT_EMAIL = "kontakt@lichtblick-immobilien.de";

  /* Header-Linie beim Scrollen */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile Navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("hauptnavigation");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
    window.matchMedia("(min-width: 921px)").addEventListener("change", function (m) { if (m.matches) setNav(false); });
  }

  /* Sanftes Einblenden */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Jahr im Footer */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Bewertungsformular: statische Seite, daher Versand per E-Mail-Programm.
     Für Versand ohne Mailprogramm später einen Formular-Dienst anbinden. */
  var form = document.getElementById("bewertungsformular");
  var status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        var invalid = form.querySelector(":invalid");
        if (status) status.textContent = "Bitte füllen Sie die markierten Pflichtfelder aus.";
        if (invalid) invalid.focus();
        return;
      }
      var lines = [];
      new FormData(form).forEach(function (value, key) {
        if (key !== "Datenschutz" && String(value).trim()) lines.push(key + ": " + value);
      });
      var subject = "Bewertungsanfrage über die Website";
      var body = "Guten Tag,\n\nich interessiere mich für eine Immobilienbewertung.\n\n" + lines.join("\n") + "\n";
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (status) status.textContent = "Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage.";
    });
  }
})();
