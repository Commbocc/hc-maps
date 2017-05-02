$(function() {
	window.HcMaps = window.HcMaps || {};

	HcMaps.Views.RoadResurfacingsMap = Backbone.View.extend({

		el: "#mapDiv",

		render: function(highlight_id=null) {
			var that = this;

			require([
				'esri/layers/FeatureLayer',
				'esri/WebMap',
				'esri/views/MapView',
				'esri/widgets/Home',
				'esri/tasks/QueryTask',
				'esri/tasks/support/Query',
				'esri/symbols/SimpleLineSymbol',
				'esri/Graphic'
			], function(FeatureLayer, WebMap, MapView, Home, QueryTask, Query, SimpleLineSymbol, Graphic) {

				var feat_layer = new FeatureLayer({
					url: that.attributes.url
				});

				var webmap = new WebMap({
					portalItem: {
						id: 'b51fb4e76e154e1b93b630eac3ea94ae'
					}
				});

				webmap.layers.add(feat_layer);

				var mapview = new MapView({
					container: that.el,
					map: webmap
				});

				var homeWidget = new Home({
					view: mapview
				});

				homeWidget.on('go', function(event){
					window.road_resurfacings_router.navigate('/projects');
				});

				mapview.ui.add(homeWidget, "top-left");

				if (highlight_id) {
					that.scrollTo();

					mapview.then(function() {
						var queryTask = new QueryTask({
							url: that.attributes.url
						});
						var query = new Query();
						query.returnGeometry = true;
						query.outFields = ["*"];
						query.where = "OBJECTID = " + highlight_id;
						query.outSpatialReference = mapview.spatialReference;

						queryTask.execute(query).then(function(results){
							var geometry = results.features[0].geometry;

							//
							var symbol = new SimpleLineSymbol({
								color: "black",
								width: "5px",
								style: "dash"
							});

							var line = new Graphic({
								symbol: symbol,
								geometry: geometry
							});

							mapview.extent = geometry.extent.expand(3);
							mapview.graphics.add(line);
						});
					});
				}

				return mapview;
			});

		},

		scrollTo: function(time=500, offset=15) {
			$('html, body').animate({
				scrollTop: this.$el.offset().top - offset
			}, time);
		}

	});

});
