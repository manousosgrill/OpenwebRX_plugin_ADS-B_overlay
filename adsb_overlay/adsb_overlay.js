// no css for this plugin
Plugins.adsb_overlay.no_css = true;

// Initialize the plugin
Plugins.adsb_overlay.init = async function () {

window.onload = function() {

    const planeIcon = L.icon({
        iconUrl: "/static/plugins/map/adsb_overlay/plane.png",
        iconSize: [22, 22],
        iconAnchor: [16, 16]
    });

    const trailLayerGroup = L.layerGroup().addTo(map); // only trails
    const planeCache = {};  // ICAO -> array of {lat, lon, timestamp}
    const markers = {};
    const closeTimers = {}; // store timers per marker

    function drawTrail(trail) {
        if (!trail || trail.length < 2) return null;

        const now = Date.now() / 1000;
        const segments = [];

        for (let i = 1; i < trail.length; i++) {
            const p1 = trail[i - 1];
            const p2 = trail[i];
            const age = now - p2.timestamp;
            const alpha = Math.max(0.1, 1 - age / 300);

            const seg = L.polyline(
                [[p1.lat, p1.lon], [p2.lat, p2.lon]],
                { color: "red", weight: 2, opacity: alpha }
            );
            segments.push(seg);
        }

        return L.layerGroup(segments);
    }

    async function fetchPlanes() {
        try {
            const res = await fetch("http://xxx:8080/skyaware/data/aircraft.json");
            const data = await res.json();

            trailLayerGroup.clearLayers(); // clear old trails

            const now = Date.now() / 1000;
            const activeIcaos = new Set();

            for (const plane of data.aircraft) {
                if (!plane.lat || !plane.lon) continue;

                const icao = plane.hex;
                activeIcaos.add(icao);

                // --- Update cache ---
                if (!planeCache[icao]) planeCache[icao] = [];
                planeCache[icao].push({ lat: plane.lat, lon: plane.lon, timestamp: now });
                const cutoff = now - 1200;
                planeCache[icao] = planeCache[icao].filter(p => p.timestamp > cutoff);

                // --- Marker ---
                const pos = [plane.lat, plane.lon];
                const info = `
                   <b> Flight: <a href="https://www.flightaware.com/live/flight/${plane.flight || icao}" target="_blank">
                        ${plane.flight || icao}
                    </a></b><br>
                    Altitude: ${plane.alt_baro || 'n/a'} ft<br>
                    Speed: ${plane.gs || 'n/a'} kt<br>
                    Heading: ${plane.track || 0}°
                `;

                if (markers[icao]) {
                    markers[icao].setLatLng(pos);
                    if (typeof markers[icao].setRotationAngle === "function")
                        markers[icao].setRotationAngle(plane.track || 0);
                    markers[icao].setPopupContent(info);
                } else {
                    markers[icao] = L.marker(pos, {
                        icon: planeIcon,
                        rotationAngle: plane.track || 0
                    }).bindPopup(info).addTo(map);

                    // --- Auto-open popup on hover with delayed close ---
                    markers[icao].on("mouseover", function () {
                        if (closeTimers[icao]) {
                            clearTimeout(closeTimers[icao]); // cancel any pending close
                            closeTimers[icao] = null;
                        }
                        this.openPopup();
                    });

                    markers[icao].on("mouseout", function () {
                        closeTimers[icao] = setTimeout(() => {
                            this.closePopup();
                        }, 2000); // delay close by 2s
                    });
                }

                // --- Draw trail ---
                const trail = drawTrail(planeCache[icao]);
                if (trail) trailLayerGroup.addLayer(trail);
            }

            // --- Remove stale aircraft not in current data ---
            for (const icao of Object.keys(markers)) {
                if (!activeIcaos.has(icao)) {
                    map.removeLayer(markers[icao]);
                    delete markers[icao];

                    delete planeCache[icao];

                    if (closeTimers[icao]) {
                        clearTimeout(closeTimers[icao]);
                        delete closeTimers[icao];
                    }
                }
            }

            // --- Update plane count in UI ---
            const planeCountElem = document.getElementById("adsb-plane-count");
            if (planeCountElem) {
                const isChecked = document.getElementById("openwebrx-map-layer-adsb-trails").checked;
                planeCountElem.textContent = isChecked ? `(${activeIcaos.size})` : '';
            }

        } catch (e) {
            console.error("Error fetching aircraft:", e);
        }
    }

    // Checkbox toggle with plane count span
    $('#openwebrx-map-extralayers').append(
        $('<label><input type="checkbox" ' +
            'name="adsb_overlay" ' +
            'idx="6" ' +
            'id="openwebrx-map-layer-adsb-trails" checked>' +
            'ADS-B Reciever <span id="adsb-plane-count">(0)</span></label>')
            .on('change', function (e) {
                if (e.target.checked) {
                    Object.values(markers).forEach(m => map.addLayer(m));
                    map.addLayer(trailLayerGroup);
                } else {
                    Object.values(markers).forEach(m => map.removeLayer(m));
                    map.removeLayer(trailLayerGroup);
                    document.getElementById("adsb-plane-count").textContent = '';
                }
            })
    );

    fetchPlanes();
    setInterval(fetchPlanes, 1000);
};

// return true, to indicate the plugin is loaded correctly
return true;
}
