$(function () {

	$('[data-toggle="tooltip"] ').tooltip(); // move to theme.js

	var $propFAQmodal = $('#property-faq-Modal');
	// $propFAQmodal.modal('show');
	$('#hc-property-faq input[name="address"]').val('6206 olivedale dr');

	var currentParcel = {};

	$propFAQmodal.on('hidden.bs.modal', function (e) {
		resetSearch();
	});

	var resetSearch = function() {
		$propFAQmodal.find('#property-faq-results').html(null);
		$propFAQmodal.find('#property-faq-alerts').html(null);
		$("#property-faq-questions").val(function(){
			return $(this).find("option:first").val();
		});
		currentParcel = {};
	};

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

		var webmap = new WebMap({
			portalItem: {
				id: "b51fb4e76e154e1b93b630eac3ea94ae"
			},
		});

		var view = new MapView({
			container: "mapDiv",
			map: webmap
		});

		var locateBtn = new Locate({
			view: view
		});

		view.ui.add(locateBtn, {
			position: "top-left",
			index: 2
		});

		var searchWidget = new Search({
			view: view,
			searchTerm: '',
			sources: [
				{
					locator: new Locator("https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"),
					singleLineFieldName: "SingleLine",
					outFields: ["*"],
					name: 'name',
					maxResults: 1,
					localSearchOptions: {
						minScale: 300000,
						distance: 50000
					},
					placeholder: 'Address...'
				}
			]
		});

		view.on('click', function(e){
			// console.log(e);
		});

		searchWidget.on("select-result", function(event){
			$propFAQmodal.find('.modal-title').text(event.result.name);
			resetSearch();
			setParcel(event.result.feature.geometry);
		});

		$('#property-faq-form').on('submit', function(e) {
			e.preventDefault();
			var form_data = $(this).serializeArray();
			var addr_input = _.findWhere(form_data, {name: "address"}).value;

			$propFAQmodal.find('.modal-title').text(addr_input);
			searchWidget.searchTerm = addr_input;
			searchWidget.search(addr_input);
			$propFAQmodal.modal('show');
		});

		$('#property-faq-questions').on('change', function(e) {
			// busy
			$('#property-faq-results').html('<p class="text-center"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></p>')

			//
			switch ($(this).val()) {
				case 'What are my trash pickup days?':
					_.isUndefined(currentParcel.hauler) ? setHauler() : addObjToView(currentParcel);
					break;
				case 'What is my evacuation zone?':
					_.isUndefined(currentParcel.evac_zone) ? setEvacZone() : addObjToView(currentParcel);
					break;
				case 'Am I in the 140 MPH wind borne debris area?':
					_.isUndefined(currentParcel.wind_zone) ? setWindZone() : addObjToView(currentParcel);
					break;
				case 'What is my flood zone?':
					_.isUndefined(currentParcel.flood_zone) ? setFloodZone() : addObjToView(currentParcel);
					break;
				default:
					console.log($(this).val());
			}
		});

		var setParcel = function(point) {
			currentParcel.geometry = point;

			url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/HC_Parcels/MapServer/0"
			options = {
				returnGeometry: true,
				outFields: ['FOLIO'],
				geometry: point
			};
			queryUrl(url, 'parcel', options, false);
		};

		var setHauler = function() {
			url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_HAULER_DATA2/MapServer/1"
			options = {
				where: 'Folio = ' + currentParcel.parcel.FOLIO,
				geometry: {spatialReference:{wkid:{}}}
			};
			queryUrl(url, 'hauler', options);
		};

		var setFloodZone = function() {
			url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/DSD_Viewer_Services/DSD_Viewer_Nature/MapServer/0"
			queryUrl(url, 'flood_zone');
		};

		var setEvacZone = function() {
			url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/Heat/Evaczones/MapServer/0"
			queryUrl(url, 'evac_zone');
		};

		var setWindZone = function() {
			url = "https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/infoLayers/MapServer/1"
			queryUrl(url, 'wind_zone');
		};

		var queryUrl = function(url, cp_index='error', options={}, render=true) {
			queryTask = new QueryTask({ url: url });
			options.geometry = options.geometry || currentParcel.geometry;
			options.returnGeometry = options.returnGeometry || false;
			options.outFields = options.outFields || ['*'];
			query = new Query(options);
			qt = queryTask.execute(query).then(function(result){
				currentParcel[cp_index] = result.features[0].attributes;
				// render
				if (render) {
					addObjToView(currentParcel, cp_index);
				}
			});
			return qt;
		};

		var addObjToView_ = function(parcelObj) {
			$pre = $('<pre>').addClass('small').text(JSON.stringify(parcelObj, null, '\t'));
			$('#property-faq-results').html($pre);
		};

		var addObjToView = function(parcelObj, cp_index) {
			$.get("/templates/"+cp_index+".html", function(templateData) {
				var template = _.template(templateData);
				$('#property-faq-results').html(
					template({obj: parcelObj, model: parcelObj[cp_index]})
				);
			}, 'html');
		};

		view.ui.add(searchWidget, {
			position: "bottom-left",
			index: 0
		});

	});



});
