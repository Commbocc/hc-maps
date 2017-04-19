$(function() {
	window.HcMaps = window.HcMaps || {};

	HcMaps.Views.RoadResurfacingsResults = Backbone.View.extend({

		el: "#results",

		events: {
			'keyup #search-filter': 'search'
		},

		initialize: function() {
			this.search( {target: {value: null}} );
		},

		render: function() {
			if (this.collection.models.length > 0) {
				var that = this;
				var time = Date.now();
				$.get(this.attributes.template_path+"/results.html?t="+time, function(templateData) {
					var template = _.template(templateData);
					var html = template({collection: that.collection.models});
					that.$el.find('table').html( html );
				}, 'html');
			} else {
				this.$el.find('table').html( $('<p class="h2 text-center">').text('No Results') );
			}
			return this;
		},

		search: function(e) {
			var that = this;

			require([
				'esri/layers/FeatureLayer',
				'esri/tasks/support/Query',
			], function(FeatureLayer, Query){

				var feature_layer = new FeatureLayer({
					url: that.attributes.url
				}).load();

				feature_layer.then(function(){

					var query = new Query;
					var query_fields = ['STREET', 'FRSTNM', 'TOSTNM'];
					query.outFields = ["*"];


					if (e.target.value) {
						query.where = _.map(query_fields, function(f){
							return f + " LIKE '%" + e.target.value + "%'";
						}).join(' OR ');
					} else {
						query.where = "1=1";
					}

					feature_layer.queryFeatures(query).then(function(results){
						that.collection = new Backbone.Collection(results.features, {model: HcMaps.Models.RoadResurfacingsResult});
						that.render();
					});

				});

			});
		},


	});

	HcMaps.Models.RoadResurfacingsResult = Backbone.Model.extend({

		defaults: {
			oid: 'OBJECTID',
			highlighted: false
		},

		initialize: function() {
			this.feature = this.attributes.attributes;
			this.project_id = this.attributes.attributes[this.get('oid')];
			this.project_path = this.project_path();
		},

		project_path: function() {
			return '#projects/'+this.project_id;
		}

	});

});
