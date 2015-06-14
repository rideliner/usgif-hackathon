
var airportsJSONPath = './airports.json'

var numberOfAirports = new Map();

$.getJSON(airportsJSONPath,function(data) {
	L.geoJson(data,{onEachFeature : function(feature, layer) {
		layer.bindPopup(feature.properties.name);
		if (numberOfAirports.get(feature.properties.country) === undefined) {
			numberOfAirports.set(feature.properties.country,1);
		} else {
			numberOfAirports.set(feature.properties.country,numberOfAirports.get(feature.properties.country) + 1);
		}
	} }).addTo(airports);
})
