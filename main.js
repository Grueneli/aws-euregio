/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 11);

// thematische Layer
let themaLayer = {
    stations: L.featureGroup()
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://lawinen.report">CC BY avalanche.report</a>`
    }).addTo(map),
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Wetterstationen": themaLayer.stations.addTo(map)
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Wetterstationen Tirol
async function showStations(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng){
            console.log(feature.geometry.coordinates)
            return L.marker (latlng, {
                icon: L.icon({
                    iconUrl: "icons/icons.png",
                    iconSize: [32,37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                }),
            });
        },
        onEachFeature: function(feature,layer) {
            let prop = feature.properties;
            let array = feature.geometry.coordinates
            layer.bindPopup (`
            <h4> ${prop.name}, ${array[2]} m ü. NN </h4>
            Lufttemperatur in °C: ${prop.LT|| "nicht angegeben"}<br>
            Relative Luftfeuchte in %: ${prop.RH || "nicht angegeben"} <br>
            Windgeschwindigkeit in km/h: ${(prop.WG*3.6).toFixed(1)|| "nicht angegeben"} <br> //auf eine nachkomma stelle gerundet
            Schneehöhe in cm: ${prop.HS || "nicht angegeben"} 
            `);
        }
        //if (prop.WG) {return (prop.WG *3.6).toFixed(1);}else {return "-";} /toFixed: ich will nur eine Nachkomma stelle
        

       
    }).addTo(themaLayer.stations)
  

    // Wetterstationen mit Icons und Popups implementieren

}
showStations("https://static.avalanche.report/weather_stations/stations.geojson");
