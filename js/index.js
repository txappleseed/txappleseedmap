/*jshint esversion: 6 */

/*
The firstYear and lastYear variables are the first and last years
available in the map's drop-down menu. So, if you're able to add
2017 data to the data/ directory, you can then make that data
viewable in the map by changing the line to "lastYear = 2017;"
*/

firstYear = 2006;
lastYear = 2016;

// This section Copyright (c) 2013 Ryan Clark -- under MIT License
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

// populate year selector with choices
var yearSelector = document.querySelector('.year_selector');

// currently this adds years 2006 through 2016
for (year = firstYear; year <= lastYear; year++) {
    var yearEntry = document.createElement('option');
    yearEntry.textContent = (year - 1) + "-" + year;
    yearEntry.value = year;
    yearSelector.appendChild(yearEntry);
}
yearSelector.lastChild.selected = true;


var PageControl = (function(){
    "use strict";

    function Map( selector, yearSelector ) {

        this.punishment = "Out of School Suspensions";
        this.population = "Black/African American Students";
        this.hilight_layer = null;
        this.districtLayer = null;
        this.year = yearSelector.lastChild.value;
        this.schoolYear = $(".year_selector").find("option:selected").text();


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

    Map.prototype.getPunishmentKey = function() {
        const punishmentToProcessedDataKey = {
            "Expulsions" : "EXP",
            "Alternative Placements" : "DAE",
            "Out of School Suspensions" : "OSS",
            "In School Suspensions" : "ISS"
        };
        return punishmentToProcessedDataKey[this.punishment];
    };

    Map.prototype.getPopulationKey = function() {
        const populationToProcessedDataKey = {
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
        return populationToProcessedDataKey[this.population];
    };

    Map.prototype.getPopupContent = function (districtName, groupNameInPopup, punishmentType) {

        var popupContent;
        if (this.population == "All Students") {
            groupNameInPopup = "students";
            this.populationScope = "statewide"; }
        else {this.populationScope = "district"; }

        if (this.punishmentOfThisGroup && this.scale == -1) {
            popupContent = "The statistics for <b>" + districtName + "</b> appear to have an <b>error</b>. " +
                "They report that there were " + this.populationOfThisGroup.toLocaleString() +
                " <b>" + groupNameInPopup + "</b> and that they received " +
                this.punishmentOfThisGroup.toLocaleString() + " <b>" + punishmentType +
                "</b>, out of a " + this.populationScope + " total of " +
                ((this.punishmentTotal < 10) ? "fewer than 10" : this.punishmentTotal.toLocaleString()) + ".";
        }
        else if (this.punishmentTotal === 0 || this.populationOfThisGroup === 0) {

            popupContent = districtName + " reported that it had no <b>" +
                ((this.populationOfThisGroup === 0) ? groupNameInPopup : punishmentType) +
                "</b> for the <b>" + this.schoolYear + "</b> school year.";
        }
        else if (this.punishmentTotal !== null && this.populationOfThisGroup !== null){
            const percentStudentsByGroup = Number(this.populationOfThisGroup) * 100.0 / Number(this.populationTotal);
            const punishmentPercent = Number(this.punishmentOfThisGroup) * 100.0 / Number(this.punishmentTotal);
            popupContent = "In <b>" + districtName + "</b>, the " +
                this.populationOfThisGroup.toLocaleString() + " <b>" + groupNameInPopup + "</b> received " +
                ((0 < this.punishmentTotal && this.punishmentTotal < 10 && punishmentPercent != 0) ? "about " : "") +
                Math.min(100, Math.round(punishmentPercent*100)/100.0) + "% of the " +
                ((0 < this.punishmentTotal && this.punishmentTotal < 10) ? "fewer than 10" : this.punishmentTotal.toLocaleString()) +
                " <b>" + punishmentType + "</b> and represented " + Math.round(percentStudentsByGroup*100)/100.0 +
                "% of the " + this.populationScope + " population.";
            }
        else {
            popupContent = "Data not available in <b>" + districtName +
                "</b> for <b>" + groupNameInPopup + "</b> in the <b>" + this.schoolYear +
                "</b> school year.";
        }
        return ["<span class='popup-text'>", "</span>"].join(popupContent);
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
                else {
                    this.scale = -1;
                    this.populationOfThisGroup = null;
                    this.populationTotal = null;
                    this.punishmentOfThisGroup = null;
                    this.punishmentTotal = null;
                }

                const districtName = feature.properties.district_name;

                var popupContent = this.getPopupContent(districtName, groupNameInPopup, punishmentType);

                if (feature.properties) layer.bindPopup(popupContent);
            }.bind(this)
        };

    };

    Map.prototype.handleDataToggleClick = function (e) {
        var thisMap = e.data.context;
        thisMap.population = $(".student_characteristic_selector").find("option:selected").text();
        thisMap.punishment = $(".punishment_selector").find("option:selected").text();
        thisMap.year = $(".year_selector").find("option:selected").val();
        thisMap.schoolYear = $(".year_selector").find("option:selected").text();
        const path = "data/" + thisMap.year + "/" + thisMap.getPopulationKey() + "/" + thisMap.getPunishmentKey() + ".json";
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
            var subtitle = document.querySelector('.legend-subtitle');
            if (thisMap.population === "All Students") {
                subtitle.textContent = "COMPARED TO STATE AVERAGE";
            }
            else {subtitle.textContent = "COMPARED TO DISTRICT AVERAGE";}
            var headline = document.querySelector('h1.masthead__title');
            headline.textContent = "Disparities in " + thisMap.punishment + " (" + thisMap.schoolYear + ")";
            var headingExplanation = document.querySelector('div.masthead__content h2');
            headingExplanation.textContent = thisMap.population + ", Pre-K through 12th Grade";
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
        const path = "data/" + this.year + "/" + this.getPopulationKey() + "/" + this.getPunishmentKey() + ".json";
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
        var red    = ['#fcbba1','#fc9272','#fb6a4a','#de2d26','#aa0208'],
        purple = ['#d8daeb','#b2abd2','#8073ac','#542788','#2d004b'],
        gray   = '#707070';

        return value == 0  ? purple[4] :
        value == 1   ? purple[3] :
        value == 2   ? purple[2] :
        value == 3   ? purple[1] :
        value == 4   ? purple[0] :
        value == 5   ? 'white' :
        value == 6   ? red[0] :
        value == 7   ? red[1] :
        value == 8   ? red[2]  :
        value == 9   ? red[3]  :
        value == 10  ? red[4]  :
        gray;
    };

    // Return a reference to the map
    return(new Map( "#leMap", yearSelector ));

})();

// Handle node-style exporting for running tests or running in browser
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = PageControl;
