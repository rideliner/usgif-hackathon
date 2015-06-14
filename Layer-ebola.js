var ebolaJSONPath = './ebola.json'

$.getJSON(ebolaJSONPath, function(data) {
	L.geoJson(data, {
		pointToLayer: function(feature, latlong){
			return L.circle(latlong,  feature.properties.value * 50, {
				color: 'GREEN',
				fillColor: 'GREEN'
			})
		}
	}).addTo(ebolaLayer);
			
})

map.addLayer(ebolaLayer);
map.removeLayer(ebolaLayer);
