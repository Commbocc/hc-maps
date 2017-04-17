define([
], function(){

	var RrFeatureModel = Backbone.Model.extend({

		// defaults: {
		// },

		parse: function(data) {
			this.oid = 'OBJECTID';

			this.attributes = data.attributes;
			this.geometry = data.geometry;
			this.project_id = data.attributes[this.oid];
			this.project_path = this.project_path();
			// return data.attributes;
		},

		project_path: function() {
			return '#projects/'+this.project_id;
		}

	});

	return RrFeatureModel;

});
