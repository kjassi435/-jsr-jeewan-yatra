/* Fan hotel cards — vanilla port of SocialCards (Bakes n Sale).
   12 hotels fanned in an arc, 7 visible, center focused. Arrows + dots
   paginate, hover lifts a card and pushes neighbours, click opens the
   hotel page (native anchor — no drag handling to interfere). */
(function () {
  const CARDS = [
    { name: "Hill Turn Corbett Resort", city: "Ramnagar", href: "jim-corbett/hill-turn-corbett-resort/index.html", img: "assets/hotels/jim-corbett_hill-turn-corbett-resort-1.jpg" },
    { name: "The Whispering Oaks", city: "Dhikuli", href: "jim-corbett/whispering-oaks-corbett/index.html", img: "assets/hotels/jim-corbett_whispering-oaks-corbett-1.jpg" },
    { name: "Corbett Leela Vilas", city: "Dhikuli", href: "jim-corbett/corbett-leela-vilas/index.html", img: "assets/hotels/jim-corbett_corbett-leela-vilas-1.jpg" },
    { name: "Onyxx Nature Resort", city: "Choi", href: "jim-corbett/onyxx-nature-resort/index.html", img: "assets/hotels/jim-corbett_onyxx-nature-resort-1.jpg" },
    { name: "Corbett Prakarm Resort", city: "Sawaldey", href: "jim-corbett/corbett-prakarm-resort/index.html", img: "assets/hotels/jim-corbett_corbett-prakarm-resort.svg" },
    { name: "Maulik Mansion Resort", city: "Dhikuli", href: "jim-corbett/maulik-mansion-resort/index.html", img: "assets/hotels/jim-corbett_maulik-mansion-resort-1.jpg" },
    { name: "Maya The Forest Resort", city: "Sawaldey", href: "jim-corbett/maya-the-forest-resort/index.html", img: "assets/hotels/jim-corbett_maya-the-forest-resort-1.webp" },
    { name: "Hotel Cedar Wood", city: "Nainital", href: "nainital/hotel-cedar-wood/index.html", img: "assets/hotels/nainital_hotel-cedar-wood-hero.webp" },
    { name: "Olive Lake View", city: "Bhimtal", href: "bhimtal/olive-lake-view/index.html", img: "assets/hotels/bhimtal_olive-lake-view-1.jpg" },
    { name: "Wild Spring", city: "Mussoorie", href: "mussoorie/wild-spring/index.html", img: "assets/hotels/mussoorie_wild-spring-hero.jpg" },
    { name: "The Abhyudyam Ganga", city: "Haridwar", href: "haridwar/abhyudyam-ganga/index.html", img: "assets/hotels/haridwar_abhyudyam-ganga-1.webp" },
    { name: "Sundervan Vilas", city: "Ranthambore", href: "ranthambore/sundervan-vilas/index.html", img: "assets/hotels/ranthambore_sundervan-vilas-1.webp" }
  ];

  const MAX_VISIBLE = 7;
  const HALF = 3;
  const FAN_POSITIONS = [
    { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
    { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
    { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
    { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
    { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
    { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
    { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 }
  ];

  function getResponsiveMultiplier(width) {
    if (width < 480) return 0.28;
    if (width < 640) return 0.38;
    if (width < 768) return 0.5;
    if (width < 1024) return 0.75;
    return 1.0;
  }

  function getHeightMultiplier(width) {
    let idealPx;
    if (width < 480) idealPx = 22 * 16;
    else if (width < 640) idealPx = 26 * 16;
    else if (width < 768) idealPx = 28 * 16;
    else if (width < 1024) idealPx = 34 * 16;
    else idealPx = 38 * 16;
    const available = window.innerHeight * 0.7;
    if (available >= idealPx) return 1;
    return available / idealPx;
  }

  function init() {
    const mount = document.getElementById("fanCards");
    if (!mount || !CARDS.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = CARDS.length;
    let center = HALF;
    let isAnimating = false;
    let hasEntered = false;
    let activeSlot = null;
    let leaveTimer = null;

    // Build cards
    const els = CARDS.map((c, i) => {
      const a = document.createElement("a");
      a.className = "fan-card";
      a.href = c.href;
      a.setAttribute("aria-label", c.name + ", " + c.city);
      a.innerHTML =
        '<div class="fan-img"><img src="' + c.img + '" alt="' + c.name + '" loading="lazy">' +
        '<span class="fan-badge">Resort</span></div>' +
        '<div class="fan-body"><span class="fan-city">' + c.city + "</span><h3>" + c.name + "</h3></div>";
      try {
        a.addEventListener("click", function () {
          (window.dataLayer = window.dataLayer || []).push({ event: "fan_card_click", name: c.name, position: i });
        });
      } catch (err) {}
      mount.appendChild(a);
      return a;
    });

    // Pagination (dots)
    const dotsWrap = document.getElementById("fanDots");
    const dots = CARDS.map((_, i) => {
      const d = document.createElement("button");
      d.className = "fan-dot" + (i === center ? " active" : "");
      d.setAttribute("aria-label", "Go to " + CARDS[i].name);
      d.addEventListener("click", () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(d);
      return d;
    });

    // Fewer visible cards on small screens so they never crowd:
    // phones show 3 (gentle arc), tablets 5, desktop 7.
    function visibleCount() {
      const w = window.innerWidth;
      if (w < 640) return 3;
      if (w < 1024) return 5;
      return MAX_VISIBLE;
    }

    function visibleMap(centerIdx) {
      const vc = visibleCount();
      const half = vc >> 1;
      const map = new Map();
      for (let slot = 0; slot < vc; slot++) {
        map.set(((centerIdx + slot - half) % total + total) % total, slot);
      }
      return map;
    }

    // Phones get their own wide-spread 3-card fan (positions already in
    // final rem — no responsive shrinking, or the cards pile up again).
    // Tablets/desktop map onto the 7-position arc (keeps the same look).
    const MOBILE_FAN = [
      { rot: -14, scale: 0.78, x: -9.5, y: 2.2, zIndex: 2 },
      { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
      { rot: 14, scale: 0.78, x: 9.5, y: 2.2, zIndex: 2 }
    ];

    function isPhone() { return window.innerWidth < 640; }

    function slotConfig(slot) {
      if (isPhone()) return MOBILE_FAN[slot];
      const vc = visibleCount();
      return FAN_POSITIONS[slot + ((MAX_VISIBLE - vc) >> 1)];
    }

    function paint(hoveredSlot) {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);
      const phone = isPhone();
      const vis = visibleMap(center);
      const centerSlot = visibleCount() >> 1;
      els.forEach((el, i) => {
        const slot = vis.get(i);
        if (slot === undefined) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.zIndex = "0";
          return;
        }
        const base = slotConfig(slot);
        const m = phone ? 1 : mult; // phone table is pre-tuned, don't shrink it
        let tx = base.x * m, ty = base.y * hM, rot = base.rot, sc = base.scale;
        if (hoveredSlot !== null && hoveredSlot !== undefined) {
          const distance = Math.abs(slot - hoveredSlot);
          if (slot === hoveredSlot) { ty -= 2.5 * hM; sc *= 1.08; }
          else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const push = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));
            if (slot < hoveredSlot) { tx -= push * m; rot -= 3 / (distance + 1); }
            else { tx += push * m; rot += 3 / (distance + 1); }
          }
        }
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.zIndex = String(base.zIndex);
        el.style.transform =
          "translate(" + tx.toFixed(2) + "rem," + ty.toFixed(2) + "rem) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(4) + ")";
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === center));
    }

    function goTo(idx) {
      if (isAnimating) return;
      isAnimating = true;
      activeSlot = null;
      center = ((idx % total) + total) % total;
      paint(null);
      setTimeout(() => { isAnimating = false; }, reduced ? 0 : 550);
    }

    function cycle(dir) {
      goTo(center + (dir === "right" ? 1 : -1));
    }

    // Entry animation: staggered rise, one card at a time
    function enter() {
      hasEntered = true;
      const mult = window.innerWidth < 640 ? 1 : getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);
      const vis = visibleMap(center);
      if (reduced) { paint(null); isAnimating = false; return; }
      let revealed = 0;
      const total = vis.size;
      els.forEach((el, i) => {
        const slot = vis.get(i);
        if (slot === undefined) return;
        const base = slotConfig(slot);
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translate(0rem,12rem) rotate(0deg) scale(0.5)";
        // force reflow so the transition below animates
        void el.offsetWidth;
        setTimeout(() => {
          el.style.transition = "";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
          el.style.zIndex = String(base.zIndex);
          el.style.transform =
            "translate(" + (base.x * mult).toFixed(2) + "rem," + (base.y * hM).toFixed(2) + "rem) rotate(" + base.rot + "deg) scale(" + base.scale + ")";
          if (++revealed >= total) isAnimating = false;
        }, 200 + slot * 60);
      });
    }

    // Hover interactions
    els.forEach((el, i) => {
      el.addEventListener("mouseenter", () => {
        if (isAnimating || !hasEntered) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        const slot = visibleMap(center).get(i);
        if (slot !== undefined && activeSlot !== slot) { activeSlot = slot; paint(slot); }
      });
    });
    mount.addEventListener("mouseleave", () => {
      if (isAnimating) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; paint(null); }, 50);
    });

    const prev = document.getElementById("fanPrev");
    const next = document.getElementById("fanNext");
    if (prev) prev.addEventListener("click", () => cycle("left"));
    if (next) next.addEventListener("click", () => cycle("right"));

    mount.setAttribute("tabindex", "0");
    mount.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { cycle("right"); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { cycle("left"); e.preventDefault(); }
    });

    window.addEventListener("resize", () => paint(activeSlot));

    // Start hidden; reveal with staggered entry on first view
    isAnimating = true;
    els.forEach((el) => { el.style.opacity = "0"; el.style.pointerEvents = "none"; });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { enter(); io.disconnect(); }
        });
      }, { threshold: 0.15 });
      io.observe(mount);
    } else {
      enter();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
