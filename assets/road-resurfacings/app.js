require([
	'/assets/road-resurfacings/Router.js',
	'dojo/domReady!'
], function(Router) {
	window.app_router = new Router;
	Backbone.history.start();
});
