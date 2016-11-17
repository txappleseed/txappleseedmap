$(".iziModal").iziModal({
  width: 700,
  radius: 10,
  padding: 20,
  group: 'products',
  loop: true
});


// A $( document ).ready() block.
$( document ).ready(function() {
  $('#modal-one').iziModal('open');
});




window.onload = function() {
    // Instantiate new map object, place it in 'map' element
    var map_object = new L.Map('map', {
        center: [31.50, -98.41], // Johnson City
        zoom: 6
    });

    // Put layer data into a JS object
    var layerSource = {
        user_name: 'texasappleseed',
        type: 'cartodb',
        sublayers: [{
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #F1EEF6;  polygon-opacity: 0.8;  line-color: #ffffff;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 7] {   polygon-fill: #91003F;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 6] {   polygon-fill: #CE1256;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 5] {   polygon-fill: #E7298A;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 4] {   polygon-fill: #DF65B0;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 3] {   polygon-fill: #C994C7;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 2] {   polygon-fill: #D4B9DA;}#ratiodistrictsignificant_placements_merge [ total_daep_placements_by_pop <= 1] {   polygon-fill: #F1EEF6;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 35] {polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc', 'j_spec_ed_daep_placements_spec_ed_daep_placements']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 35] {polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc','e_daep_placements_black_or_african_american']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 35] {polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc','e_daep_placements_asian', 'ratio_asian_daep_placements_vs_average']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 35] { polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc', 'e_daep_placements_hispanic_latino', 'ratio_hispanic_latino_daep_placements_vs_average']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 35] { polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc','e_daep_placements_american_indian_or_alaska_nat', 'ratio_american_indian_or_alaska_nat_daep_placements_vs_average']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 35] { polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc', 'e_daep_placements_two_or_more_races', 'ratio_two_or_more_races_daep_placements_vs_average']
        }, {
            sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
            cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 50] { polygon-fill: #DB6849;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 35] { polygon-fill: #F6A678;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 15] {polygon-fill: #FFD8B5;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 1.2] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= .8] {  polygon-fill: #AEE1EB;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= .6] {  polygon-fill: #64BEE1;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= .4] { polygon-fill: #2793CD;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= .2] { polygon-fill: #2166AC;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average < 0] { polygon-fill: #DDD;}',
            interactivity: ['cartodb_id', 'total_daep_placements', 'distname', 'dpetallc', 'e_daep_placements_white', 'ratio_white_daep_placements_vs_average']
        }]
    };

    // For storing the sublayers
    var sublayers = [];

    function createSelector(layer, num) {
        for (var i = 0; i < layer.getSubLayerCount(); i++) {
            if (i === num) {
                layer.getSubLayer(i).show();
            } else {
                layer.getSubLayer(i).hide();
            }
        }
        if (num === 0){
            $(otherLegend.render().el).hide()
            $(customLegend.render().el).show()
        } else{
            $(customLegend.render().el).hide()
            $(otherLegend.render().el).show()
        }

    }

    function subpopPlacements(layerNum) {
        // returns popup string for subpopulation according to layer number
        var retString = '';
        switch (layerNum) {
            case 1:
                retString = '<br><b>Special Education Student placements: </b>{{j_spec_ed_daep_placements_spec_ed_daep_placements}}';
                break;
            case 2:
                retString = '<br><b>African American Student placements: </b>{{e_daep_placements_black_or_african_american}}';
                break;
            case 3:
                retString = '<br><b>Asian Student placements: </b>{{e_daep_placements_asian}}';
                break;
            case 45:
                retString = '<br><b>Latino Student placements: </b>{{e_daep_placements_hispanic_latino}}';
                break;
            case 5:
                retString = '<br><b>Native American Student placements: </b>{{e_daep_placements_american_indian_or_alaska_nat}}';
                break;
            case 6:
                retString = '<br><b>Students of Two or More Races placements: </b>{{e_daep_placements_two_or_more_races}}';
                break;
            case 7:
                retString = '<br><b>White Student placements: </b>{{e_daep_placements_white}}';
                break;
        }
        return retString;
    }

    // Pull tiles from OpenStreetMap
    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
    }).addTo(map_object);


    cartodb.createLayer(map_object, layerSource)
        .addTo(map_object)
        .on('done', function(layer) {
            for (var i = 0; i < layer.getSubLayerCount(); i++) {
                var sublayer = layer.getSubLayer(i);
                sublayer.setInteraction(true);
                layer.leafletMap.viz.addOverlay({
                    type: 'tooltip',
                    layer: sublayer,
                    template: '<div class="cartodb-tooltip-content-wrapper"> <!-- class="cartodb-tooltip-content-wrapper"    content.data contains the field info --> <b>District: </b>{{distname}}<br><b>Total Number of Students: </b>{{dpetallc}}<br><b>Total Placements: </b>{{total_daep_placements}}' + subpopPlacements(i) + '</div>',
                    position: 'bottom|right',
                    fields: [{ name: 'name' }]
                });
            }

            $("li").on('click', function(e) {
                var num = parseInt($(e.target).attr('data-layer'));
                createSelector(layer, num, $(e.target).attr("class"));
            });
            createSelector(layer, 0);
        })
        .error(function(err) {
            console.log("error: " + err);
        });

    $(".selector__button").on('click', function(e) {
        var $this = $(this),
            layerId = $(this).data('layer');

        $('.selector__button').removeClass('selector__button--active');
        $this.addClass('selector__button--active');
        console.log("layer" + layerId);
        //createSelector(layerId);
    });


    var customLegend = new cdb.geo.ui.Legend({
        type: "custom",
        show_title: false,
        title: "",
        template: $('#legend_template').html()
    });

    var otherLegend = new cdb.geo.ui.Legend({
        type: "custom",
        show_title: false,
        title: "",
        template: $('#legend_template2').html()
    });

    var stackedLegend = new cdb.geo.ui.StackedLegend({
        legends: [customLegend, otherLegend]
    });

    $('#map').append(stackedLegend.render().el);

}
