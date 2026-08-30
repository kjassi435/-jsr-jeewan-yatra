/* =====================================================
   Leisure Hotels Group — interactions engine
   header · parallax · 3D tilt · tabs · reveal · counters
   ===================================================== */
(function () {
  'use strict';

  /* ---------- Sticky glass header ---------- */
  var header = document.getElementById('siteHeader');
  function onHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onHeader, { passive: true });
  onHeader();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) document.body.classList.remove('nav-open');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero parallax (content drifts + fades, media sinks) ---------- */
  var heroContent = document.getElementById('heroContent');
  var heroMedia = document.querySelector('.hero-media');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroContent && !reduceMotion) {
    var raf = null;
    var parallax = function () {
      raf = null;
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroContent.style.transform = 'translate3d(0,' + y * 0.32 + 'px,0)';
        heroContent.style.opacity = Math.max(0, 1 - y / 640);
        if (heroMedia) heroMedia.style.transform = 'translate3d(0,' + y * 0.16 + 'px,0) scale(1.05)';
      }
    };
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(parallax);
    }, { passive: true });
  }

  /* ---------- Generic [data-parallax] layers ---------- */
  var pxSections = document.querySelectorAll('[data-parallax]');
  if (pxSections.length && !reduceMotion) {
    var updateAll = function () {
      pxSections.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > window.innerHeight + 80) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(updateAll); }, { passive: true });
    window.addEventListener('resize', updateAll);
    updateAll();
  }

  /* ---------- 3D tilt cards ---------- */
  var tiltEls = document.querySelectorAll('[data-tilt]');
  if (tiltEls.length && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    tiltEls.forEach(function (el) {
      var rafId = null;
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          el.style.transform = 'perspective(900px) rotateX(' + (-y * 7).toFixed(2) +
            'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-6px)';
        });
      });
      el.addEventListener('mouseleave', function () {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = '';
      });
    });
  }

  /* ---------- Tabs ([data-tabs] with [data-tab-target]/[data-tab-pane]) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('[data-tab-target]');
    var panes = tabs.querySelectorAll('[data-tab-pane]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-target');
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panes.forEach(function (p) {
          var on = p.getAttribute('data-tab-pane') === target;
          p.classList.toggle('active', on);
        });
      });
    });
  });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1600, t0 = performance.now();
        var tick = function (t) {
          var p = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io3.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io3.observe(c); });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Form handling: mailto + redirect to thank-you ---------- */
  function prefixForThanks() {
    var dirs = location.pathname.split('/').filter(Boolean);
    var n = Math.max(0, dirs.length - 1);
    return '../'.repeat(n);
  }
  function buildMailto(form) {
    var to = 'bookings@leisurehotels.in';
    var subject = form.dataset.subject || 'Website Enquiry — Leisure Hotels Group';
    var body = [];
    var fd = new FormData(form);
    fd.forEach(function(v, k) { if (v) body.push(k + ': ' + v); });
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.join('\n'));
  }
  document.querySelectorAll('form.news-form, form.glass-form').forEach(function(f) {
    f.addEventListener('submit', function(e) {
      e.preventDefault();
      window.location.href = buildMailto(f);
      setTimeout(function() { location.href = prefixForThanks() + 'thank-you.html'; }, 800);
    });
  });
})();
