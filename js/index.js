(function(){

  "use strict";

  function Map( selector ) {
    this.$el = $( selector );

    this.mapObject = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 7
    });

    this.tileLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    });

    this.groups = {
      "Black"           : "BLACK OR AFRICAN AMERICAN",
      "Asian"           : "ASIAN",
      "Latino"          : "HISPANIC/LATINO",
      "AmericanIndian"  : "AMERICAN INDIAN OR ALASKA NAT",
      "SpecialEdu"      : "Special Education",
      "Multi"           : "TWO OR MORE RACES",
      "White"           : "WHITE",
      "Pacific"         : "NATIVE HAWAIIAN/OTHER PACIFIC",
      "EconDis"         : "Economic Disadvantage",
    };

    this.groupShortHand = [
      "Black",
      "Asian",
      "Latino",
      "AmericanIndian",
      "SpecialEdu",
      "Multi",
      "White",
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

    // Request CSV data and store as an object
    // Request data from geosjon file and inserts data to the mapObject
    d3.queue()
      .defer(d3.csv, "data/DistrictDisparities2015.csv")
      .defer(d3.json, "data/districts_w_feature_data2015.geojson")
      // .await(analyze);
      .await(function(error, incidents, geojson){
        if (error) throw error;

        // This is the function I run when I want to create a new geojson with
        // more data. The end result is console logged to the JS console and I
        // use this trick to save download the output. There is a better way.
        // https://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file
        //
        // joinIncidentsDataToJSON(dataLayer, incidents, groups, punishments, "OSS");
        // joinIncidentsDataToJSON(dataLayer, incidents, groups, punishments, "AltEdu");

        console.log(geojson);
        addDataToMap(geojson, mapObject, options);

        // This is ugly, but I need to persist the geojson data so we don't have
        // to keep loading it from the file. Attaching it to the global window
        // object feels like bad practice, so forgive my ignorance.
        window.GEODATA = geojson;
      });
  };

  Map.prototype.getOptions = function (groupId) {
    var getFillColor = this.getFillColor,
        fischerValue = "OSSFischer" + this.groupShortHand[groupId],
        punishmentPercentValue = "OSSPercent" + this.groupShortHand[groupId],
        punishmentCountValue = "OSSCount" + this.groupShortHand[groupId],
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
            studentCount = feature.properties.DPETALLC,
            groupName = groupNameInPopup,
            punishmentsPercent = (Math.abs(feature.properties[punishmentPercentValue])).toFixed(2)*100,
            punishmentsCount = feature.properties[punishmentCountValue] || 0,
            punishmentType = "Out of School Suspension",
            popupContent;

        if (punishmentPercentValue){
          var moreOrLessText = feature.properties[punishmentPercentValue] > 0 ? "more" : "less";

          popupContent = [
            "<span class='popup-text'>",
              percentStudentsByGroup + "% of <b>" + districtName + "'s</b> ",
              studentCount + " students are classified as " + groupName + ". ",
              "They received " + punishmentType + " " + punishmentsCount + " times, ",
              punishmentsPercent + "% " + moreOrLessText + " than the district average.",
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
    var map = this.mapObject;

    map.eachLayer(function (layer) {
      if (layer.feature) map.removeLayer(layer);
    });
  }


  Map.prototype.addDataToMap = function (data, map, options) {
    var dataLayer = L.geoJson(data, options);
    dataLayer.addTo(map);
  };

  Map.prototype.getFillColor =   function (d) {
    var red    = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
        purple = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
        gray   = '#DEDCDC';

    return d === null   ? gray    :
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

  Map.prototype.joinIncidentsDataToJSON = function (geodata, incidents, groups, punishments, punishmentType) {
    var punishmentType = punishmentType;

    geodata.features.forEach( function(feature) {
      var district = feature.properties.DISTRICT_C;

      _.mapObject(groups, function(value, key) {
        var groupName = key;
        var punishmentName = punishmentType;
        var punishmentsByGroup = _.where(incidents, { district: district, group: value, feature: punishments[punishmentType]});

        // feature.properties[punishmentName + "Fischer" + groupName] = punishmentsByGroup.length ? punishmentsByGroup[0].scale : null;
        // feature.properties[punishmentName + "Percent" + groupName] = punishmentsByGroup.length ? punishmentsByGroup[0].disparity : null;
        feature.properties[punishmentName + "Count" + groupName] = punishmentsByGroup.length ? punishmentsByGroup[0].count : null;
      });
    });

    return geodata;
  }

  new Map( "#leMap" );

})();
