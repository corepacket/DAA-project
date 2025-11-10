// -------------------
// script.js (replace whole file)
// -------------------

// Initialize the map (centered on Mumbai by default)
const map = L.map("map").setView([19.076, 72.8777], 14);

// Add map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// -------------------
// Safe zones (your data)
// -------------------
const safeZones = [
  { name: "Sengol Hospital", type: "Hospital", lat: 19.023163570782586, lng: 72.86265244005956},
  { name: "Galaxy Multispeciality Hospital", type: "Hospital", lat: 19.023109083290297, lng: 72.86369822441524},
  { name: "Diwan Hospital", type: "Hospital", lat: 19.02294410317297, lng: 72.8438225063043 },
  { name: "HVS symbiosis Hospital", type: "Hospital", lat: 19.021287839137955, lng: 72.84273163483728 },
  { name: "Dadar Fire Station", type: "Fire Station", lat: 19.014774266340766, lng:  72.870195173033 },
  { name: "Wadala Fire Station", type: "Fire Station", lat: 19.025309086821892, lng:  72.87128833919559},
  { name: "Regional Command Center", type: "Shelter", lat:19.025143155540935, lng: 72.870195173033 },
];

// Add markers for all safe zones and keep reference to each marker
safeZones.forEach((zone) => {
  zone.marker = L.marker([zone.lat, zone.lng])
    .addTo(map)
    .bindPopup(`<b>${zone.name}</b><br>Type: ${zone.type}`);
});

// -------------------
// Diagnostic & robust location helper (added here)
// -------------------
let userMarker = null;
let accuracyCircle = null;
let watchId = null;

// Add a small control to show location status, coords and a manual set button
const info = L.control({position: 'topright'});
info.onAdd = function(map){
  const div = L.DomUtil.create('div', 'loc-info');
  div.style.padding = '6px';
  div.style.background = 'rgba(255,255,255,0.95)';
  div.style.borderRadius = '6px';
  div.style.fontSize = '13px';
  div.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';
  div.innerHTML = `<div id="locStatus">No location</div>
                   <div id="locCoords"></div>
                   <div id="locAccuracy"></div>
                   <div style="margin-top:6px;">
                     <button id="manualBtn" style="padding:6px 8px; font-size:12px; cursor:pointer;">Set location manually</button>
                   </div>`;
  return div;
};
info.addTo(map);

// manual set button handler (in the control)
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'manualBtn') {
    const lat = parseFloat(prompt("Enter latitude (e.g. 19.07):"));
    const lng = parseFloat(prompt("Enter longitude (e.g. 72.87):"));
    if (!isNaN(lat) && !isNaN(lng)) {
      // stop any active watch
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      setUserLocation(lat, lng, 'manual');
    } else {
      alert("Invalid coordinates entered.");
    }
  }
});

// -------------------
// Locate button handler (replaces previous getCurrentPosition code)
// - Uses watchPosition for better fixes
// - Shows accuracy and updates control info
// -------------------
document.getElementById("locate-btn").addEventListener("click", () => {
  // clear previous watch if present
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    document.getElementById('locStatus').innerText = 'Stopped previous watch.';
  }

  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  document.getElementById('locStatus').innerText = 'Requesting location...';

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy; // meters
      const ts = new Date(pos.timestamp).toLocaleTimeString();

      console.log("GEOPOSITION:", {lat, lng, acc, timestamp: pos.timestamp});
      document.getElementById('locStatus').innerText = `Location received (${ts})`;
      document.getElementById('locCoords').innerText = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      document.getElementById('locAccuracy').innerText = `Accuracy: ${Math.round(acc)} m`;

      setUserLocation(lat, lng, 'gps', acc);
    },
    (err) => {
      console.error("Geolocation error", err);
      document.getElementById('locStatus').innerText = `Error: ${err.message}`;
      alert("Unable to get precise location. Try: allow location permission, use phone, disable VPN, and serve via HTTPS or localhost.");
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }
  );
});

// -------------------
// setUserLocation: draw marker & accuracy circle, allow drag to correct
// -------------------
function setUserLocation(lat, lng, source='gps', accuracy=null) {
  // remove old marker/circle
  if (userMarker) map.removeLayer(userMarker);
  if (accuracyCircle) map.removeLayer(accuracyCircle);

  userMarker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [30, 30],
    }),
    draggable: true
  }).addTo(map);

  // update marker popup and open it
  const popupText = `📍 You (${source})<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}${accuracy ? `<br>accuracy: ${Math.round(accuracy)} m` : ''}<br><small>Drag marker to correct</small>`;
  userMarker.bindPopup(popupText).openPopup();

  // when user drags marker to correct location
  userMarker.on('dragend', (e) => {
    const p = e.target.getLatLng();
    setUserLocation(p.lat, p.lng, 'drag');
    // stop watching because user manually corrected
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      document.getElementById('locStatus').innerText = 'Manual correction (watch stopped).';
    }
  });

  if (accuracy && !isNaN(accuracy)) {
    accuracyCircle = L.circle([lat, lng], {
      radius: accuracy,
      color: '#1a73e8',
      fillColor: '#1a73e8',
      fillOpacity: 0.08
    }).addTo(map);
  }

  // center map gently
  map.setView([lat, lng], 14);

  // show nearby safe zones (radius in km; change 3 to preferred)
  findNearbySafeZones(lat, lng, 1);
}

// -------------------
// allow clicking the map to set location (manual correction)
// -------------------
map.on('click', function(e) {
  const {lat, lng} = e.latlng;
  if (confirm(`Set your location to\nLat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}?`)) {
    // stop watch if present
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    setUserLocation(lat, lng, 'click');
  }
});

// -------------------
// Find nearby safe zones (radius parameter in km)
// - draws circle markers for nearby zones and opens popups
// -------------------
function findNearbySafeZones(userLat, userLng, radiusKm = 1) {
  // remove any previous green circles (simple approach: redraw all zone markers)
  safeZones.forEach(zone => {
    // ensure popup exists; remove any old circle overlay if present (we didn't keep references)
    // For simplicity, we'll just add new circles each time. In a fuller app you'd track and remove them.
  });

  const nearby = safeZones.filter((zone) => {
    const distance = getDistanceFromLatLonInKm(
      userLat,
      userLng,
      zone.lat,
      zone.lng
    );
    return distance <= radiusKm;
  });

  if (nearby.length === 0) {
    alert(`❌ No safe zones found within ${radiusKm} km!`);
  } else {
    nearby.forEach((zone) => {
      L.circle([zone.lat, zone.lng], {
        color: "green",
        fillColor: "#2ecc71",
        fillOpacity: 0.25,
        radius: 200, // 200 meters marker circle to highlight
      }).addTo(map);
      // open popup with distance info
      const dist = getDistanceFromLatLonInKm(userLat, userLng, zone.lat, zone.lng);
      zone.marker.bindPopup(`<b>${zone.name}</b><br>Type: ${zone.type}<br>${Math.round(dist*1000)} m away`).openPopup();
    });
    alert(`✅ Found ${nearby.length} safe zones within ${radiusKm} km!`);
  }
}

// -------------------
// Haversine distance function (returns km)
// -------------------
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

