$(function() {
	window.HcMaps = window.HcMaps || {};

	HcMaps.Routers.RoadResurfacings = Backbone.Router.extend({

		initialize: function(options) {

			this.map = new HcMaps.Views.RoadResurfacingsMap({attributes: {
				url: options.url
			}});

			this.results = new HcMaps.Views.RoadResurfacingsResults({attributes: {
				url: options.url,
				template_path: options.template_path
			}});

		},

		routes: {
			'projects/:id': 'show',
			'projects': 'index',
			'*actions': 'index'
		},

		index: function(actions) {
			this.map.render();
		},

		show: function(id) {
			this.map.render(id);
		}

	});

});
