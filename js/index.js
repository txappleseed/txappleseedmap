(function(){

  "use strict";

  function Map( selector ) {
    this.setUp();
  }

  console.log("no shit")

  Map.prototype.setUp = function () {
    var map_object = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 6
    });

    // Pull tiles from OpenStreetMap
    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    }).addTo(map_object);

    function addDistrictToMap(data, map) {
      var dataLayer = L.geoJson(data, {
        weight: 1,
        opacity: 1,
        color: '#666',
        fillOpacity: 0
      });

      dataLayer.addTo(map);
    }

    $.getJSON("data/schooldistricts.geojson", function(data) {
      addDistrictToMap(data, map_object);
    });
  };

  new Map( "#map" );

  console.log("sup")


})();
