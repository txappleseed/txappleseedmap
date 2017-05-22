"""

This script was used to produce DistrictDisparities2015.csv and TXDemo2015.csv for the Texas Appleseed "School to Prison Pipeline" map. If there are any errors in that dataset, they likely originated in this file.

The TEA published its District Data file in a different format for 2015, so this script has been updated. It should be working correctly for the years 2014-2016, but it could always need changes for other years. Here's an example for the year 2015:

1. Download all 20 of the 2014-2015 region files from http://rptsvr1.tea.texas.gov/adhocrpt/Disciplinary_Data_Products/Download_Region_Districts.html and paste them together (as TX2015.csv). You can take a look at the example input files for the years 2014-2016 in the directory '../data/from_agency/' to see how this file should look. Sorry this part of the process is slightly tedious and not automated.

2. Download "District and Charter Detail Data" (Snapshot 2015) "Data File (comma-delimited *.dat)" from https://rptsvr1.tea.texas.gov/perfreport/snapshot/download.html (as district2015.csv)

3. Put TX2015.csv and district2015.csv in the directory at the path '../data/from_agency/'. If you need to use a different path, change the variables "actionsPath" and "districtPath" in this script.

4. Make sure Python is installed on your machine, with the libraries "pandas" "re" "scipy" and "decimal"

5. Use the command line to navigate to the directory where this file (TXSchoolData.py) is located, and run it with the command "python TXSchoolData.py"

6. You'll be prompted to type the names of the files you created in steps 1-2, plus a year to append to the name of the output file.

7. The script will create two new files to use in the Appleseed map: 'DistrictDisparities[year].csv' and 'TXDemo[year].csv'.


"""

import pandas as pd
import re
from scipy import stats
from decimal import Decimal

year = "2016"  # put the year to use to label the output file (for 2015-16, I use "2016")
actionsPath = '../data/from_agency/'  # put the path to the discipline actions directory here
districtPath = '../data/from_agency/'  # put the path to the district demographics directory here

a = input('enter name of the discipline actions file in " + actionsPath + " (blank for "TX2016.csv") --> ')
if a == "":
    a = "TX2016.csv"
actionsPath = actionsPath + a

d = input('enter name of the district demographics file in " + districtPath + " (blank for "district2016.csv") --> ')
if d == "":
    d = "district2016.csv"
districtPath = districtPath + d

year = input('enter the year for these files (blank for "2016") --> ')
if year == "":
    year = "2016"


def actions(actionsPath):
    """
    >>> actions('../data/from_agency/TX2016.csv')[14:15]["Group Punishments"]
    39    1592
    Name: Group Punishments, dtype: int64
    """
    apple = pd.read_csv(actionsPath, low_memory=False)

    # Delete rows that repeat the headers.
    if apple["REGION"].dtype != int:
        apple = apple[apple["REGION"].str.contains("REGION") == False]

    # Changing the reference to the year in the column name might prevent bugs when adapting this for later years.
    apple = apple.rename(columns=lambda x: re.sub("YR\d\d", "Group Punishments", x))

    # deleting redundant columns
    apple = apple[['DISTRICT', 'SECTION', 'HEADING NAME', "Group Punishments"]]

    # Consolidating some of the descriptors into broader categories
    appleReplace = {"Group Punishments":
                        {-99999999: 1},
                    "SECTION": {
                        'M-ECO\. DISADV\. JJAEP PLACEMENTS|H-SPEC\. ED\. JJAEP EXPULSIONS': 'C-JJAEP EXPULSIONS',
                        'N-ECO\. DISADV\. EXPULSIONS|I-SPEC\. ED\. EXPULSIONS': 'D-EXPULSION ACTIONS',
                        'O-ECO\. DISADV\. DAEP PLACEMENTS|J-SPEC\. ED\. DAEP PLACEMENTS': 'E-DAEP PLACEMENTS',
                        'P-ECO\. DISADV\. OUT OF SCHOOL SUS.|K-SPEC\. ED\. OUT OF SCHOOL SUS\.': 'F-OUT OF SCHOOL SUSPENSIONS',
                        'Q-ECO\. DISADV\. IN SCHOOL SUS\.|L-SPEC\. ED\. IN SCHOOL SUS\.': 'G-IN SCHOOL SUSPENSIONS'},
                    "HEADING NAME": {'SPEC\. ED.*$': 'Special Education',
                                     'ECO?. DISAD.*$': 'Economic Disadvantage'}
                    }
    # print(apple.isnull().any(axis=1))

    # string columns to int
    apple = apple.astype({'DISTRICT': int, "Group Punishments": int})

    # Keeping only the rows that categorize students by protected class.
    # Also getting rid of rows that count students instead of incidents, or non-disadvantaged kids.
    patternIn = 'WHITE|BLACK OR AFRICAN AMERICAN|AMERICAN INDIAN OR ALASKA NAT|HISPANIC|NATIVE HAWAIIAN|ASIAN|TWO OR MORE RACES|SPEC. ED|ECO. DISAD|ECO DISAD.'
    patternOut = 'SPEC. ED. STUDENTS| SPEC. ED. EXPULSIONS TO JJAEP|ECO DISAD. STUDENTS|ECO. DISAD. STUDENTS|AT RISK|NON AT|UNKNOWN AT|NON SPEC. ED.|NON ECO DISAD.|NON ECO. DISAD.'
    apple = apple[apple["HEADING NAME"].str.contains(patternIn)]
    apple = apple[apple["HEADING NAME"].str.contains(patternOut) == False]

    # Delete rows appearing to double-count the same expulsions.
    apple = apple[apple["SECTION"].str.contains("JJAEP EXPULSIONS|DISCIPLINE ACTION COUNTS") == False]

    apple = apple.replace(to_replace=appleReplace, regex=True)

    return apple


