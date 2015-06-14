function getWaterColor(d) {
	return d > 90 ? '#fff5eb' : d > 85 ? '#fee6ce' : d > 80 ? '#fdd0a2'
			: d > 75 ? '#fdae6b' : d > 70 ? '#fd8d3c' : d > 65 ? '#f16913'
					: d > 60 ? '#d94801' : d > 55 ? '#a63603' : '#7f2704';
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

map.addLayer(waterLayer);
map.removeLayer(waterLayer);
