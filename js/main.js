// CEdMA Enterprise site scripts: mobile menu, calendar filter, agenda tabs.
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Calendar filter
  var filters = document.querySelectorAll(".filter[data-filter]");
  if (filters.length) {
    var lists = document.querySelectorAll("[data-list]");
    var apply = function (kind) {
      filters.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.filter === kind));
      });
      lists.forEach(function (list) {
        var shown = 0;
        list.querySelectorAll("[data-kind]").forEach(function (item) {
          var match = kind === "all" || item.dataset.kind === kind;
          item.hidden = !match;
          if (match) shown++;
        });
        var empty = list.querySelector(".empty-note");
        if (empty) empty.hidden = shown > 0;
      });
    };
    filters.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.dataset.filter); });
    });
  }

  // Agenda tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[role="tab"]'));
  if (tabs.length) {
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  }
})();

// Agenda: one session's details open at a time
(function () {
  "use strict";
  var toggles = Array.prototype.slice.call(document.querySelectorAll(".ag-toggle"));
  if (!toggles.length) return;
  var close = function (t) {
    t.setAttribute("aria-expanded", "false");
    t.textContent = t.dataset.label;
    document.getElementById(t.getAttribute("aria-controls")).hidden = true;
  };
  toggles.forEach(function (t) {
    t.addEventListener("click", function () {
      var open = t.getAttribute("aria-expanded") === "true";
      toggles.forEach(function (o) { if (o !== t) close(o); });
      if (open) { close(t); return; }
      t.setAttribute("aria-expanded", "true");
      t.textContent = "Hide details";
      document.getElementById(t.getAttribute("aria-controls")).hidden = false;
    });
  });
  // Closing details when switching day keeps the page short
  document.querySelectorAll('.tab[role="tab"]').forEach(function (tab) {
    tab.addEventListener("click", function () { toggles.forEach(close); });
  });
})();

// Agenda: print every day with all details open
(function () {
  "use strict";
  var btn = document.querySelector(".print-agenda");
  if (!btn) return;
  btn.addEventListener("click", function () {
    document.body.classList.add("printing-agenda");
    window.print();
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("printing-agenda");
  });
})();
