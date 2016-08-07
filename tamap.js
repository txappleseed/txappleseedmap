
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
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= 25] {polygon-fill: #E37853;} #ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= 10] {polygon-fill: #FECDA5;}#ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= 1.25] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= .75] {  polygon-fill: #9BD9E9;}#ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= .25] { polygon-fill: #349ED3;} #ratiodistrictsignificant_placements_merge [ ratio_eco_disadv_daep_placements_vs_average <= .1] { polygon-fill: #2166AC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 25] {polygon-fill: #E37853;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 10] {polygon-fill: #FECDA5;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= 1.25] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .75] {  polygon-fill: #9BD9E9;}#ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .25] { polygon-fill: #349ED3;} #ratiodistrictsignificant_placements_merge [ ratio_spec_ed_daep_placements_vs_average <= .1] { polygon-fill: #2166AC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 685.0] { polygon-fill: #B0182B;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 25] {polygon-fill: #E37853;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 10] {polygon-fill: #FECDA5;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= 1.25] {  polygon-fill: #F7F7F7;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .75] {  polygon-fill: #9BD9E9;}#ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .25] { polygon-fill: #349ED3;} #ratiodistrictsignificant_placements_merge [ ratio_black_or_african_american_daep_placements_vs_average <= .1] { polygon-fill: #2166AC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 685.0] { polygon-fill: #0C2C84;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 50] {polygon-fill: #225EA8;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 25] {polygon-fill: #1D91C0;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 10] {  polygon-fill: #41B6C4;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 2] {  polygon-fill: #7FCDBB;}#ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= 1] { polygon-fill: #C7E9B4;} #ratiodistrictsignificant_placements_merge [ ratio_asian_daep_placements_vs_average <= .5] { polygon-fill: #FFFFCC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 685.0] { polygon-fill: #0C2C84;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 50] {polygon-fill: #225EA8;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 25] {polygon-fill: #1D91C0;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 10] {  polygon-fill: #41B6C4;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 2] {  polygon-fill: #7FCDBB;}#ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= 1] { polygon-fill: #C7E9B4;} #ratiodistrictsignificant_placements_merge [ ratio_hispanic_latino_daep_placements_vs_average <= .5] { polygon-fill: #FFFFCC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 685.0] { polygon-fill: #0C2C84;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 50] {polygon-fill: #225EA8;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 25] {polygon-fill: #1D91C0;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 10] {  polygon-fill: #41B6C4;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 2] {  polygon-fill: #7FCDBB;}#ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= 1] { polygon-fill: #C7E9B4;} #ratiodistrictsignificant_placements_merge [ ratio_american_indian_or_alaska_nat_daep_placements_vs_average <= .5] { polygon-fill: #FFFFCC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 685.0] { polygon-fill: #0C2C84;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 50] {polygon-fill: #225EA8;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 25] {polygon-fill: #1D91C0;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 10] {  polygon-fill: #41B6C4;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 2] {  polygon-fill: #7FCDBB;}#ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= 1] { polygon-fill: #C7E9B4;} #ratiodistrictsignificant_placements_merge [ ratio_two_or_more_races_daep_placements_vs_average <= .5] { polygon-fill: #FFFFCC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          },
          {
              sql: "SELECT * FROM ratiodistrictsignificant_placements_merge",
              cartocss: '#ratiodistrictsignificant_placements_merge{polygon-fill: #FFFFCC; polygon-opacity: 0.8; line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 685.0] { polygon-fill: #0C2C84;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 50] {polygon-fill: #225EA8;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 25] {polygon-fill: #1D91C0;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 10] {  polygon-fill: #41B6C4;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 2] {  polygon-fill: #7FCDBB;}#ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= 1] { polygon-fill: #C7E9B4;} #ratiodistrictsignificant_placements_merge [ ratio_white_daep_placements_vs_average <= .5] { polygon-fill: #FFFFCC;}',
              interactivity: ['cartodb_id','total_daep_placements_by_pop','distname', 'dpetallc']
          }]
        };

        // For storing the sublayers
        var sublayers = [];

        function createSelector(layer,num) {
          for (var i = 0; i < layer.getSubLayerCount(); i++) {
            if (i === num) {
              layer.getSubLayer(i).show();

            } else {
              layer.getSubLayer(i).hide();
            }
          }
          $(allLegend.render().el).hide();
          $(Legend2.render().el).hide();
          if (num === 0) (
                  $(allLegend.render().el).show()
          );
          else(
                  $(Legend2.render().el).show()
          )
        };

        // Pull tiles from OpenStreetMap
        L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Stamen</a> contributors'
        }).addTo(map_object);

        cartodb.createLayer(map_object, layerSource)
                .addTo(map_object)
                .done(function(layer) {
                  for (var i = 0; i < layer.getSubLayerCount(); i++) {
                  var sublayer = layer.getSubLayer(i);
                      sublayer.setInteraction(true)
                    layer.leafletMap.viz.addOverlay({
  type: 'tooltip',
  layer: sublayer,
  template: '<div class="cartodb-tooltip-content-wrapper"> <!-- content.data contains the field info --> <h4>City: </h4><p>{{distname}}</p></div>', 
  position: 'bottom|right',
  fields: [{ name: 'name' }]
  });

                 
                    
                    
                    
                    
                     
                    
                  }
                  
          
          
          
          
          
          $("li").on('click', function(e) {
                    var num = +$(e.target).attr('data');
                    $("li").css('background-color', '#FFFFFF');
                    $("li").hover(function() {
                      $(this).css("background-color", "#E5E5E5");
                    }, function() {
                      $(this).css("background-color", "#FFFFFF");
                    });
                    $(e.target).css('background-color', '#C1C1C1');
                    $(e.target).unbind("mouseenter mouseleave");
				    console.log("layer" + num);
                    createSelector(layer, num, $(e.target).attr("class"));
                  });
                  createSelector(layer, 0, "");
                  $("li[data='0']").css('background-color', '#C1C1C1');
                })
                .error(function(err) {
                  console.log("error: " + err);
                });

        var Legend2 = new cdb.geo.ui.Legend.Density({
          title: "Inequity Level, per district",
          left: "0", right: "over 50", colors: [ "#2166AC", "#349ED3", "#9BD9E9", "#F7F7F7", "#FECDA5", "#E37853", "#B0182B" ]
        });
        $('#map').append(Legend2.render().el);

             $("li").on('click', function(e) {
                 var num = +$(e.target).attr('data');
                 $("li").css('background-color', '#FFFFFF');
                 $("li").hover(function() {
                     $(this).css("background-color", "#E5E5E5");
                 }, function() {
                     $(this).css("background-color", "#FFFFFF");
                 });
                 $(e.target).css('background-color', '#C1C1C1');
                 $(e.target).unbind("mouseenter mouseleave");
                 console.log("layer" + num);
                 createSelector(layer, num, $(e.target).attr("class"));
             });
             createSelector(layer, 0, "");
             $("li[data='0']").css('background-color', '#C1C1C1');
         })
         .error(function(err) {
             console.log("error: " + err);
         });

      // Hide the other legends by default
      $(Legend2.render().el).hide()
        //legend for overall stats which will display on load
        var allLegend = new cdb.geo.ui.Legend.Density({
          title:   "Number of Placements per 100 Students, Per District",
          left: "0", right: "7", colors: [ "#F1EEF6", "#D4B9DA", "#C994C7", "#DF65B0", "#E7298A", "#CE1256", "#91003F"  ]
        });
        $('#map').append(allLegend.render().el);

      }
    
