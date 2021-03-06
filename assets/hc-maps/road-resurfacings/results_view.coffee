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
			@project_id = @feature[@get('oid')]
			@project_path = '#projects/' + @project_id
			return


	HcMaps.RoadResurfacings.Collections.ResultCollection = Backbone.Collection.extend
		model: HcMaps.RoadResurfacings.Models.ResultModel
		comparator: (m) ->
			return m.feature['STREET']


	HcMaps.RoadResurfacings.Views.ResultView = Backbone.View.extend

		el: '#road-resurfacings-results-container'

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
				@$el.find('#road-resurfacings-results').html @template()
			else
				@$el.find('#road-resurfacings-results').html $('<p class="h2 text-center">').text('No Results')
			return this

		template: ->
			template = _.template(Template)
			return template collection: @collection.models

		reset: ->
			$('#road-resurfacings-filter').val(null)
			@filter_features target: value: null

		filter_features: (event) ->
			feature_layer = new FeatureLayer(url: @feature_url).load()

			feature_layer.then =>
				query = new Query
				query.outFields = ["*"]
				query.where = @where_expression(event.target.value)

				feature_layer.queryFeatures(query).then (results) =>
					@collection = new HcMaps.RoadResurfacings.Collections.ResultCollection results.features
					@render()

		where_expression: (value) ->
			if value
				return _.map(@query_fields, (f) ->
					f + " LIKE '%" + value + "%'"
				).join(' OR ')
			else
				return '1=1'


	return HcMaps.RoadResurfacings.Views.ResultView
