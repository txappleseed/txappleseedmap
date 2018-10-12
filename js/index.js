/*jshint esversion: 6 */

// Copyright (c) 2013 Ryan Clark
// https://gist.github.com/rclark/5779673
L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
        if (jsonData.type === "Topology") {
            for (var key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        }
        else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});

const groupToProcessedDataKey = {
    "Black/African American Students": "BLA",
    "Asian Students": "ASI",
    "Latino/Hispanic Students": "HIS",
    "Indigenous American Students": "IND",
    "Special Education Students": "SPE",
    "Students of Two or More Races": "TWO",
    "White Students": "WHI",
    "Hawaiian/Pacific Students": "PCI",
    "All Students": "ALL"
};

const punishmentToProcessedDataKey = {
    "Expulsions" : "EXP",
    "Alternative Placements" : "DAE",
    "Out of School Suspensions" : "OSS",
    "In School Suspensions" : "ISS"
};

// populate year selector with choices
var yearSelector = document.querySelector('.year_selector');
// this line assumes 2016 is the last available year of data
for (year = 2006; year <= 2016; year++) {
    var yearEntry = document.createElement('option');
    yearEntry.textContent = (year - 1) + "-" + year;
    yearEntry.value = year;
    yearSelector.appendChild(yearEntry);
}
yearSelector.lastChild.selected = true;


