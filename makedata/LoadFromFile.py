import csv
import os
import re

def load_region_file(apple_path: str) -> list:
    with open(apple_path) as csvfile:
        reader = csv.reader(csvfile)
        region_records = [row[3:] # ignoring district names for now
                          for row in reader] 
    return region_records

def get_year(year: int) -> list:
    # year_col = "YR{}".format(str(year)[-2:])
    dirname=os.path.dirname
    apple_path = os.path.join(dirname(dirname(__file__)), 
                              os.path.join('data', 'from_agency', 'by_region',
                              'REGION_{}_DISTRICT_summary_{}.csv'))
    one_year = [load_region_file(apple_path.format(str(region).zfill(2),str(year)[-2:]))
                for region in range(1,21)]
    one_year = [row for sublist in one_year for row in sublist]
    one_year[1:] = [row for row in one_year[1:]
                    if row != one_year[0] if len(row) == len(one_year[0])]
    return one_year

def filter_year_by_column(year_of_records: list, 
                          column_name: str, 
                          pattern: tuple,
                          keep_matches=False) -> list:

    column_index = year_of_records[0].index(column_name)
    year_of_records[1:] = [row for row in year_of_records[1:] 
                           if any(word in row[column_index]
                                  for word in pattern) == keep_matches]
    return year_of_records
    

def filter_records(year_of_records: list) -> list:
    # Keeping only the rows that categorize students by protected class, 
    # or that have totals.
    
    heading_name_in = ("WHITE", "AFRICAN AMERICAN", "AMERICAN INDIAN OR ALASKA NAT",
                "HISPANIC", "NATIVE HAWAIIAN", "ASIAN", "TWO OR MORE RACES", "SPEC. ED",
                "ECO. DISAD", "ECO DISAD.", "TOTAL", "DISTRICT CUMULATIVE YEAR END ENROLLMENT",             
                "MANDATORY", "DISCRETIONARY", "NATIVE AMERICAN")

    # Getting rid of rows that count students instead of incidents, or 
    # non-disadvantaged kids.
    
    heading_name_out = ("SPEC. ED. STUDENTS", "EXPULSIONS TO JJAEP", "ECO DISAD. STUDENTS",
                        "ECO. DISAD. STUDENTS", "AT RISK", "NON AT", "UNKNOWN AT",
                        "NON ECO DISAD.", "NON ECO. DISAD.")

    year_of_records = filter_year_by_column(year_of_records, 
                          "HEADING NAME", heading_name_in, keep_matches=True)

    year_of_records = filter_year_by_column(year_of_records, 
                          "HEADING NAME", heading_name_out, keep_matches=False)

    # Delete rows appearing to double-count the same expulsions.
    
    section_out = ("M-ECO. DISADV. JJAEP PLACEMENTS", "H-SPEC. ED. JJAEP EXPULSIONS",
                  "JJAEP EXPULSIONS", "DISCIPLINE ACTION COUNTS")
    
    year_of_records = filter_year_by_column(year_of_records, 
                          "SECTION", section_out, keep_matches=False)
    
    return year_of_records

a = filter_records(get_year(2008))
print(a)