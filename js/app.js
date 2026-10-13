const days = [
  { id: "01", title: "Мосты, Русский и океанариум", lat: 43.024, lng: 131.894, href: "day-01.html", text: "Золотой и Русский мосты, кампус ДВФУ, Приморский океанариум, ужин в Zuma." },
  { id: "02", title: "Исторический центр", lat: 43.116, lng: 131.886, href: "day-02.html", text: "Светланская, арка цесаревича, вокзал 9288, С-56 и маяк Токаревского." },
  { id: "03", title: "Остров Попова", lat: 42.963, lng: 131.73, href: "day-03.html", text: "Выход в море на яхте и ужин в BENUAR на Корабельной." },
  { id: "04", title: "Форты острова Русский", lat: 42.972, lng: 131.91, href: "day-04.html", text: "Новосильцевская батарея, форт Поспелова и мыс Тобизина." },
  { id: "05", title: "Рикорда, Желтухина и Мариинский", lat: 42.868, lng: 131.63, href: "day-05.html", text: "Вторая яхта и вечерний спектакль Приморской сцены." },
  { id: "06", title: "Хасанский район", lat: 42.553, lng: 131.212, href: "day-06.html", text: "Южная граница: полуостров Гамова, Витязь и Хасан." },
  { id: "07", title: "Земля леопарда", lat: 43.185, lng: 131.49, href: "day-07.html", text: "Национальный парк и водопад Неожиданный." },
  { id: "08", title: "Приморский сафари-парк", lat: 43.321, lng: 132.354, href: "day-08.html", text: "Тигры, медведи и леопарды в Шкотовском районе." },
  { id: "09", title: "Бухта Триозёрье", lat: 42.747, lng: 133.227, href: "day-09.html", text: "День без программы: песок, три озера и Японское море." },
  { id: "10", title: "Tigre de Cristal", lat: 43.302, lng: 132.313, href: "day-10.html", text: "Игорная зона «Приморье» на бухте Муравьиной." },
];

const burger = document.getElementById("burger");
const overlay = document.getElementById("overlay");

function setMenu(open) {
  if (!overlay || !burger) return;
  overlay.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  document.body.classList.toggle("menu-open", open);
}

burger?.addEventListener("click", () => setMenu(!overlay.classList.contains("open")));
overlay?.querySelectorAll("a").forEach((a, i) => {
  a.style.animationDelay = `${0.04 + i * 0.04}s`;
  a.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

const mapEl = document.getElementById("map");
if (mapEl && window.L) {
  const map = L.map("map", { scrollWheelZoom: false }).setView([43.1, 132.1], 8);
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Снимки &copy; Esri, Maxar", maxZoom: 18 }
  ).addTo(map);

  const icon = L.divIcon({
    className: "",
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#c4a35a;border:2px solid #fff;box-shadow:0 1px 8px rgba(0,0,0,.55)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const markers = {};
  days.forEach((d) => {
    const m = L.marker([d.lat, d.lng], { icon }).addTo(map);
    m.bindPopup(
      `<strong>День ${d.id}</strong><span>${d.title}</span><br><a href="${d.href}">Открыть описание</a>`
    );
    markers[d.id] = m;
  });

  L.polyline(days.map((d) => [d.lat, d.lng]), {
    color: "#e4cf96",
    weight: 2,
    opacity: 0.9,
  }).addTo(map);

  map.fitBounds(L.latLngBounds(days.map((d) => [d.lat, d.lng])), { padding: [36, 36] });

  function focus(id, zoom) {
    const d = days.find((x) => x.id === id);
    if (!d) return;
    map.flyTo([d.lat, d.lng], zoom || 11, { duration: 0.7 });
    markers[id].openPopup();
    document.querySelectorAll(".day-link").forEach((el) => {
      el.classList.toggle("is-on", el.dataset.id === id);
    });
  }

  document.querySelectorAll(".day-link").forEach((el) => {
    el.addEventListener("mouseenter", () => focus(el.dataset.id, el.dataset.id === "09" || el.dataset.id === "06" ? 9 : 11));
  });

  setTimeout(() => map.invalidateSize(), 250);
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
