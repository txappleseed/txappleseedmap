# Texas School Discipline Disparities Map
[![Build Status](https://travis-ci.com/mscarey/txappleseedmap.svg?branch=master)](https://travis-ci.com/mscarey/txappleseedmap)

Maps for the Texas Appleseed "School to Prison Pipeline" projects:
http://txappleseed.github.io/txappleseedmap/

This map is linked from a WordPress hosted site with more information about the School to Prison Pipeline:
http://www.texasdisciplinelab.org/


## About the Data

This project documents incidents when public schools applied one of four punishments:

* EXP: Expulsions
* DAE: Disciplinary Alternative Education Program Removals
* ISS: In School Suspensions
* OSS: Out of School Suspensions

to one of ten categories of students, with the following abbreviations:

* SPE: SPECIAL EDUCATION
* ECO: ECONOMIC DISADVANTAGE
* HIS: HISPANIC
* BLA: BLACK OR AFRICAN AMERICAN
* WHI: WHITE
* IND: NATIVE AMERICAN
* ASI: ASIAN
* PCI: NATIVE HAWAIIAN/OTHER PACIFIC
* TWO: TWO OR MORE RACES
* ALL: ALL STUDENTS

For each category, the data records a count of incidents, as well as an integer scale statistic used for coloring the map. The scale statistic is in the range from 0 to 10, where 5 represents outcomes consistent with a random distribution. The number of steps above or below zero should represent how many standard deviations the actual outcome is above or below a random distribution.


School District level data comes from [disciplinary data products](http://ritter.tea.state.tx.us/adhocrpt/Disciplinary_Data_Products/Download_Region_Districts.html) and [District and Charter Detail Data](http://ritter.tea.state.tx.us/perfreport/snapshot/download.html) published on the Texas Education Agency website.

Some additional data is available from open records requests to the Texas Education Agency, but not currently in use. See Open Austin's [#texasappleseed Slack channel](https://open-austin.slack.com) for more information.


## Data Updates

This project includes a command line utility for generating the data used to populate the website each year. If you want to use the utility to generate the data yourself, use Github's "Clone or Download" button to make a copy of this project in a folder called "txappleseedmap" on your computer. Then open a command line shell on your computer and navigate to the "makedata" subfolder.

```$ cd txappleseedmap/makedata```

To set up a Python environment that can run the utility, use pipenv. If needed, follow the [pipenv installation instructions](https://pipenv.readthedocs.io/en/latest/) before you continue. Once pipenv is installed, use this pipenv command to install the Python libraries you need:

```$ pipenv install --dev```

If you need to install or manage different versions of Python in order to run the required version for this project (pipenv will give you a warning), consider [pyenv](https://github.com/pyenv/pyenv) which pipenv integrates with directly.

Next, activate the Pipenv shell. This loads a virtual environment for running the utility.

```$ pipenv shell```

Then use this command to install the utility in its virtual environment:

```$ pip install --editable .```

After that, you should be able to use the utility with the command `collectFromFile`. If you type that command by itself, the utility will look in the `data/from_agency` folder for files from the TEA to use as input, and then try to convert them to JSON files in the format used by the map. You can also add a `--help` flag to read the utility's help feature without doing anything else.

```$ collectFromFile --help```

There are a few other important options. If you don't already have the files you need from the TEA, you can use the `--download` flag and the utility will download them from the TEA before converting them to a new format.

```$ collectFromFile --download```

You can use the `-f` and `-l` flags to set the first and last years of the range that the utility should try to process. The current defaults are 2006-2016. This example would change the range to 2012-2015.

```$ collectFromFile -f 2012 -l 2015```

If you use the `--json-folders` flag, you'll get nested directories labeled by year, demographic, and punishment, with JSON files each containing the data corresponding to one possible user query. The current version of the map is set up to use data exported using the `--json-folders` flag.

```$ collectFromFile --json-folders```

If you use the `--csv` flag, instead of JSONs file you'll get a collection of nested folders containing CSVs. Each file will have the statistics to populate a map about one type of action taken against one demographic group in one year.

```$ collectFromFile --csv```

If you use the `--json` flag, you'll get one big JSON file with all the data (about 7 MB).

```$ collectFromFile --json```

## Website

This project uses leaflet.js and carto.js to [render the map](https://texasappleseed.carto.com/tables/ratiodistrictdaep_merge/public). https://carto.com/docs/
