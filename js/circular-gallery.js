/* Circular 3D Hotel Gallery — Bakes n Sale PRD port (vanilla)
   12 hotels on a 3D ring. Auto-rotate 0.14deg/frame, hover/drag pause,
   drag momentum (0.96 friction), click suppressed if dragged >8px,
   hover brightness + View badge, keyboard nav, reduced-motion,
   lazy off-screen cards, hero_card_click analytics. */
(function () {
  const DATA = [
    { name: "Hill Turn Corbett Resort", city: "Ramnagar, Jim Corbett", href: "jim-corbett/hill-turn-corbett-resort/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_0,y_95,w_1824,h_1026,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/the-riverview-retreat-corbett/T3xWP0xQ_qu2h5v_gqmbmi" },
    { name: "The Whispering Oaks", city: "Dhikuli, Jim Corbett", href: "jim-corbett/whispering-oaks-corbett/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3744/x_0,y_465,w_5000,h_2814,r_0,c_crop/q_80,w_900,f_auto,c_limit/leisure-hotels/the-corbett-hideaway" },
    { name: "Corbett Leela Vilas", city: "Dhikuli, Jim Corbett", href: "jim-corbett/corbett-leela-vilas/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_2000/x_722,y_0,w_3556,h_2000,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/the-jamoon-corbett/jungle_tour_5_The_Jamoon_Resort_Corbett" },
    { name: "Onyxx Nature Resort", city: "Choi, Jim Corbett", href: "jim-corbett/onyxx-nature-resort/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3330/x_0,y_259,w_5000,h_2812,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/mountoria-retreat-naukuchiatal/11_tf5rew" },
    { name: "Corbett Prakarm Resort", city: "Sawaldey, Jim Corbett", href: "jim-corbett/corbett-prakarm-resort/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_0,y_162,w_2048,h_1154,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/fishermens-lodge/facade-and-outdoor-restaurant" },
    { name: "Maulik Mansion Resort", city: "Dhikuli, Jim Corbett", href: "jim-corbett/maulik-mansion-resort/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_0,y_204,w_3911,h_2199,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/ganga-lahari-haridwar/Facade_1_ayesgx" },
    { name: "Maya The Forest Resort", city: "Sawaldey, Jim Corbett", href: "jim-corbett/maya-the-forest-resort/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/aloha-on-the-ganges-rishikesh/Superior_Royal_room_3_uh2qhw" },
    { name: "Hotel Cedar Wood", city: "Nainital", href: "nainital/hotel-cedar-wood/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_0,y_95,w_1824,h_1026,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/the-naini-retreat-nainital/Facade_er2z38" },
    { name: "Olive Lake View", city: "Bhimtal", href: "bhimtal/olive-lake-view/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3330/x_0,y_259,w_5000,h_2812,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/mountoria-retreat-naukuchiatal/11_tf5rew" },
    { name: "Wild Spring", city: "Mussoorie", href: "mussoorie/wild-spring/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_167,y_333,w_1912,h_1075,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/samsara-hill-resort-mussoorie/aerial-night-view-facade" },
    { name: "The Abhyudyam Ganga", city: "Haridwar", href: "haridwar/abhyudyam-ganga/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/x_0,y_204,w_3911,h_2199,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/ganga-lahari-haridwar/Facade_1_ayesgx" },
    { name: "Sundervan Vilas", city: "Ranthambore", href: "ranthambore/sundervan-vilas/index.html", img: "https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/leisure-hotels-revamp/Safari_The_Bungalows_Corbett_1_abcg4j_s49jil" }
  ];

  // PRD responsive table: breakpoint -> {radius, card WxH}
  function dims() {
    const w = window.innerWidth;
    if (w < 480) return { radius: 320, cw: 220, ch: 270 };
    if (w < 640) return { radius: 340, cw: 240, ch: 288 };
    if (w < 768) return { radius: 420, cw: 260, ch: 324 };
    if (w < 1024) return { radius: 520, cw: 280, ch: 342 };
    if (w < 1440) return { radius: 600, cw: 300, ch: 388 };
    return { radius: 680, cw: 320, ch: 402 };
  }

  function init() {
    const mount = document.getElementById("circularGallery");
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO = reduced ? 0 : 0.14;
    let d = dims();
    let rotation = 0;
    let velocity = 0;
    let isScrolling = false;
    let scrollTimer = null;
    let hovering = false;
    let dragging = false;
    let dragStartX = 0;
    let dragLastX = 0;
    let dragDist = 0;

    mount.innerHTML = "";
    mount.setAttribute("tabindex", "0");
    mount.setAttribute("role", "region");
    mount.setAttribute("aria-label", "Circular 3D Gallery of Jeewan Yatra Hotels. Use left and right arrows to rotate, Enter to open.");
    const ring = document.createElement("div");
    ring.className = "cg-ring";
    mount.appendChild(ring);

    const anglePer = 360 / DATA.length;
    const cards = DATA.map((item, i) => {
      const a = document.createElement("a");
      a.className = "cg-item";
      a.href = item.href;
      a.setAttribute("aria-label", item.name + ", " + item.city);
      a.style.width = d.cw + "px";
      a.style.height = d.ch + "px";
      a.style.marginLeft = -(d.cw / 2) + "px";
      a.style.marginTop = -(d.ch / 2) + "px";
      a.style.transform = "rotateY(" + i * anglePer + "deg) translateZ(" + d.radius + "px)";
      // Lazy: eager for first 3, lazy rest (updated per-frame below)
      a.innerHTML =
        '<div class="cg-card">' +
        '<img src="' + item.img + '" alt="' + item.name + '" ' + (i < 3 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + ">" +
        '<span class="cg-view">View Hotel</span>' +
        '<div class="cg-caption"><h2>' + item.name + "</h2><em>" + item.city + "</em></div>" +
        "</div>";
      // Click suppressed if dragged >8px + analytics
      a.addEventListener("click", function (e) {
        if (dragDist > 8) { e.preventDefault(); return; }
        try {
          (window.dataLayer = window.dataLayer || []).push({ event: "hero_card_click", name: item.name, position: i });
        } catch (err) {}
      });
      a.addEventListener("mouseenter", () => { hovering = true; });
      a.addEventListener("mouseleave", () => { hovering = false; });
      ring.appendChild(a);
      return a;
    });

    function paint() {
      ring.style.transform = "rotateY(" + rotation + "deg)";
      const total = ((rotation % 360) + 360) % 360;
      cards.forEach((el, i) => {
        const rel = ((i * anglePer + total) % 360 + 360) % 360;
        const norm = Math.abs(rel > 180 ? 360 - rel : rel);
        el.style.opacity = Math.max(0.3, 1 - norm / 180).toFixed(2);
        el.style.zIndex = String(Math.round(100 - norm));
        el.style.pointerEvents = norm > 100 ? "none" : "auto";
        // Lazy: eager for center 3 (norm < 60), lazy rest
        const img = el.querySelector("img");
        if (img) img.setAttribute("loading", norm < 60 ? "eager" : "lazy");
        el.classList.toggle("cg-front", norm < 30);
      });
    }

    function tick() {
      if (!reduced && !isScrolling && !dragging && !hovering) {
        rotation += AUTO + velocity;
        velocity *= 0.96; // momentum decay
        if (Math.abs(velocity) < 0.001) velocity = 0;
      } else if (!dragging) {
        velocity *= 0.96;
      }
      paint();
      requestAnimationFrame(tick);
    }

    function onScroll() {
      isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      rotation = p * 360;
      paint();
      scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
    }

    // Pointer + touch drag with momentum
    mount.addEventListener("pointerdown", (e) => {
      dragging = true; hovering = true;
      dragStartX = e.clientX; dragLastX = e.clientX; dragDist = 0; velocity = 0;
      try { mount.setPointerCapture(e.pointerId); } catch (err) {}
    });
    mount.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragDist += Math.abs(dx);
      rotation += dx * 0.25;
      velocity = dx * 0.25;
      paint();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
      mount.addEventListener(ev, () => { dragging = false; hovering = false; })
    );

    // Keyboard: arrows rotate, Enter opens front card
    mount.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { rotation += 30; paint(); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { rotation -= 30; paint(); e.preventDefault(); }
      else if (e.key === "Enter") {
        const front = cards.reduce((best, el) => {
          const z = parseInt(el.style.zIndex || "0", 10);
          return z > (best.z || -1) ? { el, z } : best;
        }, { el: null, z: -1 });
        if (front.el) front.el.click();
      }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      d = dims();
      cards.forEach((el, i) => {
        el.style.width = d.cw + "px";
        el.style.height = d.ch + "px";
        el.style.marginLeft = -(d.cw / 2) + "px";
        el.style.marginTop = -(d.ch / 2) + "px";
        el.style.transform = "rotateY(" + i * anglePer + "deg) translateZ(" + d.radius + "px)";
      });
      paint();
    });

    paint();
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
