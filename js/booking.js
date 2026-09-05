// Booking logic - dynamic pricing, season detection, localStorage admin
const PROPERTY_NAMES = {
  "jim-corbett/hill-turn-corbett-resort/": "Hill Turn Corbett Resort, Ramnagar (Jim Corbett) - 4★",
  "jim-corbett/whispering-oaks-corbett/": "The Whispering Oaks Corbett, Dhikuli - 3★",
  "jim-corbett/corbett-leela-vilas/": "Corbett Leela Vilas Resort, Dhikuli - 3★",
  "jim-corbett/onyxx-nature-resort/": "Onyxx Nature Resort, Choi - 4★",
  "jim-corbett/corbett-prakarm-resort/": "Corbett Prakarm Resort, Sawaldey - 3★",
  "jim-corbett/maulik-mansion-resort/": "Maulik Mansion Resort, Dhikuli - 4★",
  "jim-corbett/maya-the-forest-resort/": "Maya The Forest Resort, Sawaldey - 3★",
  "nainital/hotel-cedar-wood/": "Hotel Cedar Wood, Nainital - 3★",
  "bhimtal/olive-lake-view/": "Olive Lake View, Bhimtal - 3★",
  "mussoorie/wild-spring/": "Wild Spring, Mussoorie - 3★",
  "haridwar/abhyudyam-ganga/": "The Abhyudyam Ganga, Haridwar - 3★",
  "ranthambore/sundervan-vilas/": "Sundervan Vilas Ranthambore - 3★",
};

