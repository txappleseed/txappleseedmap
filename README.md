# School District Discipline Map
maps for the Texas Appleseed "School to Prison Pipeline" projects

http://txappleseed.github.io/txappleseedmap/

This map is linked from a WordPress hosted site with more information about the School to Prison Pipeline:
http://www.texasdisciplinelab.org/

## Documentation
This project uses leaflet.js and carto.js to [render the map](https://texasappleseed.carto.com/tables/ratiodistrictdaep_merge/public). https://carto.com/docs/

School District level data comes from [disciplinary data products](http://ritter.tea.state.tx.us/adhocrpt/Disciplinary_Data_Products/Download_Region_Districts.html) and [District and Charter Detail Data](http://ritter.tea.state.tx.us/perfreport/snapshot/download.html) published on the Texas Education Agency website.
Some additional data is available from open records requests to the Texas Education Agency, but not currently in use. See Open Austin's [#texasappleseed Slack channel](https://open-austin.slack.com) for more information.

### Data Preparation

The script TXSchoolData.py (in the /scripts/ directory) was used to produce DistrictDisparities2015.csv and TXDemo2015.csv for the "School to Prison Pipeline" map. The map currently displays a single year of data derived from these files.

We're interested in making data viewable from more than just the current year. Data from the years 2006-2016 is stored in /geojson/districts\_with\_data.geojson and in /topojson/districts\_with\_data.json. The TopoJSON is a smaller file but is less human-readable. These files were created with /scripts/TEAtoJSON.ipynb.


[here for more data documentation](/data)
