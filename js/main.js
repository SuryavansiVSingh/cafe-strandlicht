(function () {
  "use strict";

  var T = window.I18N, MENU = window.MENU, CFG = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "nl";

  function t(key) { return (T[lang] && T[lang][key]) || T.nl[key] || key; }

  /* ---------- 1. Language (NL / EN) ---------- */
  function pickStartLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && T[fromUrl]) return fromUrl;
    try { var saved = localStorage.getItem("lang"); if (saved && T[saved]) return saved; } catch (e) {}
    return (navigator.language || "nl").slice(0, 2) === "en" ? "en" : "nl";
  }

  function setLang(next, updateUrl) {
    lang = T[next] ? next : "nl";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    renderMenu();
    updateOpenNow();
    clearErrors();
    try { localStorage.setItem("lang", lang); } catch (e) {}
    if (updateUrl) {
      try {
        var url = new URL(location.href);
        url.searchParams.set("lang", lang);
        history.replaceState(null, "", url);
      } catch (e) {} // some embedded previews block URL changes
    }
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang, true); });
  });

  /* ---------- 2. Menu (built from js/i18n.js) ---------- */
  var euro = function (n) {
    return new Intl.NumberFormat(lang === "en" ? "en-BE" : "nl-BE", { style: "currency", currency: "EUR" }).format(n);
  };

  function renderMenu() {
    Object.keys(MENU).forEach(function (cat) {
      var panel = document.getElementById("panel-" + cat);
      if (!panel) return;
      var en = lang === "en";
      panel.innerHTML = "<ul class=\"menu-list\">" + MENU[cat].map(function (it, i) {
        return "<li style=\"--i:" + i + "\"><div><strong>" + (en ? it[1] : it[0]) + "</strong><span>" +
          (en ? it[3] : it[2]) + "</span></div><b class=\"dots\" aria-hidden=\"true\"></b><em>" + euro(it[4]) + "</em></li>";
      }).join("") + "</ul>";
    });
  }

  /* ---------- 3. Menu tabs (click + arrow keys) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[role=tab]"));
  var menuImg = document.getElementById("menu-img");

  function selectTab(tab, focus) {
    tabs.forEach(function (x) {
      var on = x === tab;
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute("aria-controls"));
      p.hidden = !on;
      if (on) {
        p.classList.remove("show"); void p.offsetWidth; p.classList.add("show");
        if (menuImg.getAttribute("src") !== p.dataset.img) {
          menuImg.classList.add("swap");
          setTimeout(function () { menuImg.src = p.dataset.img; menuImg.classList.remove("swap"); }, reduceMotion ? 0 : 220);
        }
      }
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var k = e.key, n = tabs.length, j = null;
      if (k === "ArrowRight") j = (i + 1) % n;
      if (k === "ArrowLeft") j = (i - 1 + n) % n;
      if (k === "Home") j = 0;
      if (k === "End") j = n - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j], true); }
    });
  });

  /* ---------- 4. Scroll animations ---------- */
  // 4a. Reveal: elements with .reveal fade/slide in once when they enter the screen.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // 4b. Count-up numbers in the About section.
  function countUp(el) {
    var end = +el.dataset.count, start = null;
    if (reduceMotion) { el.textContent = end; return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(function (c) { c.textContent = c.dataset.count; }); }

  // 4c. Parallax, header shadow and reading progress bar (one scroll handler, throttled with rAF).
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".progress span");
  var parallax = document.querySelectorAll("[data-parallax]");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 40);
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (!reduceMotion) {
      parallax.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var offset = (r.top + r.height / 2 - innerHeight / 2) * -parseFloat(el.dataset.parallax);
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- 5. "Open now" badge (Brussels time) ---------- */
  var HOURS = { 0: [8.5, 19], 1: null, 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 21], 6: [8.5, 21] };
  function updateOpenNow() {
    var el = document.getElementById("open-now");
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var get = function (type) { return parts.filter(function (p) { return p.type === type; })[0].value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    var now = +get("hour") + +get("minute") / 60;
    var h = HOURS[day], open = !!h && now >= h[0] && now < h[1];
    el.textContent = t(open ? "open.now" : "open.closed");
    el.className = "open-now " + (open ? "is-open" : "is-closed");
    document.querySelectorAll(".hours tr").forEach(function (tr) { tr.classList.toggle("today", +tr.dataset.day === day); });
  }

  /* ---------- 6. Contact form ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var dateInput = form.elements.date;
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  function clearErrors() {
    form.querySelectorAll(".err").forEach(function (e) { e.textContent = ""; });
    form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
  }

  // Returns a list of field names that are wrong.
  function validate() {
    var f = form.elements, bad = [];
    if (f.name.value.trim().length < 2) bad.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) bad.push("email");
    if (!f.date.value || f.date.value < f.date.min) bad.push("date");
    var g = +f.guests.value;
    if (!Number.isInteger(g) || g < 1 || g > 20) bad.push("guests");
    return bad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    status.textContent = ""; status.className = "form-status";
    var bad = validate();
    if (bad.length) {
      bad.forEach(function (name) {
        form.elements[name].setAttribute("aria-invalid", "true");
        form.querySelector('.err[data-for="' + name + '"]').textContent = t("err." + name);
      });
      form.elements[bad[0]].focus();
      return;
    }
    if (form.elements.botcheck.checked) return; // spam bot filled the hidden field

    var done = function (key, ok) {
      status.textContent = t(key);
      status.className = "form-status " + (ok ? "ok" : "fail");
      if (ok) form.reset();
      btn.disabled = false;
    };
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.textContent = t("f.sending");

    if (!CFG.WEB3FORMS_ACCESS_KEY) { setTimeout(function () { done("f.demo", true); }, 500); return; }

    var data = Object.fromEntries(new FormData(form));
    data.access_key = CFG.WEB3FORMS_ACCESS_KEY;
    data.subject = "Reservatie via website — " + data.name;
    delete data.botcheck;
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); })
      .then(function (j) { done(j.success ? "f.ok" : "f.fail", !!j.success); })
      .catch(function () { done("f.fail", false); });
  });

  /* ---------- Start ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  setLang(pickStartLang(), false);
  onScroll();
  document.body.classList.add("ready");

  // Exposed for automated tests only.
  window.__site = { validate: validate, setLang: setLang, getLang: function () { return lang; } };
})();
