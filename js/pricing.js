// ANSP Hotels & Hospitality - Tariff data +1000 and season logic
// Off/Season labels as per Excel, headers per property
// Properties without a TARIFFS entry show "Best rate on request" (B2B / on-request rates)
const TARIFFS = {
  "jim-corbett/whispering-oaks-corbett/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["EP","CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Cottage", slug: "deluxe-cottage", off: [3500,4000,4500,5000], season: [4000,4500,5000,5500] },
    ]
  },
  "jim-corbett/corbett-leela-vilas/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["EP","CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Room", slug: "deluxe-room", off: [3500,4000,4500,5000], season: [4000,4500,5000,5500] },
      { name: "Suite Room", slug: "suite-room", off: [4500,5000,5500,6000], season: [5000,5500,6000,6500] },
      { name: "Family Suite Room", slug: "family-suite-room", off: [5500,5500,6500,7000], season: [6000,6000,6500,7000] },
    ]
  },
  "jim-corbett/prakaram-resort/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["EP","CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Room (4)", slug: "deluxe-room", off: [3000,3500,4000,4500], season: [3500,4000,4500,5000] },
      { name: "Suite Room (4)", slug: "suite-room", off: [3500,4000,4500,5000], season: [4000,4500,5000,5500] },
      { name: "Luxury Cottage (4)", slug: "luxury-cottage", off: [4500,5000,5500,6000], season: [5000,5500,6000,6500] },
    ]
  },
  "haridwar/abhyudyam-ganga/": {
    offLabel: "1st April'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 31st March'26",
    headers: ["EP","CP","MAP"],
    seasonMonths: { off: [4,5,6,7,8,9], season: [10,11,12,1,2,3] },
    rows: [
      { name: "Deluxe Room (11)", slug: "deluxe-room", off: [3500,4000,5000], season: [4000,4500,5500] },
      { name: "Super Deluxe Room (9)", slug: "super-deluxe-room", off: [4000,4500,5500], season: [4500,5000,6000] },
      { name: "Executive Room (6)", slug: "executice-room", off: [4500,5000,6000], season: [5000,5500,6000] },
      { name: "Family Room 4P (2)", slug: "family-room", off: [6000,7000,9000], season: [7500,8500,10500] },
    ]
  },
};

// Determine season for a property on a given date
function getSeason(propertyPath, date) {
  const t = TARIFFS[propertyPath];
  if (!t) return "season";
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Default: check seasonMonths
  if (t.seasonMonths.season.includes(m)) return "season";
  if (t.seasonMonths.off.includes(m)) return "off";
  return "season";
}

function getCurrentSeason(propertyPath) {
  return getSeason(propertyPath, new Date());
}

function getPrice(propertyPath, roomSlug, mealPlan, date) {
  const t = TARIFFS[propertyPath];
  if (!t) return null;
  const season = date ? getSeason(propertyPath, date) : getCurrentSeason(propertyPath);
  const row = t.rows.find(r => r.slug === roomSlug);
  if (!row) return null;
  const idx = t.headers.indexOf(mealPlan);
  if (idx === -1) return null;
  return season === "off" ? row.off[idx] : row.season[idx];
}

function getDefaultMealPlan(propertyPath) {
  const t = TARIFFS[propertyPath];
  if (!t) return "CP";
  // Prefer CP if available, else first
  if (t.headers.includes("CP")) return "CP";
  return t.headers[0];
}

function formatPrice(n) { return "₹" + n.toLocaleString("en-IN"); }

// Update room cards on property pages with current price badge
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-room-price]").forEach(function(el) {
    const prop = el.getAttribute("data-property");
    const room = el.getAttribute("data-room");
    const plan = el.getAttribute("data-plan") || getDefaultMealPlan(prop);
    const price = getPrice(prop, room, plan);
    if (price) {
      el.textContent = formatPrice(price) + " / night • " + plan;
      el.setAttribute("title", (getCurrentSeason(prop)==="season"?"Season":"Off-season") + " • " + TARIFFS[prop][getCurrentSeason(prop)==="season"?"seasonLabel":"offLabel"]);
    } else {
      el.textContent = "Best rate on request";
      el.setAttribute("title", "Call +91 86799 76939 for the best rate");
    }
  });
  // Update any element with data-current-season
  document.querySelectorAll("[data-season-label]").forEach(function(el){
    const prop = el.getAttribute("data-property");
    const t = TARIFFS[prop];
    if (!t) { el.style.display = "none"; return; }
    const cur = getCurrentSeason(prop);
    el.textContent = cur === "season" ? t.seasonLabel : t.offLabel;
    el.className = cur === "season" ? "badge-season" : "badge-off";
  });
});
