(function(){

  "use strict";

  function Map( selector ) {

    this.mapObject = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 7
    });

    this.tileLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    });

    this.groups = {
      "Black"           : "BLACK OR AFRICAN AMERICAN",
      "AmericanIndian"  : "AMERICAN INDIAN OR ALASKA NAT",
      "Asian"           : "ASIAN",
      "Latino"          : "HISPANIC/LATINO",
      "Pacific"         : "NATIVE HAWAIIAN/OTHER PACIFIC",
      "Multi"           : "TWO OR MORE RACES",
      "White"           : "WHITE",
      "EconDis"         : "Economic Disadvantage",
      "SpecialEdu"      : "Special Education",
    };

    this.punishments = {
      "Expulsion" : "D-EXPULSION ACTIONS",
      "AltEdu"    : "E-DAEP PLACEMENTS",
      "OSS"       : "F-OUT OF SCHOOL SUSPENSIONS",
      "ISS"       : "G-IN SCHOOL SUSPENSIONS",
    };

    this.setUp();
  };

  Map.prototype.setUp = function () {
    var mapObject = this.mapObject,
        tileLayer  = this.tileLayer,
        addDataToMap = this.addDataToMap,
        getFillColor = this.getFillColor,
        joinIncidentsDataToJSON = this.joinIncidentsDataToJSON,
        punishments = this.punishments,
        groups = this.groups,
        options;

    options = {
      style: function style(feature) {
        return {
          fillColor: getFillColor(Number(feature.properties.OSSFischerBlack)),
          weight: 1,
          opacity: 1,
          color: '#b3b3b3',
          fillOpacity: 0.75,
        };
      },
      onEachFeature: function onEachFeature(feature, layer) {
        var percentStudentsByGroup = feature.properties.DPETBLAP,
            districtName = feature.properties.DISTNAME,
            studentCount = feature.properties.DPETALLC,
            groupName = "Black",
            punishmentsPercent = (Math.abs(feature.properties.OSSPercentBlack)).toFixed(2)*100,
            punishmentsCount = feature.properties.OSSCountBlack,
            punishmentType = "Out of School Suspension",
            popupContent;

        if (feature.properties.OSSPercentBlack){
          var moreOrLessText = feature.properties.OSSPercentBlack > 0 ? "more" : "less";

          popupContent = [
            "<span class='popup-text'>",
              percentStudentsByGroup + "% of " + districtName + "'s ",
              studentCount + " students were classified as " + groupName + ". ",
              "They received " + punishmentType + " " + punishmentsCount + " times, ",
              punishmentsPercent + "% " + moreOrLessText + " than the district average.",
            "</span>"
          ].join('');

          // Alt Popup Message
          // TODO: Delete me if I'm not needed.
          //
          // popupContent = [
          //   "<span class='popup-text'>",
          //     percentStudentsByGroup + "% of " + districtName + "'s ",
          //     studentCount + " students are " + groupName + ".",
          //     "<br>",
          //     punishmentsPercent + "% of the district's " + punishmentsCount + " ",
          //     punishmentType + " punishments went to students who are " + groupName + ".",
          //   "</span>"
          // ].join('');
        } else {
          popupContent = "<span>No Data</span>";
        }

        if (feature.properties) {
          layer.bindPopup(popupContent);
        }
      },
    };

    // Adds tileLayer from the Map Class to the mapObject
    tileLayer.addTo(mapObject);

    // Request CSV data and store as an object
    // Request data from geosjon file and inserts data to the mapObject
    d3.queue()
      .defer(d3.csv, "data/DistrictDisparities2015.csv")
      .defer(d3.json, "data/districts_w_feature_data2015.geojson")
      // .await(analyze);
      .await(function(error, incidents, geojson){
        if (error) throw error;

        var dataLayer = geojson,
            incidents = incidents;


        // This is the function I run when I want to create a new geojson with
        // more data. The end result is console logged to the JS console and I
        // use this trick to save download the output. There is a better way.
        // https://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file
        //
        // joinIncidentsDataToJSON(dataLayer, incidents, groups, punishments, "OSS");
        // joinIncidentsDataToJSON(dataLayer, incidents, groups, punishments, "AltEdu");

        console.log(dataLayer);
        addDataToMap(dataLayer, mapObject, options);
      });
  };

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

  new Map( "#map" );

})();
