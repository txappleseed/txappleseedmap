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

        this.punishmentToProcessedDataKey = {
            "Expulsion" : "EXP",
            "AltEdu"    : "DAE",
            "OSS"       : "OSS",
            "ISS"       : "ISS"
        };

        this.groupToProcessedDataKey = {
            black_or_african_american: "BLA",
            asian: "ASI",
            hispanic_latino: "HIS",
            american_indian_or_alaska_nat: "IND",
            special_education: "SPE",
            two_or_more_races: "TWO",
            white: "WHI",
            native_hawaiian_other_pacific: "PCI",
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
        this.loadData();
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
            punishmentType = this.displaypunishment[this.dataSet],
            schoolYear = this.schoolYear;

        return {

            style: function style(feature) {
                const punishment = this.punishmentToProcessedDataKey[this.dataSet];
                // temporarily hardcode the year until we have a year dropdown
                const year = '2009';
                const group = this.groupToProcessedDataKey[this.groups[this.population]];
                const selectedData = this.processedData[year][group][punishment];
                const districtData = selectedData[String(feature.properties.district_number)];
                const value = districtData ? districtData['S'] : null;
                const returnStyle = {
                        fillColor: getFillColor(value),
                        weight: 1,
                        opacity: 1,
                        color: '#b3b3b3',
                        fillOpacity: 0.6
                };
                if (value == null) {
                    returnStyle.fillPattern = stripes;
                };
                return returnStyle;
            }.bind(this),
            //popup information for each district
            onEachFeature: function onEachFeature(feature, layer) {
                const districtNumber = String(feature.properties.district_number);
                const punishment = this.punishmentToProcessedDataKey[this.dataSet];
                // temporarily hardcode the year until we have a year dropdown
                const year = '2009';
                const group = this.groupToProcessedDataKey[this.groups[this.population]];
                const populationOfThisGroup =   this.processedData[year][group]['POP'][districtNumber];
                const populationTotal =         this.processedData[year]['ALL']['POP'][districtNumber];
                const punishmentOfThisGroup =   this.processedData[year][group][punishment][districtNumber];
                const punishmentTotal =         this.processedData[year]['ALL'][punishment][districtNumber];
                const validData = (populationOfThisGroup && populationTotal && punishmentOfThisGroup && punishmentTotal);
                const districtName = feature.properties.district_name;

                var popupContent;

                if (populationOfThisGroup && populationOfThisGroup['C'] == '0') {
                    popupContent = "<span class='popup-text'>" + districtName + " reported that it had no " + groupNameInPopup + " for the <b>" + schoolYear + "</b> school year.</span>";
                }
                else if (punishmentTotal && punishmentTotal['C'] == '0') {
                    popupContent = "<span class='popup-text'>" + districtName + " reported that it had no " + punishmentType + " for the <b>" + schoolYear + "</b> school year.</span>";
                }
                else if (validData){
                    const percentStudentsByGroup = Number(populationOfThisGroup['C']) * 100.0 / Number(populationTotal['C']);
                    const punishmentPercent = Number(punishmentOfThisGroup['C']) * 100.0 / Number(punishmentTotal['C']);
                    popupContent = [
                        "<span class='popup-text'>",
                        "In <b>" + districtName + "</b>, ",
                        groupNameInPopup + " received " + Math.round(punishmentPercent*100)/100.0 + "% of " + punishmentType + " and represent ",
                         + Math.round(percentStudentsByGroup*100)/100.0 + "% of the student population ",
                        "</span>"
                    ].join('');
                }
                else {
                    popupContent = "<span class='popup-text'>Data not available in <b>" + districtName + "</b> for this student group.</span>";
                }
                if (feature.properties) layer.bindPopup(popupContent);
            }.bind(this)
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
        thiz.population = typeof $(this).data("group-id") === 'number' ? $(this).data("group-id") : $(e.target).val();
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

    // Loads data from data JSON file
    Map.prototype.loadData = function() {
        const path = "data/processed/stpp2010-2012.json";
        $.ajax({
            dataType: "json",
            url: path,
            context: this,
            success: function(data) {
                this.processedData = data;
            },
            error: function(e) {
                console.log('Failure to load json with status ' + e);
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

    Map.prototype.getFillColor =   function (value) {
        var red    = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
        purple = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
        gray   = '#DEDCDC';

        return value == 0  ? purple[5] :
        value == 1   ? purple[4] :
        value == 2   ? purple[3] :
        value == 3   ? purple[2] :
        value == 4   ? purple[1] :
        value == 5   ? 'white' :
        value == 6   ? red[1] :
        value == 7   ? red[2] :
        value == 8   ? red[3]  :
        value == 9   ? red[4]  :
        value == 10  ? red[5]  :
        gray;
    };


    // Return a reference to the map
    return(new Map( "#leMap" ));

})();
