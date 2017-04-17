define([
	'esri/layers/FeatureLayer',
	'esri/tasks/support/Query',
	'/assets/road-resurfacings/models/RrFeatureModel.js',
	'text!/assets/road-resurfacings/templates/table_view.html'
], function(FeatureLayer, Query, RrFeatureModel, Template){

	var RrFeatureResultsView = Backbone.View.extend({

		el: "#results",

		model: RrFeatureModel,

		events: {
			'keyup #search-filter': 'search'
		},

		initialize: function() {
			this.search( {target: {value: null}} );
		},

		template: function() {
			var template = _.template(Template);
			return template({collection: this.collection.models});
		},

		render: function() {
			if (this.collection.models.length > 0) {
				this.$el.find('table').html( this.template() );
			} else {
				this.$el.find('table').html( $('<p class="h2 text-center">').text('No Results') );
			}
			return this;
		},

		search: function(event) {

			var that = this;

			var feature_layer = new FeatureLayer({
				url: this.attributes.url
			}).load();

			feature_layer.then(function(lyr){

				var query = new Query;
				var query_fields = ['STREET', 'FRSTNM', 'TOSTNM'];
				query.outFields = ["*"];

				if (event.target.value) {
					query.where = _.map(query_fields, function(f){
						return f + " LIKE '" + event.target.value + "%'";
					}).join(' OR ');
				} else {
					query.where = "1=1";
				}

				lyr.queryFeatures(query).then(function(results){
					that.collection = new Backbone.Collection(results.features, {model: RrFeatureModel});
					that.render();
				});

			});
		},

		// highlight: function() {
		// 	// $.when(this.collection.ready).then(function(){
		// 	// 	model = _.where(this.collection.models, {OBJECTID: id});
		// 	// 	console.log(model);
		// 	// });
		// }

	});

	return RrFeatureResultsView;

});
