define([
	'/assets/road-resurfacings/views/RrMap.js',
	'/assets/road-resurfacings/views/RrFeatureResultsView.js',
	'dojo/domReady!'
], function(RrMap, RrFeatureResultsView) {

	var AppRouter = Backbone.Router.extend({

		initialize: function() {
			this.rr_url = 'https://maps.hillsboroughcounty.org/arcgis/rest/services/CoinMap/FY17PlannedResurfacing/MapServer/0';

			this.rr_map = new RrMap({
				attributes: { url: this.rr_url }
			});

			this.rr_results_view = new RrFeatureResultsView({
				attributes: { url: this.rr_url }
			});

			this.rr_map.homeWidget.on('go', function(event){
				window.app_router.navigate('/projects');
			});
		},

		routes: {
			'projects/:id': 'show',
			'projects': 'index',
			'*actions': 'index'
		},

		index: function(actions) {
		},

		show: function(id) {
			this.rr_map.highlight(id);
			// rr_results_view.highlight(id);
		}

	});

	return AppRouter

});
