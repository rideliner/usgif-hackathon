
var geoJSONPath = './geography.json'

var defaultStyle = {
	fillColor: '#9ecae1',
	weight: 2,
	opacity: 1,
	color: 'white',
	dashArray: '3',
	fillOpacity: 0.7
}

var highlightStyle = {
	weight: 5,
	color: '#666',
	dashArray: '',
	fillOpacity: 0.7
}

$.getJSON(geoJSONPath, function(data) {
	L.geoJson(data, {
		onEachFeature: function(feature, layer) {
			layer.on({
				mouseover: function(e) {
					var layer = e.target;
					layer.setStyle(highlightStyle);
					if (!L.Browser.ie && !L.Browser.opera) {
						layer.bringToFront();
					}
				},
				mouseout: function(e) {
					e.target.setStyle(defaultStyle);
				},
				click: function(e) {
					map.fitBounds(e.target.getBounds());
				}
			})
		},
		style: defaultStyle
	}).addTo(map);
})
