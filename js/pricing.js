// Jeewan Yatra Hotels - Tariff data +1000 and season logic
// Off/Season labels as per Excel, headers per property
const TARIFFS = {
  "jim-corbett/hill-turn-corbett-resort/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["EP","CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Room (21)", slug: "deluxe-room", off: [4000,4500,5000,5500], season: [4500,5000,5500,6000] },
      { name: "Superior Deluxe Room (22)", slug: "superior-dlx-room", off: [4500,5000,5500,6000], season: [5000,5500,6000,6500] },
      { name: "Suite Room with Bathtub (3)", slug: "suite-room-with-bathtub", off: [6000,7000,8000,9000], season: [7000,8000,9000,10000] },
      { name: "Family Cottage with Jacuzzi (4)", slug: "family-cottage-with-jacuzzi", off: [9000,10000,11000,12000], season: [10000,11000,12000,13000] },
    ]
  },
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
  "jim-corbett/onyxx-nature-resort/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["EP","CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Room", slug: "deluxe-room", off: [4000,4500,5000,5500], season: [4500,5000,5500,6000] },
      { name: "Superior Room", slug: "superior-room", off: [4500,5000,5500,6000], season: [5000,5500,6000,6500] },
      { name: "Luxury Room", slug: "luxury-room", off: [5000,5500,6000,6500], season: [5500,6000,6500,7000] },
      { name: "Family Suite (2A + 2 Child)", slug: "family-suite", off: [6000,7000,8000,9000], season: [7000,8000,9000,10000] },
    ]
  },
  "jim-corbett/corbett-prakarm-resort/": {
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
  "jim-corbett/maulik-mansion-resort/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'25 to 30th June'26",
    headers: ["CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Deluxe Room", slug: "deluxe-room", off: [6000,6500,7000], season: [6500,7250,8000] },
      { name: "Superior Room with Bath Tub", slug: "superior-room-with-bath-tub", off: [6500,7000,7500], season: [7000,7750,8500] },
      { name: "Superior Room with Jacuzzi", slug: "superior-room-with-jacuzzi", off: [7000,7500,8000], season: [7500,8350,9000] },
      { name: "Cottages", slug: "cottages", off: [8000,8500,9000], season: [8500,9350,10000] },
      { name: "Terrace Garden", slug: "terrace-garden", off: [8500,9000,9500], season: [9000,9750,10500] },
      { name: "Luxury Suite Pool Room", slug: "luxury-suite-pool-room", off: [9500,10000,10500], season: [10000,10750,11500] },
      { name: "Vasvana Deluxe Room (16)", slug: "vasvana-deluxe-room", off: [4500,5000,5500], season: [5000,5750,6500] },
      { name: "Vasvana Cottage (8)", slug: "vasvana-cottage", off: [5500,6000,6500], season: [6000,6750,7500] },
    ]
  },
  "jim-corbett/maya-the-forest-resort/": {
    offLabel: "1st July'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 30th June'26",
    headers: ["CP","MAP","AP"],
    seasonMonths: { off: [7,8,9], season: [10,11,12,1,2,3,4,5,6] },
    rows: [
      { name: "Elegent Room", slug: "elegent-room", off: [3300,3800,4300], season: [3800,4300,4800] },
      { name: "Attit Room", slug: "attit-room", off: [3800,4300,4800], season: [4300,4800,5300] },
    ]
  },
  "bhimtal/olive-lake-view/": {
    offLabel: "1st July'26 to Till 15th April'26",
    seasonLabel: "16th April'26 to Till 15th July'26 || 20th Dec'26 to 5th Jan'27",
    headers: ["EP","CP","MAP"],
    // Off: July(7) to 15 Apr(4 mid), Season: 16 Apr-15 July(4-7), 20 Dec-5 Jan(12-1)
    // For month-only logic: season months = [4,5,6,7,12,1] with day check for Apr/Jul/Dec/Jan
    seasonMonths: { off: [2,3,8,9,10,11], season: [4,5,6,7,12,1] },
    rows: [
      { name: "Deluxe Room", slug: "deluxe-room", off: [3500,4000,4500], season: [4500,5000,5500] },
      { name: "Duplex Room 3 Bed", slug: "duplex-room-3-bed", off: [4000,4500,5500], season: [5500,6000,7000] },
      { name: "Family Room 4 Bed", slug: "family-room-4-bed", off: [5000,6000,7000], season: [7000,7800,9000] },
      { name: "Super Deluxe Lake View", slug: "super-deluxe-lake-view", off: [5000,5500,6000], season: [5500,6000,6500] },
    ]
  },
  "mussoorie/wild-spring/": {
    offLabel: "1st July'26 to Till 15th April'26 & 16th July'26 to 20th Dec'26",
    seasonLabel: "16th April'26 to Till 15th July'26 & 21st Dec'26 to 5th Jan'27",
    headers: ["EP","CP","MAP"],
    seasonMonths: { off: [2,3,8,9,10,11], season: [4,5,6,7,12,1] },
    rows: [
      { name: "Elegent Room", slug: "elegent-room", off: [3500,4000,4500], season: [4500,5000,5500] },
      { name: "Attit Room", slug: "attit-room", off: [4000,4500,5000], season: [5000,5500,6000] },
    ]
  },
  "nainital/hotel-cedar-wood/": {
    offLabel: "1st July'26 to 30th March'27",
    seasonLabel: "1st March'26 to 30th June'26",
    headers: ["EP","CP","MAP"],
    seasonMonths: { off: [7,8,9,10,11,12,1,2], season: [3,4,5,6] },
    rows: [
      { name: "Elite Non View - Lower Ground (4)", slug: "elite-non-view", off: [3500,4000,4500], season: [5000,5500,6000] },
      { name: "Elegant Balcony - Ground (5)", slug: "elegant-balcony", off: [4000,4500,5000], season: [5500,6000,6500] },
      { name: "Attic Balcony - First Floor (5)", slug: "attic-balcony", off: [4500,5000,5500], season: [6000,6500,7000] },
      { name: "3BHK Villa (3)", slug: "3bhk-villa", off: [4500,5000,5500], season: [6000,6500,7000] },
      { name: "Premium Suite 1BHK (6)", slug: "premium-suite-1bhk", off: [5500,6000,6500], season: [7000,7500,8000] },
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
      { name: "Executive Room (6)", slug: "executice-room", off: [4500,5000,6000], season: [5000,5500,6500] },
      { name: "Family Room 4P (2)", slug: "family-room", off: [6000,7000,9000], season: [7500,8500,10500] },
    ]
  },
  "ranthambore/sundervan-vilas/": {
    offLabel: "1st April'26 to 30th Sep'26",
    seasonLabel: "1st Oct'26 to 31st March'26",
    headers: ["CP","MAP","AP"],
    seasonMonths: { off: [4,5,6,7,8,9], season: [10,11,12,1,2,3] },
    rows: [
      { name: "Super Deluxe Room", slug: "super-deluxe-room", off: [4500,5500,6500], season: [5500,6500,7500] },
      { name: "Superior Deluxe Room with Balcony", slug: "superior-deluxe-room-with-balcony", off: [5000,6000,7000], season: [6000,7000,8000] },
      { name: "Superior Deluxe Room with Bathub", slug: "superior-deluxe-room-with-bathub", off: [5500,6500,7500], season: [6500,7500,8500] },
    ]
  },
};

