define([
], function(){

	var RrFeatureModel = Backbone.Model.extend({

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

	return RrFeatureModel;

});
