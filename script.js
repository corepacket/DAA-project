<<<<<<< HEAD
// ==========================================
// GLOBAL VARIABLES
// ==========================================
let map;
let userMarker = null;
let accuracyCircle = null;
let watchId = null;
let currentPath = null;
let routeMarkers = [];

// Safe zones data for Mumbai area
const safeZones = [
  { 
    name: "Sengol Hospital", 
    type: "Hospital", 
    lat: 19.023163570782586, 
    lng: 72.86265244005956, 
    icon: "🏥",
    color: "#e74c3c"
  },
  { 
    name: "Galaxy Multispeciality Hospital", 
    type: "Hospital", 
    lat: 19.023109083290297, 
    lng: 72.86369822441524, 
    icon: "🏥",
    color: "#e74c3c"
  },
  { 
    name: "Diwan Hospital", 
    type: "Hospital", 
    lat: 19.02294410317297, 
    lng: 72.8438225063043,
    icon: "🏥",
    color: "#e74c3c"
  },
  { 
    name: "HVS Symbiosis Hospital", 
    type: "Hospital", 
    lat: 19.021287839137955, 
    lng: 72.84273163483728,
    icon: "🏥",
    color: "#e74c3c"
  },
  { 
    name: "Dadar Fire Station", 
    type: "Fire Station", 
    lat: 19.014774266340766, 
    lng: 72.870195173033,
    icon: "🚒",
    color: "#f39c12"
  },
  { 
    name: "Wadala Fire Station", 
    type: "Fire Station", 
    lat: 19.025309086821892, 
    lng: 72.87128833919559,
    icon: "🚒",
    color: "#f39c12"
  },
  { 
    name: "Regional Command Center", 
    type: "Shelter", 
    lat: 19.025143155540935, 
    lng: 72.870195173033,
    icon: "🏠",
    color: "#3498db"
  }
];

// ==========================================
// INITIALIZATION
// ==========================================
function initMap() {
  // Initialize Leaflet map centered on Mumbai
  map = L.map("map").setView([19.076, 72.8777], 13);

  // Add OpenStreetMap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);

  // Add markers for all safe zones
  addSafeZoneMarkers();

  // Initialize event listeners
  initEventListeners();
}

