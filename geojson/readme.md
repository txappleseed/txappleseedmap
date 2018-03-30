## districts_with_data.geojson

This GeoJSON file should have all the information needed for the map of disparities in school discipline at texasdisciplinelab.org. It covers the years 2006-2016. At time of writing, the TEA hasn't finished publishing 2017 data.

### Example

{"type": "FeatureCollection", 
    "features": 
        [
            {'geometry': 
                {'coordinates': [[[-100.27515251768764, 34.7111389239958],
                    [-100.28657751973152, 34.71077492247225],
                    ...
                    ]],
                  'type': 'Polygon'},
              'id': 96904,
              'properties': 
                  {'DISTRICT_C': '096904',
                  'DISTRICT_N': 96904,
                  'OBJECTID': 4,
                  'NAME2': 'Memphis',
                  'DISTRICT': '096-904',
                  'OBJECTID_2': 483,
                  'DISTNAME': 'MEMPHIS ISD',
                  'REGION': 16,
                    2006: {
                        'DAE': {
                            'ALL': {
                                '%': 0.0, 
                                'C': 0, 
                                'E': 0, 
                                'S': -6}},
                       'DPETALLC': 530,
                       'DPETALLP': 0.01,
                       'DPETBLAP': 10,
                       'DPETECOP': 66.6,
                       'DPETHISP': 45,
                       'DPETSPEP': 15,
                       'DPETWHIP': 45,
                       'EXP': {
                            'ALL': {
                                '%': 0.0, 
                                'C': 0, 
                                'E': 0, 
                                'S': -1}},
                       'ISS': {
                            'ALL': {
                                '%': 0.014, 
                                'C': 247, 
                                'E': 0, 
                                'S': 3},
                            'ECO': {
                                '%': 69.231, 
                                'C': 171, 
                                'E': 0, 
                                'S': 1},
                            'HIS': {
                                '%': 68.421, 
                                'C': 169, 
                                'E': 0, 
                                'S': 6},
                            'SPE': {
                                '%': 30.364, 
                                'C': 75, 
                                'E': 0, 
                                'S': 6},
                            'WHI': {
                                '%': 19.028, 
                                'C': 47, 
                                'E': 0, 
                                'S': -6}},
                        'OSS': {
                            'ALL': {'%': 0.002, 'C': 10, 'E': 0, 'S': -6},
                            'ECO': {'%': 120.0, 'C': 12, 'E': 1, 'S': 3},
                            'HIS': {'%': 100.0, 'C': 10, 'E': 0, 'S': 5},
                            'SPE': {'%': 10.0, 'C': 1, 'E': 0, 'S': -1}}}}}]},


### Documentation by column

So far, not all fields are documented.

* id: The ID number assigned to each school district by the TEA. Used to link the TEA's district demographics to its discipline data.

* DISTRICT_C: same as id, but a string.

* DISTRICT: id as a string containing a hyphen

* DISTRICT_N: id as an integer.

* OBJECTID, OBJECTID_2: integers, purpose unknown

* NAME2, DISTNAME: variations on the name of the school district

* REGION: integer in the range 1-20. The TEA publishes its discipline data for each year in 20 separate files by region, which were combined together for this file.

* 2006: demographic and discipline data for 2006. There are also entries for the other years through 2016.

* DPETALLC: total students in the district

* DPETALLP: total students in the district as a percentage of all students in Texas

* DPETBLAP: AFRICAN AMERICAN students as a percentage of all students in the district

* DPETWHIP: WHITE students as a percentage of all students in the district

* DPETHISP: HISPANIC students as a percentage of all students in the district

* DPETINDP: AMERICAN INDIAN students as a percentage of all students in the district

* DPETASIP: ASIAN students as a percentage of all students in the district

* DPETPCIP: PACIFIC ISLANDER students as a percentage of all students in the district

* DPETTWOP: TWO OR MORE RACES students as a percentage of all students in the district

* DPETECOP: ECONOMICALLY DISADVANTAGED students as a percentage of all students in the district

* DPETSPEP: SPECIAL EDUCATION students as a percentage of all students in the district

* DAE: holds data about assignments to DAEP

* EXP: holds data about expulsions

* ISS: holds data about in-school suspensions

* OSS: holds data about out-of-school suspensions

* ALL: holds summary statistics about one of the four punishments above

* BLA, HIS, WHI, IND, ASI, PCI, TWO, ECO, SPE: holds statistics about one of the four punishments above for the corresponding demographic group

* "%": disciplinary actions taken against members of the demographic group as a percentage of the district's total. In the "ALL" category, this represents the district total as a percentage of the state total

* C: count of disciplinary actions taken against members of the demographic group. In the "ALL" category, this represents the count of disciplinary actions taken against any of the district's students.

* E: set to "1" in situations suggesting an error in the TEA's data, and "0" otherwise. Specifically, if the number of punishments for a demographic group exceeds the number of punishments for all students, if the population of a demographic group exceeds the population of all students, or if some punishments have been given to a demographic group despite the population of that group being 0.

* S: an integer scaling variable in the range -6 to 6, for assigning the district a color on the map when the corresponding group/feature is selected. Negative values indicate statistical significance of the group receiving fewer punishments than average, while positive values mean more than average. Generated by using scipy.stats.fisher_exact and putting the results in buckets with the boundaries (-0.99999,-0.9984,-0.992,-0.96,-0.8,-0.2,0.2,0.8,0.96,0.992,0.9984,0.99999).