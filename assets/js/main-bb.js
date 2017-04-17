$(document).ready(function () {

	require([
		"esri/Map",
		"esri/views/MapView",
		"esri/WebMap",
		"esri/widgets/Locate",
		"esri/tasks/Locator",
		"esri/widgets/Search",
		"esri/tasks/support/Query",
		"esri/tasks/QueryTask",
		"dojo/domReady!",
	], function(Map, MapView, WebMap, Locate, Locator, Search, Query, QueryTask, Point, SimpleMarkerSymbol, Graphic){

		var FaqModal = Backbone.Model.extend({

			// initialize: function() {
			//
			// },

			defaults: {
				title: '',
				search_str: '',
				search_str_placeholder: 'Address...',
				map_div: 'property-faq-map',
				folio: ''
			},

			setParcel: function(response) {
				// console.log(geometry);
				this.set('title', response.result.name);
				// this.set('folio', 123456);
			}

		});

		var FaqModalMapView = Backbone.View.extend({

			el: '#property-faq-map-container',

			initialize: function() {
				this.map_div = 'property-faq-map';
				this.mapview = this.esriMapview();
				this.search_widget = this.esriSearchWidget();

				var model = this.model;
				this.search_widget.on("select-result", function(event){
					// model.set('title', event.result.name);
					model.setParcel(event.result.feature.geometry);
				});

				// this.listenTo(model, 'change:search_str', this.render);
				// this.listenTo(model, 'change:title', this.changeModalTitle);

				this.render();
			},

			render: function() {
				this.search_widget.search(this.model.get('search_str'));
			},

			esriMapview: function() {
				webmap = new WebMap({
					portalItem: {
						id: "b51fb4e76e154e1b93b630eac3ea94ae"
					},
				});

				mapview = new MapView({
					container: this.map_div,
					map: webmap
				});

				locateBtn = new Locate({
					view: mapview
				});

				mapview.ui.add(locateBtn, {
					position: "top-left",
					index: 2
				});

				return mapview;
			},

			esriSearchWidget: function() {
				locator_url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"

				searchWidget = new Search({
					view: this.mapview,
					searchTerm: this.model.get('search_str'),
					sources: [{
						locator: new Locator(locator_url),
						singleLineFieldName: "SingleLine",
						outFields: ["*"],
						name: 'name',
						maxResults: 1,
						localSearchOptions: {
							minScale: 300000,
							distance: 50000
						},
						placeholder: 'Address...'
					}]
				});

				this.mapview.ui.add(searchWidget, {
					position: "bottom-left",
					index: 0
				});

				return searchWidget;
			}

		});

		var FaqModalView = Backbone.View.extend({

			el: '#property-faq-Modal',

			initialize: function() {
				this.render();
				// this.listenTo(modal, 'change:search_str', this.render);
				this.listenTo(this.model, 'change:title', this.changeModalTitle);
			},

			render: function() {
				this.changeTitle(this.model.get('search_str'));
				this.renderMap();
				this.show();
			},

			show: function(e) {
				this.$el.modal('show');
			},

			hide: function(e) {
				this.$el.modal('hide');
			},

			reset: function(e) {
				//
				this.hide();
			},

			changeTitle: function(text=null) {
				console.log('title changed');
				text = text || this.model.get('title');
				this.$el.find('.modal-title').text(text);
			},

			renderMap: function() {
				map = new FaqModalMapView({model: this.model});
			}

		});

		// var faq_modal = new FaqModal({search_str: 'test time'});
		// var faq_modal_view = new FaqModalView({model: faq_modal});


		$('#property-faq-form').on('submit', function(e) {
			e.preventDefault();
			var form_data = $(this).serializeArray();
			var addr_input = _.findWhere(form_data, {name: "address"}).value;

			// modal.set('search_str', addr_input);
			var faq_modal = new FaqModal({search_str: addr_input});
			var faq_modal_view = new FaqModalView({model: faq_modal});

			// $propFAQmodal.find('.modal-title').text(addr_input);
			// searchWidget.searchTerm = addr_input;
			// searchWidget.search(addr_input);
			// $propFAQmodal.modal('show');
		});

		// console.log();

	});

});
