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
DPETALLC - number count of what?
DPETBLAP - number percent of what?
DPETHISP - number percent of what?
DPETWHIP - number percent of what?
DPETINDP - number percent of what?
DPETASIP - number percent of what?
DPETPCIP - number percent of what?
DPETTWOP - number percent of what?
DPETECOP - number percent of what?
DPETSPEP - number percent of what?
```

example:
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

### District Disparities
2014 & 2015 in csv

### Ratio District
?
- ratioDistrict.csv
- ratioDistrictDAEP.csv
- ratioDistrictEXP.csv
- ratioDistrictISS.csv
- ratioDistrictOSS.csv
