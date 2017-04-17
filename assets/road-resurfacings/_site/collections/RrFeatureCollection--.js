define([
	'esri/widgets/Search',
	'esri/layers/FeatureLayer',
	'/assets/road-resurfacings/models/RrFeatureModel.js'
], function(Search, FeatureLayer, RrFeatureModel){

	var RrFeatureCollection = Backbone.Collection.extend({

		model: RrFeatureModel,

		initialize: function(esri_search_results) {
			// this.url = url+'/query';
			// console.log(esri_search_results);
			// this.parse(esri_search_results[0].results);
			// return this.parse(esri_search_results);
			return esri_search_results[0].results;
		},

		parse: function(data) {
			console.log('parsing')
			// console.log(data);
			// return data.features;
			// return data[0].results;
		},

		// defaultOptions: {
		// 	data: {
		// 		f: 'json',
		// 		where: '1=1',
		// 		outFields: '*',
		// 		returnGeometry: true
		// 	}
		// },

		fetch: function(options={}) {
			// options = _.extend(this.defaultOptions, options);
			// return Backbone.Collection.prototype.fetch.call(this, options);
		},

		widget: function(feature) {

			var feature_layer = new FeatureLayer({
				url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/CoinMap/FY17PlannedResurfacing/MapServer/0'
			});

			var sources = [
				{
					featureLayer: feature_layer,
					searchFields: ['STREET'],
					// displayField: "STREET",
					exactMatch: false,
					outFields: ["*"],
					// name: "Point FS",
					// placeholder: "example: esri",
					// maxResults: 6,
					// maxSuggestions: 6,
					// suggestionsEnabled: false,
					// minSuggestCharacters: 2
				}
			];

			var searchWidget = new Search({
				sources: sources
			});

			return searchWidget;
		}

	});

	return RrFeatureCollection;

});
