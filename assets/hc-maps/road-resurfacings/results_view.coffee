---
---

define [
	'text!'+working_dir+'/road-resurfacings/results.html'
	'esri/layers/FeatureLayer'
	'esri/tasks/support/Query'
], (Template, FeatureLayer, Query) ->

	HcMaps.RoadResurfacings.Models.ResultModel = Backbone.Model.extend
		defaults:
			oid: 'OBJECTID'

		initialize: ->
			@feature = @attributes.attributes
			@project_id = @attributes.attributes[@get('oid')]
			@project_path = '#projects/' + @project_id
			return


	HcMaps.RoadResurfacings.Views.ResultsView = Backbone.View.extend

		el: '#road-resurfacings-results'

		events:
			'keyup #road-resurfacings-filter': 'filter_features'
			'click #road-resurfacings-filter-reset': 'reset'

		initialize: (options) ->
			@feature_url = options.url
			@query_fields = ['STREET', 'FRSTNM', 'TOSTNM']
			@reset()
			return

		render: ->
			if @collection.models.length > 0
				@$el.find('table').html @template()
			else
				@$el.find('table').html $('<p class="h2 text-center">').text('No Results')
			return this

		template: ->
			template = _.template(Template)
			return template collection: @collection.models

		reset: ->
			$('#road-resurfacings-filter').val(null)
			@filter_features target: value: null

		filter_features: (event) ->
			that = this

			feature_layer = new FeatureLayer(url: @feature_url).load()

			feature_layer.then ->

				query = new Query
				query.outFields = ["*"]
				query.where = that.where_expression(event.target.value)

				feature_layer.queryFeatures(query).then (results) ->
					that.collection = new Backbone.Collection results.features, {model: HcMaps.RoadResurfacings.Models.ResultModel}
					that.render()

		where_expression: (value) ->
			if value
				return _.map(@query_fields, (f) ->
					f + " LIKE '%" + value + "%'"
				).join(' OR ')
			else
				return '1=1'


	return HcMaps.RoadResurfacings.Views.ResultsView
