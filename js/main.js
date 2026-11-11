// CEdMA Enterprise site scripts: mobile menu, calendar filter, agenda tabs, members ticker.
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
    var current = "all";
    var apply = function (kind) {
      current = kind;
      filters.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.filter === kind));
      });
      lists.forEach(function (list) {
        // Lists with data-limit show only the first few matches until "See more" is used
        var limit = parseInt(list.dataset.limit, 10) || 0;
        var more = list.id ? document.querySelector('[data-more-for="' + list.id + '"]') : null;
        var expanded = more ? more.getAttribute("aria-expanded") === "true" : true;
        var shown = 0;
        list.querySelectorAll("[data-kind]").forEach(function (item) {
          var match = kind === "all" || item.dataset.kind === kind;
          if (match) shown++;
          item.hidden = !match || (limit > 0 && !expanded && shown > limit);
        });
        var empty = list.querySelector(".empty-note");
        if (empty) empty.hidden = shown > 0;
        if (more) {
          more.hidden = !(limit > 0 && shown > limit);
          more.textContent = expanded ? "See less" : "See more";
        }
      });
    };
    filters.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.dataset.filter); });
    });
    document.querySelectorAll("[data-more-for]").forEach(function (more) {
      more.addEventListener("click", function () {
        more.setAttribute("aria-expanded", String(more.getAttribute("aria-expanded") !== "true"));
        apply(current);
      });
    });
    // A link such as calendar.html#sig opens with that filter already applied
    var start = window.location.hash.replace("#", "");
    apply(start && document.querySelector('.filter[data-filter="' + start + '"]') ? start : "all");
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

// Members ticker
(function () {
  "use strict";
  // The page lists each member once. Shuffle it, then copy it so the
  // scroll loops without a gap, and set the speed from the number of logos.
  var track = document.querySelector(".member-ticker__track");
  if (track) {
    var items = Array.prototype.slice.call(track.children);
    // Shuffle so the logos appear in a different order on each visit
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }
    items.forEach(function (item) { track.appendChild(item); });
    items.forEach(function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      var img = copy.querySelector("img");
      if (img) img.alt = "";
      track.appendChild(copy);
    });
    track.style.setProperty("--ticker-duration", Math.max(items.length * 4.5, 30) + "s");
    track.classList.add("is-looping");

    // Pause button, so visitors can stop the movement
    var head = document.querySelector(".member-ticker__head");
    if (head) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ticker-toggle";
      btn.setAttribute("aria-pressed", "false");
      var set = function (paused) {
        track.classList.toggle("is-paused", paused);
        btn.setAttribute("aria-pressed", String(paused));
        btn.innerHTML = paused
          ? '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor"/></svg>'
          : '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 H4 V9 H2 Z M6 1 H8 V9 H6 Z" fill="currentColor"/></svg>';
        btn.setAttribute("aria-label", paused ? "Play the member logos" : "Pause the member logos");
      };
      set(false);
      btn.addEventListener("click", function () { set(!track.classList.contains("is-paused")); });
      head.appendChild(btn);
    }
  }
})();

// SIG sessions: show each session's time in the visitor's own time zone
(function () {
  "use strict";
  var rows = document.querySelectorAll("time[data-utc]");
  if (!rows.length || !window.Intl) return;
  try {
    var fmt = new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
    Array.prototype.forEach.call(rows, function (t) {
      var row = t.closest("li");
      var out = row && row.querySelector("[data-local]");
      if (out) { out.textContent = "Your time: " + fmt.format(new Date(t.getAttribute("data-utc"))); out.hidden = false; }
    });
  } catch (e) { /* leave the UK and US times on their own */ }
})();