function qs(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.addEventListener("DOMContentLoaded", function() {
  const propSel = document.getElementById("property");
  const roomSel = document.getElementById("room");
  const mealSel = document.getElementById("mealPlan");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");
  const rooms = document.getElementById("rooms");
  const form = document.getElementById("bookingForm");

  // Populate properties
  Object.keys(TARIFFS).forEach(path => {
    const opt = document.createElement("option");
    opt.value = path;
    opt.textContent = PROPERTY_NAMES[path] || path;
    propSel.appendChild(opt);
  });

  // Prefill from query
  const qProp = qs("property");
  const qRoom = qs("room");
  if (qProp && TARIFFS[qProp]) {
    propSel.value = qProp;
  } else if (!propSel.value) {
    propSel.selectedIndex = 0;
  }

  function populateRooms() {
    const path = propSel.value;
    const t = TARIFFS[path];
    if (!t) return;
    roomSel.innerHTML = "";
    t.rows.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.slug;
      opt.textContent = r.name;
      roomSel.appendChild(opt);
    });
    if (qRoom) {
      const found = Array.from(roomSel.options).find(o => o.value === qRoom);
      if (found) roomSel.value = qRoom;
    }
    populateMealPlans();
  }

  function populateMealPlans() {
    const path = propSel.value;
    const t = TARIFFS[path];
    if (!t) return;
    mealSel.innerHTML = "";
    t.headers.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h + (h==="EP"?" (Room Only)":h==="CP"?" (Breakfast)":h==="MAP"?" (Breakfast+Dinner)":" (All Meals)");
      mealSel.appendChild(opt);
    });
    // default to CP if available
    if (t.headers.includes("CP")) mealSel.value = "CP";
    updatePrice();
  }

  function getNights() {
    if (!checkin.value || !checkout.value) return 1;
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);
    const diff = (d2 - d1) / (1000*60*60*24);
    return diff > 0 ? Math.ceil(diff) : 1;
  }

  function updatePrice() {
    const path = propSel.value;
    const room = roomSel.value;
    const plan = mealSel.value;
    if (!path || !room || !plan) return;
    const t = TARIFFS[path];
    // Determine date for season: use checkin if set, else today
    let date = new Date();
    if (checkin.value) {
      const d = new Date(checkin.value);
      if (!isNaN(d)) date = d;
    }
    const price = getPrice(path, room, plan, date);
    const season = getSeason(path, date);
    const nights = getNights();
    const roomCount = parseInt(rooms.value) || 1;
    const adultCount = parseInt(adults.value) || 2;
    const childCount = parseInt(children.value) || 0;

    // Calculate extras
    const extraAdults = Math.max(0, adultCount - 2 * roomCount);
    const baseTotal = price ? price * nights * roomCount : 0;
    const childTotal = price ? Math.round(price * 0.25 * childCount * nights) : 0;
    const adultTotal = price ? Math.round(price * 0.35 * extraAdults * nights) : 0;
    const total = baseTotal + childTotal + adultTotal;

    // Update UI
    document.getElementById("summaryProperty").textContent = PROPERTY_NAMES[path] || path;
    const roomName = t.rows.find(r=>r.slug===room)?.name || room;
    document.getElementById("summaryRoom").textContent = roomName + " • " + plan;
    document.getElementById("basePrice").textContent = price ? formatPrice(price) + " × " + nights + "n × " + roomCount + "r" : "—";
    document.getElementById("nightsCount").textContent = nights + " night" + (nights>1?"s":"");
    document.getElementById("roomNights").textContent = roomCount + " × " + nights + " = " + (roomCount*nights);
    document.getElementById("childPrice").textContent = childCount ? formatPrice(childTotal) + " (" + childCount + " × 25%)" : "₹0";
    document.getElementById("adultPrice").textContent = extraAdults ? formatPrice(adultTotal) + " (" + extraAdults + " × 35%)" : "₹0";
    document.getElementById("totalPrice").textContent = price ? formatPrice(total) : "—";
    document.getElementById("submitPrice").textContent = price ? formatPrice(total) : "Select Dates";
    document.getElementById("planLabel").textContent = plan;
    const badge = document.getElementById("seasonBadge");
    if (badge) {
      badge.textContent = season === "season" ? "Season" : "Off-Season";
      badge.className = season === "season" ? "badge-season" : "badge-off";
    }
    document.getElementById("seasonLabel").textContent = season === "season" ? "Season" : "Off-Season";
    document.getElementById("seasonDates").textContent = season === "season" ? t.seasonLabel : t.offLabel;

    // Store for submit
    form.dataset.basePrice = price || 0;
    form.dataset.totalPrice = total || 0;
    form.dataset.season = season;
    form.dataset.nights = nights;
    form.dataset.plan = plan;
  }

  // Set default dates: tomorrow and day after
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const after = new Date(); after.setDate(after.getDate()+2);
  checkin.valueAsDate = tomorrow;
  checkout.valueAsDate = after;
  checkin.min = new Date().toISOString().split('T')[0];

  propSel.addEventListener("change", () => { populateRooms(); });
  roomSel.addEventListener("change", updatePrice);
  mealSel.addEventListener("change", updatePrice);
  checkin.addEventListener("change", () => { 
    if (checkout.value && new Date(checkout.value) <= new Date(checkin.value)) {
      const d = new Date(checkin.value); d.setDate(d.getDate()+1);
      checkout.valueAsDate = d;
    }
    checkout.min = checkin.value;
    updatePrice(); 
  });
  checkout.addEventListener("change", updatePrice);
  adults.addEventListener("change", updatePrice);
  children.addEventListener("change", updatePrice);
  rooms.addEventListener("change", updatePrice);

  // Initial populate
  populateRooms();

  // Form submit
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const path = propSel.value;
    const room = roomSel.value;
    const t = TARIFFS[path];
    const roomName = t.rows.find(r=>r.slug===room)?.name || room;
    const plan = mealSel.value;
    const basePrice = parseInt(form.dataset.basePrice) || 0;
    const totalPrice = parseInt(form.dataset.totalPrice) || 0;
    const nights = parseInt(form.dataset.nights) || 1;
    const season = form.dataset.season || getCurrentSeason(path);
    const booking = {
      id: "JY" + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      property: path,
      propertyName: PROPERTY_NAMES[path],
      room: room,
      roomName: roomName,
      mealPlan: plan,
      checkin: checkin.value,
      checkout: checkout.value,
      nights: nights,
      rooms: parseInt(rooms.value),
      adults: parseInt(adults.value),
      children: parseInt(children.value),
      guestName: document.getElementById("guestName").value.trim(),
      guestPhone: document.getElementById("guestPhone").value.trim(),
      guestEmail: document.getElementById("guestEmail").value.trim(),
      requests: document.getElementById("requests").value.trim(),
      basePrice: basePrice,
      totalPrice: totalPrice,
      season: season,
      seasonLabel: season==="season"?t.seasonLabel:t.offLabel,
      extraAdultRate: "35%",
      extraChildRate: "25%",
    };

    // Validation
    if (!booking.guestName || !booking.guestPhone || !booking.guestEmail) {
      alert("Please fill name, phone and email.");
      return;
    }

    // Save to localStorage (admin panel)
    const existing = JSON.parse(localStorage.getItem("jy_bookings") || "[]");
    existing.unshift(booking);
    localStorage.setItem("jy_bookings", JSON.stringify(existing));

    // Send via FormSubmit (free) - also mailto fallback
    // Use FormSubmit AJAX
    const formData = new FormData();
    formData.append("_subject", `New Booking: ${booking.propertyName} - ${booking.roomName} - ${booking.id}`);
    formData.append("Booking ID", booking.id);
    formData.append("Property", booking.propertyName + " (" + booking.property + ")");
    formData.append("Room", booking.roomName + " (" + booking.room + ")");
    formData.append("Meal Plan", booking.mealPlan);
    formData.append("Season", booking.season + " - " + booking.seasonLabel);
    formData.append("Check-in", booking.checkin);
    formData.append("Check-out", booking.checkout);
    formData.append("Nights", booking.nights);
    formData.append("Rooms", booking.rooms);
    formData.append("Adults", booking.adults);
    formData.append("Children (6-12)", booking.children);
    formData.append("Extra Adult 35% per night", "₹" + Math.round(basePrice*0.35));
    formData.append("Extra Child 25% per night", "₹" + Math.round(basePrice*0.25));
    formData.append("Base Price/night", "₹" + basePrice);
    formData.append("Total Price", "₹" + totalPrice);
    formData.append("Guest Name", booking.guestName);
    formData.append("Guest Phone", booking.guestPhone);
    formData.append("Guest Email", booking.guestEmail);
    formData.append("Requests", booking.requests);
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    // Try FormSubmit
    fetch("https://formsubmit.co/ajax/bookings@jeewayatrahotels.com", {
      method: "POST",
      body: formData
    }).then(r=>r.json()).then(data=>{
      console.log("FormSubmit", data);
    }).catch(err=>{
      console.log("FormSubmit error, fallback to mailto", err);
    }).finally(()=>{
      // Also open mailto as backup
      const subject = encodeURIComponent(`Booking ${booking.id} - ${booking.roomName} at ${booking.propertyName}`);
      const body = encodeURIComponent(
        `Booking ID: ${booking.id}\n`+
        `Property: ${booking.propertyName}\n`+
        `Room: ${booking.roomName} (${booking.room})\n`+
        `Meal Plan: ${booking.mealPlan}\n`+
        `Season: ${booking.season} (${booking.seasonLabel})\n`+
        `Check-in: ${booking.checkin}\n`+
        `Check-out: ${booking.checkout} (${booking.nights} nights)\n`+
        `Rooms: ${booking.rooms}\n`+
        `Adults: ${booking.adults} (Extra: ${Math.max(0, booking.adults-2*booking.rooms)} × 35% = ₹${Math.round(basePrice*0.35* Math.max(0, booking.adults-2*booking.rooms)*booking.nights)})\n`+
        `Children: ${booking.children} × 25% = ₹${Math.round(basePrice*0.25*booking.children*booking.nights)}\n`+
        `Base: ₹${basePrice} × ${booking.nights} × ${booking.rooms} = ₹${basePrice*booking.nights*booking.rooms}\n`+
        `Total: ₹${booking.totalPrice}\n`+
        `Guest: ${booking.guestName}, ${booking.guestPhone}, ${booking.guestEmail}\n`+
        `Requests: ${booking.requests}\n`
      );
      // Save booking id for thank you page
      sessionStorage.setItem("lastBooking", JSON.stringify(booking));
      // Redirect to thank-you with booking id
      window.location.href = "thank-you.html?booking=" + booking.id;
    });
  });
});
