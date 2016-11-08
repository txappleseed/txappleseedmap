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
      .defer(d3.csv, "data/DistrictDisparities2014.csv")
      .defer(d3.json, "data/schooldistricts.geojson")
      // .await(analyze);
      .await(function(error, incidents, geojson){
        if (error) throw error;

        var dataLayer = geojson,
            incidents = incidents;

        dataLayer.features.forEach( function(feature) {
          var edaepPlacementsAmericanIndian = _.where(incidents, { district: feature.properties.district_c, group: "AMERICAN INDIAN OR ALASKA NAT", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsAsian          = _.where(incidents, { district: feature.properties.district_c, group: "ASIAN", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsBlack          = _.where(incidents, { district: feature.properties.district_c, group: "BLACK OR AFRICAN AMERICAN", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsLatino         = _.where(incidents, { district: feature.properties.district_c, group: "HISPANIC/LATINO", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsPacific        = _.where(incidents, { district: feature.properties.district_c, group: "NATIVE HAWAIIAN/OTHER PACIFIC", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsMulti          = _.where(incidents, { district: feature.properties.district_c, group: "TWO OR MORE RACES", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsWhite          = _.where(incidents, { district: feature.properties.district_c, group: "WHITE", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsEconDis        = _.where(incidents, { district: feature.properties.district_c, group: "Economic Disadvantage", feature: "E-DAEP PLACEMENTS" })
          var edaepPlacementsSpecialEdu     = _.where(incidents, { district: feature.properties.district_c, group: "Special Education", feature: "E-DAEP PLACEMENTS" })

          feature.properties.edaepPlacementsAmericanIndian = edaepPlacementsAmericanIndian.length ? edaepPlacementsAmericanIndian[0].scale : null;
          feature.properties.edaepPlacementsAsian          = edaepPlacementsAsian.length ? edaepPlacementsAsian[0].scale : null;
          feature.properties.edaepPlacementsBlack          = edaepPlacementsBlack.length ? edaepPlacementsBlack[0].scale : null;
          feature.properties.edaepPlacementsLatino         = edaepPlacementsLatino.length ? edaepPlacementsLatino[0].scale : null;
          feature.properties.edaepPlacementsPacific        = edaepPlacementsPacific.length ? edaepPlacementsPacific[0].scale : null;
          feature.properties.edaepPlacementsMulti          = edaepPlacementsMulti.length ? edaepPlacementsMulti[0].scale : null;
          feature.properties.edaepPlacementsWhite          = edaepPlacementsWhite.length ? edaepPlacementsWhite[0].scale : null;
          feature.properties.edaepPlacementsEconDis        = edaepPlacementsEconDis.length ? edaepPlacementsEconDis[0].scale : null;
          feature.properties.edaepPlacementsSpecialEdu     = edaepPlacementsSpecialEdu.length ? edaepPlacementsSpecialEdu[0].scale : null;
        });

        console.log(dataLayer)

        addDataToMap(dataLayer, mapObject, options);
      });
  };

  Map.prototype.addDataToMap = function (data, map, options) {
    var dataLayer = L.geoJson(data, options);
    dataLayer.addTo(map);
  };

  new Map( "#map" );


function getFillColor(d) {
  return d === 1          ? '#FF8080' :
         d < 1 && d > 0   ? '#FFB380' :
         d === 0          ? '#FFE680' :
         d < 0 && d !== 0 ? '#E5F57F' :
         d === 0 	        ? '#BBE47F' : 'white';
}


})();
