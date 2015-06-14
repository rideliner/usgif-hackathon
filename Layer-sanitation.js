function getSanitationColor(d) {
	return d > 25 ? '#feebe2' : d > 20 ? '#fcc5c0' : d > 15 ? '#fa9fb5'
			: d > 10 ? '#f768a1' : d > 5 ? '#c51b8a' : '#7a0177';
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
					e.target.setStyle(sanitationStyle(feature));
					info.update();
				},
				click : function(e) {
					if(!centeredOnCountry || currentCountry != layer.feature.properties.NAME){
						map.fitBounds(e.target.getBounds());
						currentCountry = layer.feature.properties.NAME;
						console.log(currentCountry);
						centeredOnCountry = true;
					} else {
						map.setView([ 13.364376, -0.3763377 ], 5);
						centeredOnCountry = false;
					}
				}
			})
		},
		style : sanitationStyle
	}).addTo(sanitationLayer);
})

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

map.addLayer(sanitationLayer);
map.removeLayer(sanitationLayer);
