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
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }
  );
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
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
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
  const unvisited = new Set(Object.keys(graph));

  // Initialize distances
  for (const node of unvisited) {
    distances[node] = Infinity;
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
      }
    }
  }

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
        }
      }
    });
  });

  return graph;
}

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