---
---

define [
	'esri/layers/FeatureLayer'
	'esri/WebMap'
	'esri/views/MapView'
	'esri/widgets/Home'
	'esri/tasks/QueryTask'
	'esri/tasks/support/Query'
	'esri/symbols/SimpleLineSymbol'
	'esri/Graphic'
], (FeatureLayer, WebMap, MapView, Home, QueryTask, Query, SimpleLineSymbol, Graphic) ->

	HcMaps.RoadResurfacings.Views.MapView = Backbone.View.extend

		el: '#road-resurfacings-map'

		initialize: (options) ->
			@feature_url = options.url

			@map_el = document.createElement('div')
			@map_el.className = 'embed-responsive-item'

			@feat_layer = new FeatureLayer
				url: @feature_url

			@webmap = new WebMap
				portalItem:
					id: 'b51fb4e76e154e1b93b630eac3ea94ae'

			@webmap.layers.add(@feat_layer);

			@esrimapview = new MapView
				container: @map_el
				map: @webmap

			@home_widget = new Home
				view: @esrimapview

			@home_widget.on 'click', (event) ->
				options.router.navigate 'projects'
				return

			@esrimapview.ui.add @home_widget, 'top-left'

			# @locateBtn = new Locate
			# 	view: @esrimapview
			#
			# @esrimapview.ui.add @locateBtn,
			# 	position: 'top-left'
			# 	index: 2

		render: ->
			@remove_highlight()
			@$el.append @map_el;
			return this

		scrollTo: (time = 500, offset = 15) ->
			$('html, body').animate { scrollTop: @$el.offset().top - offset }, time
			return

		remove_highlight: ->
			@esrimapview.graphics.remove(@line_graphic) if @line_graphic

		highlight_project: (id) ->
			@scrollTo()

			that = this
			@esrimapview.then ->
				queryTask = new QueryTask
					url: that.feature_url

				query = new Query
				query.returnGeometry = true
				query.outFields = ["*"]
				query.where = "OBJECTID = " + id
				query.outSpatialReference = that.esrimapview.spatialReference

				queryTask.execute(query).then (results) ->
					geometry = results.features[0].geometry

					symbol = new SimpleLineSymbol
						color: "#000"
						width: "7px"
						style: "short-dot"

					that.line_graphic = new Graphic
						symbol: symbol
						geometry: geometry

					that.esrimapview.extent = geometry.extent.expand(3);
					that.esrimapview.graphics.add(that.line_graphic);


	return HcMaps.RoadResurfacings.Views.MapView
