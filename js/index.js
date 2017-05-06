var dataLayerMain;

var PageControl = (function(){


    "use strict";

    function Map( selector ) {

        // Rename 'this' for use in callbacks
        var thisMap = this;
        this.dataSet = "OSS";
        this.population = 0;

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
            "White Students"
        ];

        this.displaypunishment = {
            "Expulsion" : "expulsion actions",
            "AltEdu"    : "alternative placements",
            "OSS"       : "out-of-school suspensions",
            "ISS"       : "in-school suspensions"
        };

        this.punishments = {
            "Expulsion" : "D-EXPULSION ACTIONS",
            "AltEdu"    : "E-DAEP PLACEMENTS",
            "OSS"       : "F-OUT OF SCHOOL SUSPENSIONS",
            "ISS"       : "G-IN SCHOOL SUSPENSIONS"
        };

        // Dictionary that maps option values to GeoJSON data file paths
        this.dataFiles = {
            "Expulsion" : "geojson/expulsion_districts.geojson",
            "AltEdu"    : "geojson/altedu_districts.geojson",
            "OSS"       : "geojson/oss_districts.geojson",
            "ISS"       : "geojson/iss_districts.geojson"
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
            {context: this},
            function(event) {

                // Get the selection from the drop-down menu
                this.dataSet = $("#dropdown").find("option:selected").val();
                console.log("In dropdown" + this.dataSet);
                // Load the data from the corresponding file
                thisMap.selectData(this.dataSet);
                $('.selector__title').html(event.data.context.displaypunishment[this.dataSet]);
            }
        );
        this.setUp();
    };
    Map.prototype.setUp = function () {
        var mapClass = this,
            mapObject = this.mapObject,
            tileLayer  = this.tileLayer,
            punishments = this.punishments,
            groups = this.groups,
            options = this.getOptions();
        // Adds tileLayer from the Map Class to the mapObject
        tileLayer.addTo(mapObject);

//    this.requestInitialData(options);
      console.log(this.dataSet);
      this.loadGeojsonLayer(this.dataSet, options);
    };
    Map.prototype.getOptions = function () {
        console.log(this.dataSet + " right now");
        var getFillColor = this.getFillColor,
            fischerValue = this.dataSet + "_scale_" + this.groups[this.population],
            punishmentPercentValue = this.dataSet + "_percent_" + this.groups[this.population],
            punishmentCountValue = this.dataSet + "_count_" + this.groups[this.population],
            percentStudentsValue = this.groupPercentCode[this.population],
            groupNameInPopup = this.groupDisplayName[this.population],
            displayvalue = this.displaypunishment[this.dataSet];
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
                    punishmentType = displayvalue,
                    popupContent;

                layer.on({
                    click : onCountryHighLight,
                    mouseout : onCountryMouseOut
                });

                // debugger

                if (feature.properties[punishmentPercentValue]){
                    var moreOrLessText = feature.properties[punishmentPercentValue] > 0 ? "more" : "less";
                    var timeOrTimes = punishmentsCount === '1' ? " time" : " times";
                    popupContent = [
                        "<span class='popup-text'>",
                        groupName + " received " + punishmentType + " ",
                        punishmentsCount + timeOrTimes,
                        " accounting for " + punishmentsPercent + "%",
                        " of all " + displayvalue,
                        " in <b>" + districtName + "</b>.",
                        "</span>"
                    ].join('');
                }
                else {
                    popupContent = "<span>Data not available on " + districtName + " for this student group.</span>";
                }

                if (feature.properties) layer.bindPopup(popupContent);
            },
        };
        var options = thiz.getOptions();
        console.log(thiz.population);
        // change toggle button CSS to indicate "active"
        $(".selector__button").removeClass("selector__button--active");
        $(this).addClass("selector__button--active");

        // remove exisiting layer for previous group
        thiz.clearGeojsonLayer.call(thiz);

        thiz.addDataToMap(dataLayer, thiz.mapObject, options)
    };
    Map.prototype.handleDataToggleClick = function (e) {
        var thiz = e.data.context,
            dataLayer = GEODATA;
        thiz.population = $(this).data("group-id");
        var options = thiz.getOptions();
        console.log(thiz);
        // change toggle button CSS to indicate "active"
        $(".selector__button").removeClass("selector__button--active");
        $(this).addClass("selector__button--active");

        // remove existing layer for previous group
        thiz.clearGeojsonLayer.call(thiz);

        thiz.addDataToMap(dataLayer, thiz.mapObject, options)
    };
    Map.prototype.clearGeojsonLayer = function(){

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
        console.log(path + " is the path and " + dataKey + " is the key " + JSON.stringify(geoJsonOptions));
        // Load data from file
        $.ajax({
            dataType: "json",
            geoJsonOptions: geoJsonOptions,
            url: path,
            context: this,
            success: function(data) {
                // Add the data layer to the map
                this.addDataToMap(data, this.mapObject, geoJsonOptions);
                window.GEODATA = data;
            },
        });

    };

    /**
 * Callback for mouse out of the country border. Will take care of the ui aspects, and will call
 * other callbacks after done.
 * @param e the event
 */
function onCountryMouseOut(e){
var layer = e.target;
layer.setStyle({
    weight: 1,
    opacity: 1,
    color: '#b3b3b3',
    fillOpacity: 0.6,
});
//callback when mouse exits a country polygon goes here, for additional actions
}

/**
 * Callback for when a country is clicked. Will take care of the ui aspects, and it will call
 * other callbacks when done
 * @param e
 */
function onCountryClick(e){
//callback for clicking inside a polygon
}

/**
 * Callback for when a country is highlighted. Will take care of the ui aspects, and it will call
 * other callbacks after done.
 * @param e
 */
function onCountryHighLight(e){
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    var countryName = e.target.feature.properties.name;
    var countryCode = e.target.feature.properties.iso_a2;
//callback when mouse enters a country polygon goes here, for additional actions
}

    // Update data after selection is made
    Map.prototype.selectData = function(dataKey) {
        /*
         Takes a key for a data layer and loads the data
         from the corresponding GeoJSON file.
         */

        // Clear old layers
        this.clearGeojsonLayer();
        this.dataSet = dataKey;
        if(typeof dataKey !== 'undefined'){
            console.log(dataKey + " in clearGeojsonLayer");
        } else {
            console.log("dataKey is undefined here in clearGeojsonLayer")
        }
        // Add new layer
        this.loadGeojsonLayer(dataKey, this.getOptions(dataKey,this.population));
    };

    Map.prototype.addDataToMap = function (data, map, options) {
        dataLayerMain = L.geoJson(data, options);
        dataLayerMain.addTo(map);

        var districtNames = [];
        for (var n = 0; n < data.features.length; n++) {
            var dName = data.features[n].properties.DISTNAME;
            if (dName)
                districtNames.push(data.features[n].properties.DISTNAME);
        }

        //console.log(districtNames);

        // autocomplete searchbox stuff
        $("#searchbox").autocomplete({
            source: districtNames,
            select: function(event, ui) {
                if(ui.item){
                    $('#searchbox').val(ui.item.value);
                }
                // do something
            }
        });

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
