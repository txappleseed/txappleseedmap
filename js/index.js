// Copyright (c) 2013 Ryan Clark
// https://gist.github.com/rclark/5779673
L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
        if (jsonData.type === "Topology") {
            for (key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        }
        else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});

var PageControl = (function(){
    "use strict";

    function Map( selector ) {

        // Rename 'this' for use in callbacks
        var thisMap = this;
        this.dataSet = "OSS";
        this.population = 0;
        this.hilight_layer = null;
        this.dataLayer = null;
        this.schoolYear = "2015-2016"

        this.$el = $( selector );

        this.mapObject = new L.Map('map', {
            center: [31.50, -98.41], // Johnson City
            zoom: 7
        });

        /*  this.tileLayer = L.tileLayer('https://tile.stamen.com/toner/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Stamen</a> contributors'
        }); */

            this.tileLayer = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
        });

        this.groups = [
            "black_or_african_american",
            "asian",
            "hispanic_latino",
            "american_indian_or_alaska_nat",
            "special_education",
            "two_or_more_races",
            "white",
            "native_hawaiian_other_pacific"
            //"economic_disadvantage"
        ];

        this.groupDisplayName = [
            "African American students",
            "Asian students",
            "Latino students",
            "Native American students",
            "Special Education students",
            "Students of two or More Races",
            "White students"
        ];

        this.displaypunishment = {
            "Expulsion" : "expulsion actions",
            "AltEdu"    : "alternative placements",
            "OSS"       : "out-of-school suspensions",
            "ISS"       : "in-school suspensions"
        };

      /*
        this.punishments = {
            "Expulsion" : "D-EXPULSION ACTIONS",
            "AltEdu"    : "E-DAEP PLACEMENTS",
            "OSS"       : "F-OUT OF SCHOOL SUSPENSIONS",
            "ISS"       : "G-IN SCHOOL SUSPENSIONS"
        }; */

        this.punishments = {
            "Expulsion" : "Expulsion",
            "AltEdu"    : "AltEdu",
            "OSS"       : "OSS",
            "ISS"       : "ISS"
        };

        // Dictionary that maps option values to GeoJSON data file paths
        this.dataFiles = {
            "Expulsion" : "topojson/expulsion_topo.json",
            "AltEdu"    : "topojson/altedu_topo.json",
            "OSS"       : "topojson/oss_topo.json",
            //"OSS"       : "geojson/simple_oss.geojson",
            "ISS"       : "topojson/iss_topo.json"
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

        // Default Stripes.
        this.stripes = new L.StripePattern({
            weight: 1,
            spaceWeight: .5,
            color: '#b3b3b3',
            angle: 45
        });


        this.$el.find(".selector__button").on("click", {context: this}, this.handleDataToggleClick);
        $(".student_characteristic_selector").on("change", {context: this}, this.handleDataToggleClick);

        // Attach event handler to drop-down menu to update data after
        // selection changed.
        $("#dropdown").on(
            "change",
            {context: this},
            function(event) {

                // Get the selection from the drop-down menu
                this.dataSet = $("#dropdown").find("option:selected").val();
                //console.log("In dropdown " + this.dataSet);
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
            stripes = this.stripes,
            options = this.getOptions();
        // Adds tileLayer from the Map Class to the mapObject
        stripes.addTo(mapObject); //adding pattern definition to mapObject
        tileLayer.addTo(mapObject);
        //this.requestInitialData(options);
      this.loadGeojsonLayer(this.dataSet, options);
    };


    Map.prototype.getOptions = function () {
        var getFillColor = this.getFillColor,
            sentenceCase = this.sentenceCase,
            stripes = this.stripes,
            fischerValue = this.dataSet + "_scale_" + this.groups[this.population],
            punishmentPercentValue = "percent_" + this.dataSet + "_" + this.groups[this.population],
            percentStudentsValue = "percent_students_" + this.groups[this.population],
            groupNameInPopup = this.groupDisplayName[this.population],
            displayvalue = this.displaypunishment[this.dataSet],
            schoolYear = this.schoolYear;

        return {

            style: function style(feature) {
                var value = (feature.properties[fischerValue]);
                var dname = feature.properties.district_name;
                if (value == null){
                    return {
                        fillColor: getFillColor(Number(feature.properties[fischerValue])),
                        fillPattern: stripes,
                        weight: 1,
                        opacity: 1,
                        color: '#b3b3b3',
                        fillOpacity: 0.6
                    }
                } else {
                    return {
                        fillColor: getFillColor(Number(feature.properties[fischerValue])),
                        weight: 1,
                        opacity: 1,
                        color: '#b3b3b3',
                        fillOpacity: 0.6
                    };
                }},
            //popup information for each district
            onEachFeature: function onEachFeature(feature, layer) {
                var percentStudentsByGroup = (Number(feature.properties[percentStudentsValue]))*100,
                    districtName = feature.properties.district_name,
                    groupName = groupNameInPopup,
                    punishmentPercent = (Number(feature.properties[punishmentPercentValue]))*100,
                    //punishmentsCount = (Number(feature.properties[punishmentCountValue])) || 0,
                    punishmentType = displayvalue,
                    popupContent;

                if (!isNaN(parseFloat((feature.properties[fischerValue])))){
                    popupContent = [
                        "<span class='popup-text'>",
                        "In <b>" + districtName + "</b>, ",
                        groupName + " received " + Math.round(punishmentPercent*100)/100.0 + "% of " + punishmentType + " and represent ",
                         + Math.round(percentStudentsByGroup*100)/100.0 + "% of the student population ",
                        "</span>"
                    ].join('');
                } else if (percentStudentsByGroup == 0) {
                    popupContent = "<span class='popup-text'>" + districtName + " reported that it had no " + groupName + " for the <b>" + schoolYear + "</b> school year.</span>";
                }else {
                    popupContent = "<span class='popup-text'>Data not available in <b>" + districtName + "</b> for this student group.</span>";
                }
                if (feature.properties) layer.bindPopup(popupContent);
            }
        };

        // remove existing layer for previous group
        thiz.clearGeojsonLayer.call(thiz);

        thiz.addDataToMap(dataLayer, thiz.mapObject, options)
    };
    //sets population when user clicks choice
    Map.prototype.handleDataToggleClick = function (e) {
        //remove active button style
        $(".selector__button").removeClass("selector__button--active");
        console.log("Me me me");
        var thiz = e.data.context,
            dataLayer = GEODATA;
        thiz.population = $(this).data("group-id");
        //console.log(e);
        thiz.population = $(e.target).val();

        var options = thiz.getOptions();
        //console.log(thiz);
        // change toggle button CSS to indicate "active"
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
    };

    // Loads data from GeoJSON file and adds layer to map
    Map.prototype.loadGeojsonLayer = function(dataKey, geoJsonOptions) {
        // Get path to data file
        var path = this.dataFiles[dataKey];
        //console.log(path + " is the path and " + dataKey + " is the key " + JSON.stringify(geoJsonOptions));
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

    // Update data after selection is made
    Map.prototype.selectData = function(dataKey) {
        /*
         Takes a key for a data layer and loads the data
         from the corresponding GeoJSON file.
         */

        // Clear old layers
        this.clearGeojsonLayer();
        this.dataSet = dataKey;
        /*if(typeof dataKey !== 'undefined'){
            console.log(dataKey + " in clearGeojsonLayer");
        } else {
            console.log("dataKey is undefined here in clearGeojsonLayer")
        }*/
        // Add new layer
        this.loadGeojsonLayer(dataKey, this.getOptions(dataKey,this.population));
    };

    Map.prototype.addDataToMap = function (data, map, options) {
        var districtNames = [];
        var layers = new Object();
        //var dataLayer = L.geoJson(data, options);
        this.dataLayer = new L.TopoJSON(null, options);
        this.dataLayer.addData(data);
        var thiz = this;
        for (var key in this.dataLayer._layers) {
            var dName = this.dataLayer._layers[key].feature.properties.district_name;
            if (dName) {
                districtNames.push(dName);
                layers[dName] = this.dataLayer._layers[key];
            }
        }
        this.dataLayer.addTo(map);


        //console.log(data);  //.objects.simple_oss.geometries.properties.district_name);
        //for (var n = 0; n < data.objects.simple_oss.geometries.length; n++) {
            //var dName = data.objects.simple_oss.geometries[n].properties.district_name;
            //if (dName)
                //districtNames.push(dName);
                //districtBounds[dName] = L.polygon(data.objects.simple_oss.geometries[n].geometry.coordinates).getBounds();
        //}



        // autocomplete searchbox stuff
        $("#searchbox").autocomplete({
            source: districtNames,
            select: function(event, ui){
                if(ui.item){
                    $('#searchbox').val(ui.item.value);
                }
                var hiStyle = {
                    weight: 5,
                    color: '#ceda6a',
                    opacity: 1
                };
                var layer = layers[ui.item.value];
                thiz.clearHighlight();
                thiz.hilight_layer = layer;
                layer.setStyle(hiStyle);
                map.fitBounds(layer.getBounds());
            }
        });

    };

    Map.prototype.clearHighlight = function() {
        if (this.hilight_layer != null) {
            this.dataLayer.resetStyle(this.hilight_layer);
        }
    };

    Map.prototype.getFillColor =   function (d) {
        var red    = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
        purple = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
        gray   = '#DEDCDC';


        //return d == false   ? gray    :
        return d < -0.99999  ? purple[5] :
        d < -0.9984  ? purple[4] :
        d < -0.992   ? purple[3] :
        d < -0.96    ? purple[2] :
        d < -0.8     ? purple[1] :
        d < -0.2     ? purple[0] :
        d <=  0       ? 'white' :
       // d == 0      ? 'white' :
        d <  0.2     ? 'white' :
        d <  0.8     ? red[0]  :
        d <  0.96    ? red[1]  :
        d <  0.992   ? red[2]  :
        d <  0.9984  ? red[3]  :
        d <  0.99999  ? red[4]  :
        d <= 1       ? red[5]  :
        gray;
    };


    // Return a reference to the map
    return(new Map( "#leMap" ));

})();