// Determine season for a property on a given date
function getSeason(propertyPath, date) {
  const t = TARIFFS[propertyPath];
  if (!t) return "season";
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Special handling for properties with day cutoffs
  if (propertyPath === "bhimtal/olive-lake-view/" || propertyPath === "mussoorie/wild-spring/") {
    // Season if: Apr 16-30, May, Jun, Jul 1-15, Dec 20-31, Jan 1-5
    if (m === 4) return d >= 16 ? "season" : "off";
    if (m === 7) return d <= 15 ? "season" : "off";
    if (m === 12) return d >= 20 ? "season" : "off";
    if (m === 1) return d <= 5 ? "season" : "off";
    if ([5,6].includes(m)) return "season";
    return "off";
  }
  if (propertyPath === "nainital/hotel-cedar-wood/") {
    // Season Mar-Jun, Off Jul-Feb
    if ([3,4,5,6].includes(m)) return "season";
    return "off";
  }
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
    }
  });
  // Update any element with data-current-season
  document.querySelectorAll("[data-season-label]").forEach(function(el){
    const prop = el.getAttribute("data-property");
    const cur = getCurrentSeason(prop);
    el.textContent = cur === "season" ? TARIFFS[prop].seasonLabel : TARIFFS[prop].offLabel;
    el.className = cur === "season" ? "badge-season" : "badge-off";
  });
});
