/* Organic bubble background — 6 gooey layers + mouse-follow (Sunset Horizon) */
(function () {
  function init() {
    const mount = document.getElementById("bubbleBg");
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const COLORS = ["#390F10", "#B08D57", "#D4A574", "#FDE8D0", "#D4B896", "#8B3A1A"];
    mount.innerHTML =
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      '<filter id="jy-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur"/>' +
      '<feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -12" result="goo"/>' +
      '<feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs></svg>' +
      COLORS.map((c, i) => '<div class="jy-bubble jy-b' + (i + 1) + '" data-depth="' + (0.2 + i * 0.12) + '" style="background:' + c + '"></div>').join("");

    const bubbles = Array.from(mount.querySelectorAll(".jy-bubble"));
    let mx = 0, my = 0, cx = 0, cy = 0;

    if (!reduced) {
      window.addEventListener("pointermove", (e) => {
        const r = mount.getBoundingClientRect();
        mx = (e.clientX - r.left - r.width / 2) / r.width;
        my = (e.clientY - r.top - r.height / 2) / r.height;
      }, { passive: true });

      (function spring() {
        cx += (mx - cx) * 0.06;
        cy += (my - cy) * 0.06;
        bubbles.forEach((b) => {
          const depth = parseFloat(b.getAttribute("data-depth"));
          b.style.setProperty("--px", (cx * 60 * depth).toFixed(1) + "px");
          b.style.setProperty("--py", (cy * 60 * depth).toFixed(1) + "px");
        });
        requestAnimationFrame(spring);
      })();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
