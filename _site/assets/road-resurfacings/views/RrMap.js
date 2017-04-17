define([
	'esri/Map',
	'esri/views/MapView',
	'esri/WebMap',
	'esri/widgets/Home',
	'esri/layers/FeatureLayer',
	'esri/tasks/QueryTask',
	'esri/tasks/support/Query',
	'dojo/domReady!'
], function(Map, MapView, WebMap, Home, FeatureLayer, QueryTask, Query){

	var RrMap = Backbone.View.extend({

		el: "#mapDiv",

		initialize: function() {

			this.rr_layer = new FeatureLayer({
				url: this.attributes.url
			});

			// this.webmap = new Map({
			// 	basemap: 'topo-vector'
			// });

			this.webmap = new WebMap({
				portalItem: {
					id: 'b51fb4e76e154e1b93b630eac3ea94ae'
				}
			});

			this.webmap.layers.add(this.rr_layer);

			this.mapview = new MapView({
				container: this.el,
				map: this.webmap,
			});

			this.homeWidget = new Home({
				view: this.mapview
			});

			this.mapview.ui.add(this.homeWidget, "top-left");

		},

		scrollTo: function(offset=15, time=100) {
			$('html, body').animate({
				scrollTop: this.$el.offset().top - offset
			}, time);
		},

		highlight: function(id) {
			this.scrollTo();

			var queryTask = new QueryTask({
				url: this.attributes.url
			});
			var query = new Query();

			this.mapview.then(function(mapview) {
				query.returnGeometry = true;
				query.outFields = ["*"];
				query.where = "OBJECTID = " + id;
				query.outSpatialReference = mapview.spatialReference;

				queryTask.execute(query).then(function(results){
					var extent = results.features[0].geometry.extent;
					mapview.extent = extent.expand(3);
				});
			});
		}

	});

	return RrMap;

});
