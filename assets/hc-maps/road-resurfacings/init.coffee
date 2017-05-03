---
---

define [
	working_dir+'/road-resurfacings/map_view.js'
	working_dir+'/road-resurfacings/results_view.js'
], (MapView, ResultView) ->

	HcMaps.RoadResurfacings.Routers.MainRouter = Backbone.Router.extend

		initialize: (options) ->
			@feature_url = 'https://maps.hillsboroughcounty.org/arcgis/rest/services/CoinMap/FY17PlannedResurfacing/MapServer/0'

			@map_view = new HcMaps.RoadResurfacings.Views.MapView
				router: this
				url: @feature_url

			@results_view = new HcMaps.RoadResurfacings.Views.ResultView
				url: @feature_url

		routes:
			'projects': 'index'
			'projects/:id': 'show'
			'*actions': 'index'

		index: (actions) ->
			@map_view.render()

		show: (id) ->
			@map_view.render()
			@map_view.highlight_project(id)


	return HcMaps.RoadResurfacings.Routers.MainRouter
