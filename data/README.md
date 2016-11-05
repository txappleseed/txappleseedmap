Here is where data comes from...
https://github.com/open-austin/texasappleseed/tree/gh-pages/data

TODO link to TEA data source.

Ask questions to @mscarey :)


### TXdemo2015
The original data is saved in csv format has been exported into two other json files.
`TXdemo2015.json` has values parsed as strings. This preserves their original format from the csv.
`TXdemo2015_parsed_numbers.json` has values parsed as numbers. This as the effect of dropping leading zeros in the `"DISTRICT"` key.


```
DISTRICT - number identifier for each school district
DISTNAME - string District Name
REGION - number
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
"REGION": 7,
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
