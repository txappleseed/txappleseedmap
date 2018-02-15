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

The script TXSchoolData.py (in the /scripts/ directory) was used to produce DistrictDisparities2015.csv and TXDemo2015.csv for the "School to Prison Pipeline" map.

Here's an example of how the script was used to create the data files for the year 2015 in the /data/processed/ directory:

1. Download all 20 of the 2014-2015 region files from http://rptsvr1.tea.texas.gov/adhocrpt/Disciplinary_Data_Products/Download_Region_Districts.html and paste them together (as TX2015.csv). You can take a look at the example input files for the years 2014-2016 in the directory '/data/from_agency/' to see how TX2015.csv should look. Sorry this part of the process is slightly tedious and not automated.

2. Download "District and Charter Detail Data" (Snapshot 2015) "Data File (comma-delimited *.dat)" from https://rptsvr1.tea.texas.gov/perfreport/snapshot/download.html (as district2015.csv).

3. Put TX2015.csv and district2015.csv in the directory at the path '/data/from_agency/'. If you need to use a different path, change the variables "actionsPath" and "districtPath" in TXSchoolData.py.

4. Make sure you have the Python language installed, with the libraries "pandas" "re" "scipy" and "decimal"

5. Use the command line to navigate to the directory where TXSchoolData.py is located, and run it with the command "python TXSchoolData.py"

6. You'll be prompted to type the names of the files you created in steps 1-2, plus a year to append to the name of the output file.

7. The script will create two new files to use in the Appleseed map: 'DistrictDisparities[year].csv' and 'TXDemo[year].csv'.


[here for more data documentation](/data)
