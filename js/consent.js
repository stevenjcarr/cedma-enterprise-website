/* Analytics consent for CEdMA Enterprise.
   Google Tag Manager (and so Google Analytics) loads only after the
   visitor accepts. Until then nothing is requested from Google and no
   analytics cookies are set. The choice is kept in localStorage, not a
   cookie, and can be changed from "Cookie settings" in the footer. */
(function () {
  "use strict";

  var GTM_ID = "GTM-NRC2X9RG";
  var KEY = "cedma-analytics-consent";
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function getChoice() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: choice lasts for this page only */ }
  }

  function loadGTM() {
    if (loaded) return;
    loaded = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(s);
  }

  function clearAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name === "_gat") {
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  var banner = null;

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function accept() {
    setChoice("granted");
    hideBanner();
    loadGTM();
  }

  function decline() {
    var wasLoaded = loaded;
    setChoice("denied");
    hideBanner();
    gtag("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
    /* Google's script can't be unloaded, so reload to stop it if it was running. */
    if (wasLoaded) window.location.reload();
  }

  function privacyHref() {
    var link = document.querySelector('.site-footer a[href$="privacy.html"]');
    return link ? link.getAttribute("href") : "/privacy.html";
  }

  function buildBanner() {
    banner = document.createElement("section");
    banner.className = "consent";
    banner.setAttribute("aria-label", "Cookie choice");
    banner.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text">We would like to use Google Analytics cookies to see how people use this site, so we can improve it. ' +
        'We only set them if you accept. <a href="' + privacyHref() + '#p11">How we use cookies</a></p>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--amber" data-consent="accept">Accept analytics</button>' +
          '<button type="button" class="btn consent__decline" data-consent="decline">Decline</button>' +
        '</div>' +
      '</div>';
    banner.querySelector('[data-consent="accept"]').addEventListener("click", accept);
    banner.querySelector('[data-consent="decline"]').addEventListener("click", decline);
    document.body.appendChild(banner);
  }

  function showBanner() {
    if (!banner) buildBanner();
    banner.hidden = false;
    var first = banner.querySelector("button");
    if (first) first.focus();
  }

  if (getChoice() === "granted") loadGTM();

  function init() {
    if (getChoice() !== "granted" && getChoice() !== "denied") {
      if (!banner) buildBanner();
      banner.hidden = false;
    }
    var settings = document.querySelectorAll("[data-cookie-settings]");
    for (var i = 0; i < settings.length; i++) {
      settings[i].addEventListener("click", showBanner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
