require.config({
	baseUrl: "/assets/js",
	paths: {
		jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min',
		underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
		backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min'
	}
});

require([
	'../road-resurfacing/app',
], function(RoadResurfacingApp){
	RoadResurfacingApp.initialize();
});