def populations(districtPath):
    district = pd.read_csv(districtPath)

    # deleting redundant columns

    district = district[['DISTRICT', 'DISTNAME', 'REGION', 'DPETALLC', 'DPETBLAP', 'DPETHISP', 'DPETWHIP', 'DPETINDP',
                         'DPETASIP', 'DPETPCIP', 'DPETTWOP', 'DPETECOP', 'DPETSPEP']]

    groups = {'AMERICAN INDIAN OR ALASKA NAT': 'DPETINDP',
              'ASIAN': 'DPETASIP',
              'BLACK OR AFRICAN AMERICAN': 'DPETBLAP',
              'Economic Disadvantage': 'DPETECOP',
              'HISPANIC/LATINO': 'DPETHISP',
              'NATIVE HAWAIIAN/OTHER PACIFIC': 'DPETPCIP',
              'Special Education': 'DPETSPEP',
              'TWO OR MORE RACES': 'DPETTWOP',
              'WHITE': 'DPETWHIP'}

    # Using percentages to get counts of students in each group.

    for key in groups:
        district[key] = district["DPETALLC"] * district[groups[key]] // 100

    district = district.astype({'BLACK OR AFRICAN AMERICAN': int, 'HISPANIC/LATINO': int, 'WHITE': int,
                                'AMERICAN INDIAN OR ALASKA NAT': int, 'ASIAN': int,
                                'NATIVE HAWAIIAN/OTHER PACIFIC': int,
                                'TWO OR MORE RACES': int, 'Economic Disadvantage': int, 'Special Education': int})

    return district


def getRacePop(df, row):
    return df.ix[row["DISTRICT"]][row["HEADING NAME"]]


def getRatio(distPop, racePop, all_punishments, group_punishments):
    # Calculating ratio of punishments for the demographic group compared to the punishments for the student population
    # as a whole. For instance, "0.505" in the disparity column indicates the group got the punishment 50.5% as often
    # as average for the student population.

    """
    >>> getRatio(200, 20, 20, 10)
    4.0
    >>> getRatio(200, 20, 20, 2)
    0.0
    >>> print(getRatio(200, 0, 20, 0))
    None
    """

    if max(racePop, group_punishments) == 0 or None:
        return None
    elif all_punishments == 0 or None:
        return 0
    else:
        disparity = (group_punishments / (max(all_punishments, group_punishments)) \
                     / (max(racePop, group_punishments) / distPop)) - 1
        disparity = Decimal(disparity)
        disparity = disparity.quantize(Decimal('0.01'))
    return float(disparity)


def impossible(distPop, racePop, all_punishments, group_punishments):
    # The "RecordError" column flags implausible data entries. Some of them could still be true if school administrators
    # applied different standards different standards to determine which students belong to which demographic group.
    # Or some could be the result of students not being counted because of the time they moved in and out of district.

    """
    >>> print(impossible(5, 20, 20, 10))
    True
    >>> impossible(20, 0, 20, 0)
    False
    """

    impossible = False
    if group_punishments > all_punishments or racePop > distPop:
        impossible = True
    if racePop == 0 and group_punishments > 0:
        impossible = True
    return impossible


