The CSV files in the /processed/ directory are part of a legacy workflow and hopefully won't be needed any longer. We used a Python script ("../scripts/TXSchoolData.py") to convert files published by TEA, one year at a time, into the CSV files documented below. However, the CSVs later had to be converted to GeoJSON using Ruby scripts like "../scripts/altedu_script.rb". The new approach is to convert the TEA files directly to GeoJSON using the Jupyter notebook "../scripts/TEAtoJSON.ipynb".

Below is a description of the columns of the CSVs in the /processed/ directory.

### Texas School District Demographics
- `TXdemo2015.csv`
- `TXdemo2016.csv`

- `DISTRICT` - number identifier for each school district
- `DISTNAME` - string District Name
- `REGION`   - number
- `DPETALLC` - number count of students in the district
- `DPETBLAP` - number percent of BLA students in the district
- `DPETHISP` - number percent of HIS students in the district
- `DPETWHIP` - number percent of WHI students in the district
- `DPETINDP` - number percent of IND students in the district
- `DPETASIP` - number percent of ASI students in the district
- `DPETPCIP` - number percent of PCI students in the district
- `DPETTWOP` - number percent of TWO students in the district
- `DPETECOP` - number percent of ECO students in the district
- `DPETSPEP` - number percent of SPE students in the district

##### example:
```
"DISTRICT": 183801,
"DISTNAME": "PANOLA CHARTER SCHOOL",
"REGION"  : 7,
"DPETALLC": 154,
"DPETBLAP": 7.8,
"DPETHISP": 6.5,
"DPETWHIP": 83.1,
"DPETINDP": 0.6,
"DPETASIP": 0.6,
"DPETPCIP": 0,
"DPETTWOP": 1.3,
"DPETECOP": 35.7,
"DPETSPEP": 10.4
```

### DistrictDisparities2015.csv

- `district` - number identifier for each school district
- `SECTION` - string, one of these four punishments: ["D-EXPULSION ACTIONS", "E-DAEP PLACEMENTS", "F-OUT OF SCHOOL SUSPENSIONS", "G-IN SCHOOL SUSPENSIONS"]
- `HEADING NAME` - string, one of these nine demographic groups: ["AMERICAN INDIAN OR ALASKA NAT", "ASIAN", "BLACK OR AFRICAN AMERICAN", "HISPANIC/LATINO", "NATIVE HAWAIIAN/OTHER PACIFIC", "TWO OR MORE RACES", "WHITE", "Economic Disadvantage", "Special Education"]. (The use of "Heading Name" as a column name comes from the TEA.)
- `Group Punishments` - number count of students within that demographic group who got that punishment in that district
- `Disparity` - the percentage difference between the punishment rate for the demographic group compared to the rate for the district's total student population (e.g. "-.5" would mean a rate 50% less than average, or "2.55" would mean 255% more than average). This variable is for creating text that explains the disparity for the user.
- `Scale` - a scaling variable in the range -1 to 1, for assigning the district a color on the map when the corresponding group/feature is selected (on a logarithmic scale, because a lot of the values are very close to -1 or 1). This variable should not be presented to the user as text.
- `RecordError` - a boolean value set to "True" in situations suggesting an error in the TEA's data. Specifically, if the number of punishments for a demographic group exceeds the number of punishments for all students, if the population of a demographic group exceeds the population of all students, or if some punishments have been given to a demographic group despite the population of that group being 0.

#### example:
```
"district": 1902,
"SECTION": "E-DAEP PLACEMENTS",
"HEADING NAME": "BLACK OR AFRICAN AMERICAN",
"Group Punishments": 1,
"Disparity": 6.0741,
"Scale": 0.860911
"RecordError": False

```

See the [original Texas Education Agency (TEA) data source](https://rptsvr1.tea.texas.gov/adhocrpt/Disciplinary_Data_Products/Download_Region_Districts.html).

Ask questions to @mscarey :)