
var geoJSONPath = './geography.json'

var defaultStyle = {
	fillColor : 'white',
	weight : 2,
	opacity : 1,
	color : 'black',
	dashArray : '3',
	fillOpacity : 0
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

defaultLayer.onAdd = function(map){
	defaultLayer.eachLayer(function(layer){
		map.addLayer(layer);
	})
	if(map.hasLayer(ebolaLayer)){
		ebolaLayer.bringToFront();
	}
}