def getFisher(distPop, racePop, all_punishments, group_punishments):
    # I don't know if this is a valid way to report the Fisher's exact test statistic, but the idea is that if getFisher returns a
    # positive number over .95, there's a 95% chance that the group's better-than-average treatment is not due to chance.
    # If it returns a number under -.95, there's a 95% chance that the group's worse-than-average treatment is not due to chance.
    # I think it should be easier to create a color scale to show the scores on a map this way.

    # The getFisher function assumes wrongly that everyone can have only one punishment (of each type). If the number of
    # punishments exceeds the number of kids, it reduces the number of punishments (and assumes wrongly that every
    # kid has been punished) But maybe the results are still close enough to correct to use for scaling?

    """
    >>> getFisher(20, 5, 20, 10)
    0.904604
    >>> getFisher(20, 0, 20, 0)
    (None, None)
    """

    if max(racePop, group_punishments) == 0 or None:
        return None, None
    elif all_punishments == 0 or None:
        return 1, 0
    else:
        oddsratio, pvalueG = stats.fisher_exact([[racePop, max(distPop - racePop, 0)],
                                                 [group_punishments, max(all_punishments - group_punishments, 0)]],
                                                alternative='greater')
        oddsratio, pvalueL = stats.fisher_exact([[racePop, max(distPop - racePop, 0)],
                                                 [group_punishments, max(all_punishments - group_punishments, 0)]],
                                                alternative='less')
        if pvalueL < pvalueG:
            pv = 1 - pvalueL
        else:
            pv = pvalueG - 1
        pv = Decimal(pv)
        pv = pv.quantize(Decimal('0.000001'))
    return float(pv)


def combine(apple, district):
    distPop = district[['DISTRICT', 'DPETALLC']]
    appleRace = apple[apple["HEADING NAME"].str.contains("Economic Disadvantage|Special Education") == False]
    appleRace = appleRace.set_index(["DISTRICT", "SECTION"])
    appleRace["PUNISHMENTS"] = appleRace["Group Punishments"].groupby(level=['DISTRICT', 'SECTION']).sum()
    applePunishments = appleRace.reset_index()
    applePunishments = applePunishments[["DISTRICT", "SECTION", "PUNISHMENTS"]]
    applePunishments = applePunishments.drop_duplicates()
    apple = pd.merge(apple, applePunishments, on=['DISTRICT', 'SECTION'])
    apple = pd.merge(apple, distPop, how='outer', on=['DISTRICT'])
    apple = apple.dropna()  # disregarding lines with null values. They were creating errors.

    return apple


apple = actions(actionsPath)
district = populations(districtPath)
apple = combine(apple, district)

district = district.set_index("DISTRICT")

apple["DEMO POPULATION"] = apple.apply(lambda x: getRacePop(district, x), axis=1)  # Temporarily moving this
# information from the district dataframe to the punishment dataframe to make later calculations easier.

apple["Disparity"] = apple.apply(lambda x: getRatio(x["DPETALLC"], x["DEMO POPULATION"], x["PUNISHMENTS"],
                                                    x["Group Punishments"]), axis=1)

apple["LikelyError"] = apple.apply(lambda x: impossible(x["DPETALLC"], x["DEMO POPULATION"], x["PUNISHMENTS"],
                                                        x["Group Punishments"]), axis=1)

apple = apple.astype({'Group Punishments': int})

apple["Scale"] = apple.apply(lambda x: getFisher(x["DPETALLC"], x["DEMO POPULATION"], x["PUNISHMENTS"],
                                                 x["Group Punishments"]), axis=1)

apple = apple[['DISTRICT', 'SECTION', 'HEADING NAME', "Group Punishments", "Disparity", "Scale", "LikelyError"]]

district.reset_index(level=0, inplace=True)

district = district[['DISTRICT', 'DISTNAME', 'DPETALLC', 'ASIAN', 'AMERICAN INDIAN OR ALASKA NAT',
                     'NATIVE HAWAIIAN/OTHER PACIFIC', 'HISPANIC/LATINO', 'BLACK OR AFRICAN AMERICAN',
                     'TWO OR MORE RACES', 'Special Education', 'WHITE', 'Economic Disadvantage']]

DisparitiesFile = "../data/processed/DistrictDisparities" + str(year) + ".csv"
DemoFile = "../data/processed/TXdemo" + str(year) + ".csv"

apple.to_csv(path_or_buf=DisparitiesFile, columns=['DISTRICT', 'SECTION', 'HEADING NAME', "Group Punishments",
                                                   "Disparity", "Scale", "LikelyError"], index=False)

district.to_csv(path_or_buf=DemoFile, index=False)
