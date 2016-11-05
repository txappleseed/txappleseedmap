TODO link to original Texas Education Agency (TEA) data source.

Ask questions to @mscarey :)


### Texas School District Demographics
- `TXdemo2014.csv`
- `TXdemo2015.csv`
- `TXdemo2015.json`
- `TXdemo2015_parsed_numbers.json`


`TXdemo2015.json` has values parsed as strings. This preserves their original format from the csv.
`TXdemo2015_parsed_numbers.json` has values parsed as numbers. This has the effect of dropping leading zeros in the `"DISTRICT"` key.


```
DISTRICT - number identifier for each school district
DISTNAME - string District Name
REGION   - number
DPETALLC - number count of students in the district
DPETBLAP - number percent of BLA students in the district
DPETHISP - number percent of HIS students in the district
DPETWHIP - number percent of WHI students in the district
DPETINDP - number percent of IND students in the district
DPETASIP - number percent of ASI students in the district
DPETPCIP - number percent of PCI students in the district
DPETTWOP - number percent of TWO students in the district
DPETECOP - number percent of ECO students in the district
DPETSPEP - number percent of SPE students in the district
```

# example:
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

### Ratio District
?
- ratioDistrict.csv
- ratioDistrictDAEP.csv
- ratioDistrictEXP.csv
- ratioDistrictISS.csv
- ratioDistrictOSS.csv

### DistrictDisparities2015.csv
```
district - number identifier for each school district
feature - string, one of these four punishments: ["D-EXPULSION ACTIONS", "E-DAEP PLACEMENTS", "F-OUT OF SCHOOL SUSPENSIONS", "G-IN SCHOOL SUSPENSIONS"]
group - string, one of these nine demographic groups: ["AMERICAN INDIAN OR ALASKA NAT", "ASIAN", "BLACK OR AFRICAN AMERICAN", "HISPANIC/LATINO", "NATIVE HAWAIIAN/OTHER PACIFIC", "TWO OR MORE RACES", "WHITE", "Economic Disadvantage", "Special Education"]. SQL or Carto will rename this column because "group" is a reserved word.
count - number count of students within that demographic group who got that punishment in that district
disparity - the percentage difference between the punishment rate for the demographic group compared to the rate for the district's total student population (e.g. "-.5" would mean a rate 50% less than average, or "2.55" would mean 255% more than average). This variable is for creating text that explains the disparity for the user.
scale - a scaling variable in the range -1 to 1, for assigning the district a color on the map when the corresponding group/feature is selected (on a logarithmic scale, because a lot of the values are very close to -1 or 1). This variable should not be presented to the user as text.
```

# example:
```
"district": 001902,
"feature": "E-DAEP PLACEMENTS",
"group": "BLACK OR AFRICAN AMERICAN",
"count": 1,
"disparity": 6.0741,
"scale": 0.860911
```
