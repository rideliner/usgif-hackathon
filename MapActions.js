var geoJSONPath = './geography.json'
var airportsJSONPath = './airports.json'
	
var defaultStyle = {
	fillColor : '#9ecae1',
	weight : 2,
	opacity : 1,
	color : 'white',
	dashArray : '3',
	fillOpacity : 0.7
}

var highlightStyle = {
	weight : 5,
	color : '#666',
	dashArray : '',
	fillOpacity : 0.7
}

var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
}

var numberOfAirports = [];

$.getJSON(airportsJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature : function(feature, layer) {
			layer.bindPopup(feature.properties.name);
			/*
			if(numberOfAirports[feature.properties.ID] == null){
				numberOfAirports[feature.properties.ID] = 1
			} else {
				numberOfAirports[feature.properties.ID]++;
			}
			*/
		}
	}).addTo(airports);
})


info.update = function(props) {
	this._div.innerHTML = '<h4>Data Available for Country</h4>'
			+ (props ? '<b>' + props.NAME + '</b><br />Number of Airports: ' + numberOfAirports[props.ID]
					: 'Hover over a Country');
}

info.addTo(map);




$.getJSON(geoJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature : function(feature, layer) {
			layer.on({
				mouseover : function(e) {
					var layer = e.target;
					layer.setStyle(highlightStyle);
					info.update(layer.feature.properties);
					if (!L.Browser.ie && !L.Browser.opera) {
						layer.bringToFront();
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
	}).addTo(map);
})

var baseLayers = {
	
}

var overlay = {
	"Airports": airports
}

L.control.layers(baseLayers, overlay).addTo(map);