var PageControl = (function(){
    "use strict";

    function Map( selector ) {

        // Rename 'this' for use in callbacks
        var thisMap = this;
        this.punishment = "Out of School Suspensions";
        this.population = "Black/African American Students";
        this.punishmentKey = punishmentToProcessedDataKey[this.punishment];
        this.groupKey = groupToProcessedDataKey[this.population];
        this.hilight_layer = null;
        this.districtLayer = null;
        this.year = yearSelector.lastChild.value;


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


        // Default Stripes.
        this.stripes = new L.StripePattern({
            weight: 1,
            spaceWeight: 0.5,
            color: '#b3b3b3',
            angle: 45
        });

        $(".student_characteristic_selector").on("change", {context: this}, this.handleDataToggleClick);
        $(".punishment_selector").on("change", {context: this}, this.handleDataToggleClick);
        $(".year_selector").on("change", {context: this}, this.handleDataToggleClick);

        this.setUp();
    }

    Map.prototype.setUp = function () {
        this.loadData();
        var mapObject = this.mapObject,
            tileLayer  = this.tileLayer,
            stripes = this.stripes,
            options = this.getOptions();
        // Adds tileLayer from the Map Class to the mapObject
        stripes.addTo(mapObject); //adding pattern definition to mapObject
        tileLayer.addTo(mapObject);
        //this.requestInitialData(options);
        this.loadGeojsonLayer(options);
    };


    Map.prototype.getOptions = function () {
        return {

            style: function style(feature) {
                const districtData = this.processedData[String(feature.properties.district_number)];
                const value = districtData ? districtData['S'] : null;
                return {
                        fillColor: this.getFillColor(value),
                        weight: 1,
                        opacity: 1,
                        color: '#b3b3b3',
                        fillOpacity: 0.6,
                        fillPattern: (value != null) ? null : this.stripes
                };
            }.bind(this),
            //popup information for each district
            onEachFeature: function onEachFeature(feature, layer) {
                const groupNameInPopup = this.population;
                const punishmentType = this.punishment;
                const districtNumber = String(feature.properties.district_number);
                if (districtNumber in this.processedData) {
                    this.scale = this.processedData[districtNumber].S;
                    this.populationOfThisGroup =   this.processedData[districtNumber].P;
                    this.populationTotal =         this.processedData[districtNumber].aP;
                    this.punishmentOfThisGroup =   this.processedData[districtNumber].C;
                    this.punishmentTotal =         this.processedData[districtNumber].aC;
                }

                const districtName = feature.properties.district_name;

                var popupContent;

                if (this.punishmentOfThisGroup && this.scale == -1) {
                    if (this.population == "All Students") {
                        popupContent = [
                        "<span class='popup-text'>The statistics for " + districtName + " appear to have an <b>error</b>. ",
                                    "They report that there were " + this.populationOfThisGroup.toLocaleString(),
                                    " students in the district and that they received " + this.punishmentOfThisGroup.toLocaleString(),
                                    " <b>" + punishmentType + "</b>, out of a statewide total of " + this.punishmentTotal.toLocaleString(),
                                    ".</span>"
                        ].join('');
                    }
                    else {
                        popupContent = [
                        "<span class='popup-text'>The statistics for " + districtName + " appear to have an <b>error</b>. ",
                                   "They report that there were " + this.populationOfThisGroup.toLocaleString(),
                                   " <b>" + groupNameInPopup + "</b> and that they received " + this.punishmentOfThisGroup.toLocaleString(),
                                   " <b>" + punishmentType + "</b>, out of a district total of " + this.punishmentTotal.toLocaleString(),
                                   ".</span>"
                        ].join('');
                }
                }
                else if (this.punishmentTotal === 0) {
                    const schoolYear = $(".year_selector").find("option:selected").text();
                    popupContent = "<span class='popup-text'>" + districtName + " reported that it had no " + punishmentType + " for the <b>" + schoolYear + "</b> school year.</span>";
                }
                else if (this.populationOfThisGroup === 0) {
                    const schoolYear = $(".year_selector").find("option:selected").text();
                    popupContent = "<span class='popup-text'>" + districtName + " reported that it had no " + groupNameInPopup + " for the <b>" + schoolYear + "</b> school year.</span>";
                }
                else if (this.populationTotal){
                    const percentStudentsByGroup = Number(this.populationOfThisGroup) * 100.0 / Number(this.populationTotal);
                    const punishmentPercent = Number(this.punishmentOfThisGroup) * 100.0 / Number(this.punishmentTotal);
                    if (this.population == "All Students") {
                    popupContent = [
                        "<span class='popup-text'>",
                        "In <b>" + districtName + "</b>, the " + this.populationOfThisGroup.toLocaleString(),
                        " students received " + Math.round(punishmentPercent*100)/100.0,
                        "% of the state's " + this.punishmentTotal.toLocaleString() + " <b>" + punishmentType,
                        "</b> and represented " + Math.round(percentStudentsByGroup*100)/100.0 + "% of the state's student population.",
                        "</span>"
                    ].join('');}
                    else {
                        popupContent = [
                            "<span class='popup-text'>",
                            "In <b>" + districtName + "</b>, the " + this.populationOfThisGroup.toLocaleString(),
                            " <b>" + groupNameInPopup + "</b> received " + Math.round(punishmentPercent*100)/100.0,
                            "% of the " + this.punishmentTotal.toLocaleString() + " <b>" + punishmentType,
                            "</b> and represented " + Math.round(percentStudentsByGroup*100)/100.0 + "% of the student population.",
                            "</span>"
                        ].join('');}
                }
                else {
                    const schoolYear = $(".year_selector").find("option:selected").text();
                    popupContent = [
                        "<span class='popup-text'>Data not available in <b>" + districtName,
                        "</b> for <b>" + groupNameInPopup + "</b> in the <b>" + schoolYear,
                        "</b> school year."
                    ].join('');
                }
                if (feature.properties) layer.bindPopup(popupContent);
            }.bind(this)
        };

    };

    Map.prototype.handleDataToggleClick = function (e) {
        var thisMap = e.data.context;
        thisMap.population = $(".student_characteristic_selector").find("option:selected").text();
        thisMap.punishment = $(".punishment_selector").find("option:selected").text();
        thisMap.year = $(".year_selector").find("option:selected").val();
        thisMap.punishmentKey = punishmentToProcessedDataKey[thisMap.punishment];
        thisMap.groupKey = groupToProcessedDataKey[thisMap.population];
        const path = "data/" + thisMap.year + "/" + thisMap.groupKey + "/" + thisMap.punishmentKey + ".json";
        fetch(path).then(function(response) {
            if(response.ok) {
                return response.json();
            }
                throw new Error('Network response was not ok.');
            }).then(function(data) {
                thisMap.processedData = data;
                var options = thisMap.getOptions();

                thisMap.districtLayer.setStyle(options.style);
                thisMap.districtLayer.eachLayer(function (layer) {
                    options.onEachFeature(layer.feature, layer);
                });

            });
    };


    // Loads data from GeoJSON file and adds layer to map
    Map.prototype.loadGeojsonLayer = function(geoJsonOptions) {
        // Get path to a legacy data file
        // TODO: replace with a file containing no statistics
        var path = "topojson/oss_topo.json";

        // Load data from file
        $.ajax({
            dataType: "json",
            geoJsonOptions: geoJsonOptions,
            url: path,
            context: this,
            success: function(data) {
                // Add the data layer to the map
                this.addDistrictsToMap(data, this.mapObject, geoJsonOptions);
                window.GEODATA = data;
            },
        });

    };

    // Loads data from data JSON file
    Map.prototype.loadData = function() {
        const path = "data/" + this.year + "/" + this.groupKey + "/" + this.punishmentKey + ".json";
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
    Map.prototype.selectData = function() {
        const options = this.getOptions();
        this.districtLayer.setStyle(options.style);
        this.districtLayer.eachLayer(function (layer) {
            options.onEachFeature(layer.feature, layer);
        });
    };

    Map.prototype.addDistrictsToMap = function (data, map, options) {
        var districtNames = [];
        var layers = {};
        this.districtLayer = new L.TopoJSON(null, options);
        this.districtLayer.addData(data);
        var thisMap = this;
        for (var key in this.districtLayer._layers) {
            var dName = this.districtLayer._layers[key].feature.properties.district_name;
            if (dName) {
                districtNames.push(dName);
                layers[dName] = this.districtLayer._layers[key];
            }
        }
        this.districtLayer.addTo(map);


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
                thisMap.clearHighlight();
                thisMap.hilight_layer = layer;
                layer.setStyle(hiStyle);
                map.fitBounds(layer.getBounds());
            }
        });

    };

    Map.prototype.clearHighlight = function() {
        if (this.hilight_layer != null) {
            this.districtLayer.resetStyle(this.hilight_layer);
        }
    };

    Map.prototype.getFillColor =   function (value) {
        var red    = ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
        purple = ['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
        gray   = '#707070';

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