// ==========================================
// SAFE ZONE MARKERS
// ==========================================
function addSafeZoneMarkers() {
  safeZones.forEach((zone) => {
    const customIcon = L.divIcon({
      html: `<div style="
        background: ${zone.color}; 
        width: 35px; 
        height: 35px; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 3px 8px rgba(0,0,0,0.4); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 18px;
        cursor: pointer;
      ">${zone.icon}</div>`,
      className: '',
      iconSize: [35, 35]
    });

    zone.marker = L.marker([zone.lat, zone.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <b>${zone.name}</b><br>
        <strong>Type:</strong> ${zone.type}<br>
        <strong>Icon:</strong> ${zone.icon}<br>
        <small>Click "Find Shortest Path" to navigate here</small>
      `);
  });
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function initEventListeners() {
  // Use My Location button
  document.getElementById("locate-btn").addEventListener("click", getUserLocation);

  // Find Nearest Safe Zone button
  document.getElementById("nearest-btn").addEventListener("click", findNearestZone);

  // Calculate Shortest Path button
  document.getElementById("path-btn").addEventListener("click", calculateShortestPath);

  // Clear Path button
  document.getElementById("clear-btn").addEventListener("click", clearPath);

  // Manual location button
  document.getElementById("manualBtn").addEventListener("click", setManualLocation);

  // Map click event
  map.on('click', onMapClick);
}

// ==========================================
// LOCATION FUNCTIONS
// ==========================================
function getUserLocation() {
  // Stop any existing watch
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  if (!navigator.geolocation) {
    showAlert("error", "Geolocation is not supported by your browser");
    return;
  }

  updateStatus("🔍 Requesting location...", "updating");

  watchId = navigator.geolocation.watchPosition(
    onLocationSuccess,
    onLocationError,
=======
//hosting - http://localhost:8000

// Initialize the map (centered on Mumbai by default)
const map = L.map("map").setView([19.076, 72.8777], 14);

// Add map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// --- OpenRouteService API Key ---
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdkZjZhMjIwNjRlZTRhNGRiZWM3OWU5YzhiNTU4NmY3IiwiaCI6Im11cm11cjY0In0="; // replace with your actual key

// --- Function to get route using OpenRouteService ---
async function findRoute(start, end) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

  const response = await fetch(url);
  const data = await response.json();

  // Get route coordinates from response
  const routeCoords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
  
  // Draw route on map
  L.polyline(routeCoords, { color: "red", weight: 5 }).addTo(map);
  
  // Fit map to route
  map.fitBounds(L.polyline(routeCoords).getBounds());
}



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
>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }
  );
<<<<<<< HEAD
}

function onLocationSuccess(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const timestamp = new Date(position.timestamp).toLocaleTimeString();

  console.log("Location received:", { lat, lng, accuracy, timestamp });

  updateStatus(`✅ Location found (${timestamp})`);
  updateCoordinates(lat, lng);
  updateAccuracy(accuracy);

  setUserLocation(lat, lng, 'gps', accuracy);
}

function onLocationError(error) {
  console.error("Geolocation error:", error);
  updateStatus(`❌ Error: ${error.message}`);
  
  showAlert(
    "error",
    "Unable to get location. Please:\n• Allow location permission\n• Use HTTPS or localhost\n• Disable VPN\n• Try manual entry"
  );
}

function setManualLocation() {
  const lat = parseFloat(prompt("Enter latitude (e.g., 19.076):"));
  const lng = parseFloat(prompt("Enter longitude (e.g., 72.8777):"));

  if (isNaN(lat) || isNaN(lng)) {
    showAlert("error", "Invalid coordinates entered");
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  setUserLocation(lat, lng, 'manual');
}

function setUserLocation(lat, lng, source = 'gps', accuracy = null) {
  // Remove old markers
  if (userMarker) map.removeLayer(userMarker);
  if (accuracyCircle) map.removeLayer(accuracyCircle);

  // Create user icon
  const userIcon = L.divIcon({
    html: `<div style="
      background: #4CAF50; 
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 4px solid white; 
      box-shadow: 0 0 12px rgba(76,175,80,0.8);
      animation: pulse 2s infinite;
    "></div>`,
    className: '',
    iconSize: [24, 24]
  });

  // Add user marker
  userMarker = L.marker([lat, lng], {
    icon: userIcon,
    draggable: true
  }).addTo(map);

  // Popup content
  const popupContent = `
    <b>📍 Your Location</b><br>
    <strong>Source:</strong> ${source}<br>
    <strong>Latitude:</strong> ${lat.toFixed(6)}<br>
    <strong>Longitude:</strong> ${lng.toFixed(6)}
    ${accuracy ? `<br><strong>Accuracy:</strong> ±${Math.round(accuracy)}m` : ''}
    <br><small>💡 Drag marker to adjust</small>
  `;

  userMarker.bindPopup(popupContent).openPopup();

  // Handle marker drag
  userMarker.on('dragend', (e) => {
    const position = e.target.getLatLng();
    setUserLocation(position.lat, position.lng, 'adjusted');
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      updateStatus("📍 Manually adjusted");
    }
  });

  // Add accuracy circle
  if (accuracy && !isNaN(accuracy)) {
    accuracyCircle = L.circle([lat, lng], {
      radius: accuracy,
      color: '#4CAF50',
      fillColor: '#4CAF50',
      fillOpacity: 0.1,
      weight: 2
    }).addTo(map);
  }

  // Center map
  map.setView([lat, lng], 14);
}

function onMapClick(e) {
  const { lat, lng } = e.latlng;
  
  const confirmed = confirm(
    `Set your location here?\n\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lng.toFixed(6)}`
  );

  if (confirmed) {
=======
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
>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
<<<<<<< HEAD
    setUserLocation(lat, lng, 'map click');
  }
}

// ==========================================
// DISTANCE CALCULATION (Haversine Formula)
// ==========================================
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// ==========================================
// DIJKSTRA'S ALGORITHM
// ==========================================
function dijkstra(graph, start, target) {
  const distances = {};
  const previous = {};
=======
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

// -------------------
// Dijkstra's Algorithm Implementation
// -------------------
function dijkstra(graph, start, target) {
  const distances = {};
  const prev = {};
>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
  const unvisited = new Set(Object.keys(graph));

  // Initialize distances
  for (const node of unvisited) {
    distances[node] = Infinity;
<<<<<<< HEAD
    previous[node] = null;
  }
  distances[start] = 0;

  // Main algorithm loop
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNode = null;
    for (const node of unvisited) {
      if (currentNode === null || distances[node] < distances[currentNode]) {
        currentNode = node;
      }
    }

    // If unreachable, break
    if (distances[currentNode] === Infinity) break;

    unvisited.delete(currentNode);

    // Stop if target reached
    if (currentNode === target) break;

    // Update neighboring nodes
    for (const neighbor in graph[currentNode]) {
      const alternativeDistance = distances[currentNode] + graph[currentNode][neighbor];
      
      if (alternativeDistance < distances[neighbor]) {
        distances[neighbor] = alternativeDistance;
        previous[neighbor] = currentNode;
=======
    prev[node] = null;
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Pick node with smallest tentative distance
    let current = null;
    for (const node of unvisited) {
      if (current === null || distances[node] < distances[current]) {
        current = node;
      }
    }

    if (distances[current] === Infinity) break; // unreachable
    unvisited.delete(current);

    // Stop if we reached target
    if (current === target) break;

    // Update neighboring nodes
    for (const neighbor in graph[current]) {
      const alt = distances[current] + graph[current][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = current;
>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
      }
    }
  }

<<<<<<< HEAD
  // Reconstruct path
  const path = [];
  let current = target;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    distance: distances[target],
    path: path
  };
}

// ==========================================
// GRAPH BUILDER
// ==========================================
function buildGraph(userLat, userLng) {
  const graph = {};
  
  // Add user node
  graph["You"] = {};

  // Connect user to all safe zones
  safeZones.forEach(zone => {
    const distance = getDistanceFromLatLonInKm(userLat, userLng, zone.lat, zone.lng);
    graph["You"][zone.name] = distance;
  });

  // Connect safe zones to each other (within 5km for realistic paths)
  safeZones.forEach((zoneA) => {
    graph[zoneA.name] = {};
    
    safeZones.forEach((zoneB) => {
      if (zoneA.name !== zoneB.name) {
        const distance = getDistanceFromLatLonInKm(
          zoneA.lat, zoneA.lng, 
          zoneB.lat, zoneB.lng
        );
        
        // Only connect if within 5km
        if (distance < 5) {
          graph[zoneA.name][zoneB.name] = distance;
=======
  // Reconstruct shortest path
  const path = [];
  let u = target;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  return { distance: distances[target], path };
}

// -------------------
// Build graph dynamically (connect nearby zones + user)
// -------------------
function buildGraph(userLat, userLng) {
  const graph = {};

  // Add user node
  graph["You"] = {};

  // Add connections between user and each safe zone
  safeZones.forEach(zone => {
    const dist = getDistanceFromLatLonInKm(userLat, userLng, zone.lat, zone.lng);
    graph["You"][zone.name] = dist;
  });

  // Connect safe zones to each other (optional: only if close)
  safeZones.forEach((zoneA) => {
    graph[zoneA.name] = {};
    safeZones.forEach((zoneB) => {
      if (zoneA.name !== zoneB.name) {
        const dist = getDistanceFromLatLonInKm(zoneA.lat, zoneA.lng, zoneB.lat, zoneB.lng);
        if (dist < 2.5) { // connect if less than 2.5 km apart
          graph[zoneA.name][zoneB.name] = dist;
>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
        }
      }
    });
  });

  return graph;
}

<<<<<<< HEAD
// ==========================================
// FIND NEAREST SAFE ZONE
// ==========================================
function findNearestZone() {
  if (!userMarker) {
    showAlert("warning", "Please set your location first!");
    return;
  }

  const userPosition = userMarker.getLatLng();
  let nearestZone = null;
  let minDistance = Infinity;

  // Find nearest zone
  safeZones.forEach(zone => {
    const distance = getDistanceFromLatLonInKm(
      userPosition.lat, userPosition.lng,
      zone.lat, zone.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestZone = zone;
    }
  });

  if (!nearestZone) {
    showAlert("error", "No safe zones found!");
    return;
  }

  // Clear previous path
  clearPath();

  // Draw path to nearest zone
  currentPath = L.polyline([
    [userPosition.lat, userPosition.lng],
    [nearestZone.lat, nearestZone.lng]
  ], {
    color: "#2ecc71",
    weight: 6,
    opacity: 0.8,
    dashArray: '10, 10'
  }).addTo(map);

  // Fit bounds
  map.fitBounds(currentPath.getBounds(), { padding: [60, 60] });

  // Open popup
  nearestZone.marker.openPopup();

  // Calculate walking time (average 5 km/h)
  const walkingTimeMinutes = Math.ceil((minDistance / 5) * 60);

  // Show alert
  showAlert(
    "success",
    `✅ Nearest Safe Zone Found!\n\n` +
    `📍 ${nearestZone.name}\n` +
    `${nearestZone.icon} Type: ${nearestZone.type}\n` +
    `📏 Distance: ${(minDistance * 1000).toFixed(0)} meters\n` +
    `⏱️ Est. walking time: ${walkingTimeMinutes} minutes`
  );
}

// ==========================================
// CALCULATE SHORTEST PATH
// ==========================================
function calculateShortestPath() {
  if (!userMarker) {
    showAlert("warning", "Please set your location first!");
    return;
  }

  const userPosition = userMarker.getLatLng();
  const graph = buildGraph(userPosition.lat, userPosition.lng);

  // Create zone list for prompt
  const zoneList = safeZones
    .map((zone, index) => `${index + 1}. ${zone.name} (${zone.type})`)
    .join("\n");

  const targetName = prompt(
    `🎯 Enter the name of your destination:\n\n${zoneList}\n\nType the full name:`
  );

  if (!targetName) return;

  // Find selected zone
  const selectedZone = safeZones.find(
    zone => zone.name.toLowerCase() === targetName.toLowerCase()
  );

  if (!selectedZone || !graph[selectedZone.name]) {
    showAlert("error", "Invalid safe zone name! Please enter the exact name.");
    return;
  }

  // Run Dijkstra's algorithm
  const result = dijkstra(graph, "You", selectedZone.name);

  if (!result.path || result.path.length === 0 || result.distance === Infinity) {
    showAlert("error", "No path found to this destination!");
    return;
  }

  // Clear previous path
  clearPath();

  // Build path coordinates
  const pathCoords = [];
  result.path.forEach(nodeName => {
    if (nodeName === "You") {
      pathCoords.push([userPosition.lat, userPosition.lng]);
    } else {
      const zone = safeZones.find(z => z.name === nodeName);
      if (zone) {
        pathCoords.push([zone.lat, zone.lng]);
      }
    }
  });

  // Draw path
  currentPath = L.polyline(pathCoords, {
    color: "#2ecc71",
    weight: 6,
    opacity: 0.9
  }).addTo(map);

  // Add directional arrows
  addDirectionalArrows(pathCoords);

  // Fit bounds
  map.fitBounds(currentPath.getBounds(), { padding: [60, 60] });

  // Calculate metrics
  const distanceKm = result.distance;
  const distanceMeters = (distanceKm * 1000).toFixed(0);
  const walkingTimeMinutes = Math.ceil((distanceKm / 5) * 60);
  const pathString = result.path.join(" ➜ ");

  // Show result
  showAlert(
    "success",
    `✅ Shortest Path Calculated!\n\n` +
    `🛣️ Route: ${pathString}\n\n` +
    `📏 Total Distance: ${distanceMeters} meters (${distanceKm.toFixed(2)} km)\n` +
    `⏱️ Est. walking time: ${walkingTimeMinutes} minutes\n\n` +
    `🚶 Follow the green path on the map!`
  );
}

// ==========================================
// ADD DIRECTIONAL ARROWS ON PATH
// ==========================================
function addDirectionalArrows(pathCoords) {
  for (let i = 0; i < pathCoords.length - 1; i++) {
    const midLat = (pathCoords[i][0] + pathCoords[i + 1][0]) / 2;
    const midLng = (pathCoords[i][1] + pathCoords[i + 1][1]) / 2;

    const arrowMarker = L.marker([midLat, midLng], {
      icon: L.divIcon({
        html: '<div style="color: #2ecc71; font-size: 28px; text-shadow: 0 0 4px white;">➜</div>',
        className: '',
        iconSize: [28, 28]
      })
    }).addTo(map);

    routeMarkers.push(arrowMarker);
  }
}

// ==========================================
// CLEAR PATH
// ==========================================
function clearPath() {
  if (currentPath) {
    map.removeLayer(currentPath);
    currentPath = null;
  }

  routeMarkers.forEach(marker => map.removeLayer(marker));
  routeMarkers = [];
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================
function updateStatus(text, className = "") {
  const statusElement = document.getElementById("locStatus");
  const statusText = statusElement.querySelector('.status-text') || statusElement;
  
  if (statusElement.querySelector('strong')) {
    statusText.textContent = text.replace('Status: ', '');
  } else {
    statusElement.innerHTML = `<strong>Status:</strong> <span class="status-text">${text}</span>`;
  }
  
  statusElement.className = `status-item ${className}`;
}

function updateCoordinates(lat, lng) {
  document.getElementById("locCoords").innerHTML = 
    `<strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function updateAccuracy(accuracy) {
  document.getElementById("locAccuracy").innerHTML = 
    `<strong>Accuracy:</strong> ±${Math.round(accuracy)} meters`;
}

function showAlert(type, message) {
  alert(message);
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", initMap);
=======
// -------------------
// Find shortest path button handler
// -------------------
document.getElementById("path-btn").addEventListener("click", () => {
  if (!userMarker) {
    alert("Set your current location first!");
    return;
  }

  const userLatLng = userMarker.getLatLng();
  const graph = buildGraph(userLatLng.lat, userLatLng.lng);

  // Ask user which safe zone they want to go to
  const zoneNames = safeZones.map(z => z.name).join("\n");
  const target = prompt(`Enter target safe zone name:\n${zoneNames}`);

  if (!target || !graph[target]) {
    alert("Invalid safe zone name!");
    return;
  }

  const result = dijkstra(graph, "You", target);
  if (!result.path || result.path.length === 0) {
    alert("No path found!");
    return;
  }

  // Draw path on map
  const pathCoords = [];
  result.path.forEach(name => {
    if (name === "You") {
      pathCoords.push([userLatLng.lat, userLatLng.lng]);
    } else {
      const zone = safeZones.find(z => z.name === name);
      if (zone) pathCoords.push([zone.lat, zone.lng]);
    }
  });

  L.polyline(pathCoords, { color: "blue", weight: 5 }).addTo(map);
  alert(`Shortest path: ${result.path.join(" → ")}\nTotal distance: ${result.distance.toFixed(2)} km`);
});
// --- Find shortest path button ---
document.getElementById("path-btn").addEventListener("click", () => {
  if (!userMarker) {
    alert("Please click 'Use My Location' first!");
    return;
  }

  // You can change which safe zone to target (for now we’ll use the first one)
  const start = userMarker.getLatLng();
  const end = safeZones[0].getLatLng(); 

  findRoute([start.lat, start.lng], [end.lat, end.lng]);
});


>>>>>>> ddf5141059e7e24d40f284890ae23ee75e4005d2
