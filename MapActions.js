/**
 * Code inspired by Leaflet's tutorials. Some code fragments can be found at:
 * http://leafletjs.com/examples/choropleth.html.
 */
var geoJSONPath = './geography.json'
var airportsJSONPath = './airports.json'



function getWaterColor(d) {
	return d > 90 ? '#fff5eb' : d > 85 ? '#fee6ce' : d > 80 ? '#fdd0a2'
			: d > 75 ? '#fdae6b' : d > 70 ? '#fd8d3c' : d > 65 ? '#f16913'
					: d > 60 ? '#d94801' : d > 55 ? '#a63603' : '#7f2704';
}

function getSanitationColor(d) {
	return d > 25 ? '#feebe2' : d > 20 ? '#fcc5c0' : d > 15 ? '#fa9fb5'
			: d > 10 ? '#f768a1' : d > 5 ? '#c51b8a' : '#7a0177';
}

var defaultStyle = {
	fillColor : 'white',
	weight : 2,
	opacity : 1,
	color : 'black',
	dashArray : '3',
	fillOpacity : 0
}

var waterStyle = function(feature) {
	return {
		fillColor : getWaterColor(feature.properties.PERCENT_ACCESS_TO_CLEAN_WATER),
		weight : 2,
		opacity : 1,
		color : 'white',
		dashArray : '3',
		fillOpacity : 0.7
	}
}

var sanitationStyle = function(feature) {
	return {
		fillColor : getSanitationColor(feature.properties.PERCENT_ACCESS_TO_SANITATION),
		weight : 2,
		opacity : 1,
		color : 'white',
		dashArray : '3',
		fillOpacity : 0.7
	}
}

var highlightStyle = {
	weight : 5,
	color : 'black',
	dashArray : '',
	fillOpacity : 0.7
}

var info = L.control({
	position: 'topleft'
});

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
}

var airports = new L.LayerGroup();
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

info.update = function(props) {
	this._div.innerHTML = '<h4>Data Available for Country</h4>'
			+ (props ? '<b>' + props.NAME + '</b><br />Number of Airports: '
					+ numberOfAirports.get(props.NAME)
					+ '</b><br />Access to clean water: '
					+ props.PERCENT_ACCESS_TO_CLEAN_WATER + "%" 
					+ '</b><br />Access to Sanitation: '
					+ props.PERCENT_ACCESS_TO_SANITATION + "%" 
					+ '</b><br />Number of Ebola Cases: '
					+ props.NUMBER_INFECTED
					: 'Hover over a Country');
}
info.addTo(map);

var legendWater = L.control({
	position : 'bottomleft'
});
legendWater.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend'), grades = [ 90, 85, 80,
			75, 70, 65, 60, 55, 0], labels = [], from, to;

	for (var i = 0; i < grades.length - 1; i++) {
		from = grades[i + 1];
		to = grades[i];

		labels.push('<i style="background:' + getWaterColor(from + 1) + '"></i> '
				+ from + (to ? '&ndash;' + to : '&ndash;0'));

	}

	div.innerHTML = '<h4><div style ="text-align:center">% Of People with</div> Access to Clean Water</h4>' + labels.join('<br>');
	return div;
}

var legendSanitation = L.control({
	position : 'bottomleft'
});
legendSanitation.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend'), grades = [ 30, 25, 20,
			15, 10, 5], labels = [], from, to;

	for (var i = 0; i < grades.length - 1; i++) {
		from = grades[i + 1];
		to = grades[i];

		labels.push('<i style="background:' + getSanitationColor(from + 1) + '"></i> '
				+ from + (to ? '&ndash;' + to : '&ndash;0'));

	}

	div.innerHTML = '<h4><div style ="text-align:center">% Of People with</div> Access to Sanitation</h4>' + labels.join('<br>');
	return div;
}

$.getJSON(geoJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature : function(feature, layer) {
			layer.on({
				mouseover : function(e) {
					var layer = e.target;
					layer.setStyle(highlightStyle);
					info.update(layer.feature.properties);
					layer.bringToFront();
					if(map.hasLayer(ebolaLayer)){
						ebolaLayer.bringToFront();
					}
				},
				mouseout : function(e) {
					e.target.setStyle(defaultStyle);
					info.update();
				},
				click : function(e) {
					map.fitBounds(e.target.getBounds());
				}
			})
		},
		style : defaultStyle
	}).addTo(defaultLayer);
})

$.getJSON(geoJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature : function(feature, layer) {
			layer.on({
				mouseover : function(e) {
					var layer = e.target;
					layer.setStyle(highlightStyle);
					info.update(layer.feature.properties);
					layer.bringToFront();
					if(map.hasLayer(ebolaLayer)){
						ebolaLayer.bringToFront();
					}
				},
				mouseout : function(e) {
					e.target.setStyle(waterStyle(feature));
					info.update();
				},
				click : function(e) {
					map.fitBounds(e.target.getBounds());
				}
			})
		},
		style : waterStyle
	}).addTo(waterLayer);
})

$.getJSON(geoJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature : function(feature, layer) {
			layer.on({
				mouseover : function(e) {
					var layer = e.target;
					layer.setStyle(highlightStyle);
					info.update(layer.feature.properties);
					layer.bringToFront();
					if(map.hasLayer(ebolaLayer)){
						ebolaLayer.bringToFront();
					}
				},
				mouseout : function(e) {
					e.target.setStyle(sanitationStyle(feature));
					info.update();
				},
				click : function(e) {
					map.fitBounds(e.target.getBounds());
				}
			})
		},
		style : sanitationStyle
	}).addTo(sanitationLayer);
})

defaultLayer.onAdd = function(map){
	defaultLayer.eachLayer(function(layer){
		map.addLayer(layer);
	})
	if(map.hasLayer(ebolaLayer)){
		ebolaLayer.bringToFront();
	}
}

waterLayer.onAdd = function(map){
	waterLayer.eachLayer(function(layer){
		map.addLayer(layer);
	})
	if(map.hasLayer(ebolaLayer)){
		ebolaLayer.bringToFront();
	}
	legendWater.addTo(map);
}

waterLayer.onRemove = function(map){
	waterLayer.eachLayer(function(layer){
		map.removeLayer(layer);
	})
	legendWater.removeFrom(map);
}

sanitationLayer.onAdd = function(map){
	sanitationLayer.eachLayer(function(layer){
		map.addLayer(layer);
	})
	if(map.hasLayer(ebolaLayer)){
		ebolaLayer.bringToFront();
	}
	legendSanitation.addTo(map);
}

sanitationLayer.onRemove = function(map){
	sanitationLayer.eachLayer(function(layer){
		map.removeLayer(layer);
	})
	legendSanitation.removeFrom(map);
}

var baseMap = {
	"Default" : defaultLayer,
	"Sanitation Access" : sanitationLayer,
	"Water Access" : waterLayer
}
var overlay = {
	"Airports" : airports,
	"Ebola" : ebolaLayer
}

L.control.layers(baseMap, overlay).addTo(map);