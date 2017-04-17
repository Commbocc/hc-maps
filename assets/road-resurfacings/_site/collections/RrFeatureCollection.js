define([
	'/assets/road-resurfacings/models/RrFeatureModel.js'
], function(RrFeatureModel){

	var RrFeatureCollection = Backbone.Collection.extend({

		model: RrFeatureModel,

		initialize: function(url) {
			this.url = url+'/query';
		},

		parse: function(data) {
			return data.features;
		},

		defaultOptions: {
			data: {
				f: 'json',
				where: '1=1',
				outFields: '*',
				returnGeometry: true
			}
		},

		fetch: function(options={}) {
			options = _.extend(this.defaultOptions, options);
			return Backbone.Collection.prototype.fetch.call(this, options);
		}

	});

	return RrFeatureCollection;

});
