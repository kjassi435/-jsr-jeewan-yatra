/* Circular 3D Hotel Gallery (vanilla port of React CircularGallery)
   - 12 hotels on a 3D ring, auto-rotates, scroll drives rotation, click opens hotel */
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

  function init() {
    const mount = document.getElementById("circularGallery");
    if (!mount) return;
    const radius = window.innerWidth < 640 ? 340 : window.innerWidth < 1024 ? 480 : 600;
    const autoSpeed = 0.08;
    let rotation = 0;
    let isScrolling = false;
    let scrollTimer = null;
    let rafId = null;
    let dragX = null;

    // Build DOM
    mount.innerHTML = "";
    const ring = document.createElement("div");
    ring.className = "cg-ring";
    mount.appendChild(ring);

    const anglePer = 360 / DATA.length;
    const cards = DATA.map((item, i) => {
      const a = document.createElement("a");
      a.className = "cg-item";
      a.href = item.href;
      a.setAttribute("aria-label", item.name + ", " + item.city);
      a.style.transform = "rotateY(" + (i * anglePer) + "deg) translateZ(" + radius + "px)";
      a.innerHTML =
        '<div class="cg-card">' +
        '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy">' +
        '<div class="cg-caption"><h2>' + item.name + '</h2><em>' + item.city + '</em><span class="cg-cta">View Hotel →</span></div>' +
        "</div>";
      ring.appendChild(a);
      return a;
    });

    function paint() {
      ring.style.transform = "rotateY(" + rotation + "deg)";
      const total = ((rotation % 360) + 360) % 360;
      cards.forEach((el, i) => {
        const itemAngle = i * anglePer;
        const rel = (itemAngle + total + 360) % 360;
        const norm = Math.abs(rel > 180 ? 360 - rel : rel);
        const op = Math.max(0.25, 1 - norm / 160);
        el.style.opacity = op.toFixed(2);
        el.style.zIndex = String(Math.round(100 - norm));
        el.style.pointerEvents = norm > 100 ? "none" : "auto";
      });
    }

    function autoRotate() {
      if (!isScrolling && dragX === null) rotation += autoSpeed;
      paint();
      rafId = requestAnimationFrame(autoRotate);
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

    // Drag to spin (desktop + touch)
    mount.addEventListener("pointerdown", (e) => { dragX = e.clientX; mount.setPointerCapture(e.pointerId); });
    mount.addEventListener("pointermove", (e) => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      dragX = e.clientX;
      rotation += dx * 0.25;
      paint();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
      mount.addEventListener(ev, () => { dragX = null; })
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      const r = window.innerWidth < 640 ? 340 : window.innerWidth < 1024 ? 480 : 600;
      cards.forEach((el, i) => {
        el.style.transform = "rotateY(" + i * anglePer + "deg) translateZ(" + r + "px)";
      });
    });

    paint();
    rafId = requestAnimationFrame(autoRotate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
