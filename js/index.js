(function(){

  "use strict";

  function Map( selector ) {

    this.mapObject = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 6
    });

    this.tileLayer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    });

    this.setUp();

  };

  Map.prototype.setUp = function () {
    var mapObject = this.mapObject,
        tileLayer  = this.tileLayer,
        addDataToMap = this.addDataToMap,
        options,
        districtDisparities2014;

    options = {
        style: function style(feature) {
            return {
                fillColor: getFillColor(Number(feature.properties.edaepPlacementsBlack)),
                weight: 1,
                opacity: 1,
                color: '#666',
                fillOpacity: 0.5,
            };
        },
    }

    // Adds tileLayer from the Map Class to the mapObject
    tileLayer.addTo(mapObject);

    // Request CSV data and store as an object
    // Request data from geosjon file and inserts data to the mapObject
    d3.queue()
      .defer(d3.csv, "data/DistrictDisparities2015.csv")
      .defer(d3.json, "data/districts_w_demo_disc2015.json")
      // .await(analyze);
      .await(function(error, incidents, geojson){
        if (error) throw error;

        var dataLayer = geojson,
            incidents = incidents;

        // dataLayer.features.forEach( function(feature) {
        //   var daepPlacementsBlack          = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "BLACK OR AFRICAN AMERICAN", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsAmericanIndian = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "AMERICAN INDIAN OR ALASKA NAT", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsAsian          = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "ASIAN", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsLatino         = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "HISPANIC/LATINO", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsPacific        = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "NATIVE HAWAIIAN/OTHER PACIFIC", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsMulti          = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "TWO OR MORE RACES", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsWhite          = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "WHITE", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsEconDis        = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "Economic Disadvantage", feature: "E-DAEP PLACEMENTS" })
        //   var daepPlacementsSpecialEdu     = _.where(incidents, { district: feature.properties.DISTRICT_C, group: "Special Education", feature: "E-DAEP PLACEMENTS" })
        //
        //   feature.properties.daepPlacementsFischerBlack          = daepPlacementsBlack.length ? daepPlacementsBlack[0].scale : null;
        //   feature.properties.daepPlacementsFischerAmericanIndian = daepPlacementsAmericanIndian.length ? daepPlacementsAmericanIndian[0].scale : null;
        //   feature.properties.daepPlacementsFischerAsian          = daepPlacementsAsian.length ? daepPlacementsAsian[0].scale : null;
        //   feature.properties.daepPlacementsFischerLatino         = daepPlacementsLatino.length ? daepPlacementsLatino[0].scale : null;
        //   feature.properties.daepPlacementsFischerPacific        = daepPlacementsPacific.length ? daepPlacementsPacific[0].scale : null;
        //   feature.properties.daepPlacementsFischerMulti          = daepPlacementsMulti.length ? daepPlacementsMulti[0].scale : null;
        //   feature.properties.daepPlacementsFischerWhite          = daepPlacementsWhite.length ? daepPlacementsWhite[0].scale : null;
        //   feature.properties.daepPlacementsFischerEconDis        = daepPlacementsEconDis.length ? daepPlacementsEconDis[0].scale : null;
        //   feature.properties.daepPlacementsFischerSpecialEdu     = daepPlacementsSpecialEdu.length ? daepPlacementsSpecialEdu[0].scale : null;
        //
        //   feature.properties.daepPlacementsPercentBlack          = daepPlacementsBlack.length ? daepPlacementsBlack[0].disparity : null;
        //   feature.properties.daepPlacementsPercentAmericanIndian = daepPlacementsAmericanIndian.length ? daepPlacementsAmericanIndian[0].disparity : null;
        //   feature.properties.daepPlacementsPercentAsian          = daepPlacementsAsian.length ? daepPlacementsAsian[0].disparity : null;
        //   feature.properties.daepPlacementsPercentLatino         = daepPlacementsLatino.length ? daepPlacementsLatino[0].disparity : null;
        //   feature.properties.daepPlacementsPercentPacific        = daepPlacementsPacific.length ? daepPlacementsPacific[0].disparity : null;
        //   feature.properties.daepPlacementsPercentMulti          = daepPlacementsMulti.length ? daepPlacementsMulti[0].disparity : null;
        //   feature.properties.daepPlacementsPercentWhite          = daepPlacementsWhite.length ? daepPlacementsWhite[0].disparity : null;
        //   feature.properties.daepPlacementsPercentEconDis        = daepPlacementsEconDis.length ? daepPlacementsEconDis[0].disparity : null;
        //   feature.properties.daepPlacementsPercentSpecialEdu     = daepPlacementsSpecialEdu.length ? daepPlacementsSpecialEdu[0].disparity : null;
        // });

        console.log(dataLayer)

        addDataToMap(geojson, mapObject, options);
      });
  };

  Map.prototype.addDataToMap = function (data, map, options) {
    var dataLayer = L.geoJson(data, options);
    dataLayer.addTo(map);
  };

  new Map( "#map" );


function getFillColor(d) {
  var red  = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
      blue = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'],
      gray = '#DEDCDC';

  return d === null   ? gray    :
         d < -0.9984  ? blue[4] :
         d < -0.992   ? blue[3] :
         d < -0.96    ? blue[2] :
         d < -0.8     ? blue[1] :
         d < -0.2     ? blue[0] :
         d <  0       ? 'white' :
         d === 0      ? 'white' :
         d <  0.2     ? 'white' :
         d <  0.8     ? red[0]  :
         d <  0.96    ? red[1]  :
         d <  0.992   ? red[2]  :
         d <  0.9984  ? red[3]  :
         d <= 1       ? red[4]  :
         gray;
}


})();
