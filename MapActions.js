var geoJSONPath = './geography.json'
var airportsJSONPath = './airports.json'

function getColor(d) {
	return d > 90 ? '#fff7fb' : d > 85 ? '#ece7f2' : d > 80 ? '#d0d1e6'
			: d > 75 ? '#a6bddb' : d > 70 ? '#74a9cf' : d > 65 ? '#3690c0'
					: d > 60 ? '#0570b0' : d > 55 ? '#045a8d' : '#023858';
}

var defaultStyle = {
	fillColor : 'white',
	weight : 2,
	opacity : 1,
	color : 'black',
	dashArray : '3',
	fillOpacity : 0
}

var waterStyle = function(feature){
	return {
		fillColor: getColor(feature.properties.PERCENT_ACCESS_TO_CLEAN_WATER),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	}
}

var highlightStyle = {
	weight : 5,
	color : 'black',
	dashArray : '',
	fillOpacity : 0.7
}

var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
}

var numberOfAirports = new Map();

$.getJSON(airportsJSONPath,function(data) {
	L.geoJson(data,{onEachFeature : function(feature, layer) {
			layer.bindPopup(feature.properties.name);
				if (numberOfAirports.get(feature.properties.country) === undefined) {
					numberOfAirports.set(feature.properties.country,1);
				} else {
					numberOfAirports.set(feature.properties.country,numberOfAirports.get(feature.properties.country) + 1);
				}
			}
		}).addTo(airports);
	})

info.update = function(props) {
	this._div.innerHTML = '<h4>Data Available for Country</h4>'
			+ (props ? '<b>' + props.NAME + '</b><br />Number of Airports: '
					+ numberOfAirports.get(props.NAME)
					+ '</b><br />Access to clean water: '
					+ props.PERCENT_ACCESS_TO_CLEAN_WATER + "%"
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
					e.target.setStyle(waterStyle(feature));
					info.update();
				},
				click : function(e) {
					map.fitBounds(e.target.getBounds());
				}
			})
		},
		style : waterStyle
	}).addTo(map)
})

var colorData = {
  
}

var overlay = {
	"Airports" : airports
}

L.control.layers(colorData, overlay).addTo(map);
