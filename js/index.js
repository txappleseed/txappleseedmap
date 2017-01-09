var PageControl = (function(){


  "use strict";

  function Map( selector ) {

    // Rename 'this' for use in callbacks
    var thisMap = this;

    this.$el = $( selector );

    this.mapObject = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 7
    });

    this.tileLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    });

    this.groups = [
      "black_or_african_american",
      "asian",
      "hispanic/latino",
      "american_indian_or_alaska_nat",
      "special_education",
      "two_or_more_races",
      "white",
      "native_hawaiian/other_pacific",
      "economic_disadvantage"
    ];

    this.groupDisplayName = [
      "African American Students",
      "Asian Students",
      "Latino Students",
      "Native American Students",
      "Special Education Students",
      "Students of two or More Races",
      "White Students",
    ];

    this.punishments = {
      "Expulsion" : "D-EXPULSION ACTIONS",
      "AltEdu"    : "E-DAEP PLACEMENTS",
      "OSS"       : "F-OUT OF SCHOOL SUSPENSIONS",
      "ISS"       : "G-IN SCHOOL SUSPENSIONS",
    };

    // Dictionary that maps option values to GeoJSON data file paths
    this.dataFiles = {
        "Expulsion" : "geojson/expulsion_districts.geojson",
        "AltEdu"    : "geojson/altedu_districts.geojson",
        "OSS"       : "geojson/oss_districts.geojson",
        "ISS"       : "geojson/iss_districts.geojson",
    };

    this.groupPercentCode = [
      "DPETBLAP", // black
      "DPETASIP", // asian?
      "DPETHISP", // latino?
      "DPETINDP", // native american?
      "DPETSPEP", // special ed?
      "DPETTWOP", // multi-ethnic?
      "DPETWHIP", // white?
    ];

    this.$el.find(".selector__button").on("click", {context: this}, this.handleDataToggleClick);

    // Attach event handler to drop-down menu to update data after
    // selection changed.
    $("#dropdown").on(
        "change",
        function(event) {

            // Get the selection from the drop-down menu
            var dataKey = $("#dropdown").find("option:selected").val();

            // Load the data from the corresponding file
            thisMap.selectData(dataKey);
        }
    );

    this.setUp();
  };

  Map.prototype.setUp = function () {
    var mapClass = this,
        mapObject = this.mapObject,
        tileLayer  = this.tileLayer,
        joinIncidentsDataToJSON = this.joinIncidentsDataToJSON,
        punishments = this.punishments,
        groups = this.groups,
        initialGroupId = 0,
        options = this.getOptions(initialGroupId);

    // Adds tileLayer from the Map Class to the mapObject
    tileLayer.addTo(mapObject);

    this.requestInitialData(options);
  };

  Map.prototype.requestInitialData = function (options) {
    var addDataToMap = this.addDataToMap,
        mapObject = this.mapObject;

    // Request data from geosjon file and inserts data to the mapObject
    d3.queue()
      .defer(d3.json, "geojson/oss_districts.geojson")
      .await(function(error, geojson){
        if (error) throw error;

        console.log(geojson)

        addDataToMap(geojson, mapObject, options);

        // This is ugly, but I need to persist the geojson data so we don't have
        // to keep loading it from the file. Attaching it to the global window
        // object feels like bad practice, so forgive my ignorance.
        window.GEODATA = geojson;
      });
  };

  Map.prototype.getOptions = function (groupId) {
    var getFillColor = this.getFillColor,
        fischerValue = "OSS_scale_" + this.groups[groupId],
        punishmentPercentValue = "OSS_percent_" + this.groups[groupId],
        punishmentCountValue = "OSS_count_" + this.groups[groupId],
        percentStudentsValue = this.groupPercentCode[groupId],
        groupNameInPopup = this.groupDisplayName[groupId];


    return {
      style: function style(feature) {
        return {
          fillColor: getFillColor(Number(feature.properties[fischerValue])),
          weight: 1,
          opacity: 1,
          color: '#b3b3b3',
          fillOpacity: 0.6,
        };
      },
      onEachFeature: function onEachFeature(feature, layer) {
        var percentStudentsByGroup = feature.properties[percentStudentsValue],
            districtName = feature.properties.DISTNAME,
            groupName = groupNameInPopup,
            punishmentsPercent = feature.properties[punishmentPercentValue],
            punishmentsCount = feature.properties[punishmentCountValue] || 0,
            punishmentType = "Out of School Suspensions",
            popupContent;

        // debugger

        if (feature.properties[punishmentPercentValue]){
          var moreOrLessText = feature.properties[punishmentPercentValue] > 0 ? "more" : "less";

          popupContent = [
            "<span class='popup-text'>",
              groupName + " students received " + punishmentType + " ",
              punishmentsCount + " times",
              " accounting for " + punishmentsPercent + "%",
              " of all out-of-school suspensions",
              "in <b>" + districtName + "</b>.",
            "</span>"
          ].join('');
        } else {
          popupContent = "<span>Data not available for this student group.</span>";
        }

        if (feature.properties) layer.bindPopup(popupContent);
      },
    };
  };

  Map.prototype.handleDataToggleClick = function (e) {
    var selectedGroupId = $(this).data("group-id"),
        thiz = e.data.context,
        dataLayer = GEODATA,
        options = thiz.getOptions(selectedGroupId);

    // change toggle button CSS to indicate "active"
    $(".selector__button").removeClass("selector__button--active");
    $(this).addClass("selector__button--active");

    // remove exisiting layer for previous group
    thiz.clearGeojsonLayer.call(thiz);

    thiz.addDataToMap(dataLayer, thiz.mapObject, options)
  };

  Map.prototype.clearGeojsonLayer = function(){

    // Rename 'this' for use in callback
    var map = this.mapObject;

    // Remove all layers which have 'feature' properties
    map.eachLayer(function (layer) {
      if (layer.feature) map.removeLayer(layer);
    });
  }

  // Loads data from GeoJSON file and adds layer to map
  Map.prototype.loadGeojsonLayer = function(dataKey, geoJsonOptions) {

    // Get path to data file
    var path = this.dataFiles[dataKey];

    // Load data from file
    $.ajax({
        dataType: "json",
        geoJsonOptions: geoJsonOptions,
        url: path,
        context: this,
        success: function(data) {

            // Add the data layer to the map
            this.mapObject.addLayer(L.geoJSON(data));
        }

    });
  };

  // Update data after selection is made
  Map.prototype.selectData = function(dataKey) {
    /*
      Takes a key for a data layer and loads the data
      from the corresponding GeoJSON file.
    */

    // Clear old layers
    this.clearGeojsonLayer();

    // Add new layer
    this.loadGeojsonLayer(dataKey);
  }

  Map.prototype.addDataToMap = function (data, map, options) {
    var dataLayer = L.geoJson(data, options);
    dataLayer.addTo(map);
  };

  Map.prototype.getFillColor =   function (d) {
    var red    = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
        purple = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
        gray   = '#DEDCDC';

    return d == false   ? gray    :
           d < -0.9984  ? purple[4] :
           d < -0.992   ? purple[3] :
           d < -0.96    ? purple[2] :
           d < -0.8     ? purple[1] :
           d < -0.2     ? purple[0] :
           d <  0       ? 'white' :
           d === 0      ? 'white' :
           d <  0.2     ? 'white' :
           d <  0.8     ? red[0]  :
           d <  0.96    ? red[1]  :
           d <  0.992   ? red[2]  :
           d <  0.9984  ? red[3]  :
           d <= 1       ? red[4]  :
           gray;
  };

  // Return a reference to the map
  return(new Map( "#leMap" ));

})();