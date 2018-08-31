import csv

# can this be done with a dict, not a dataframe, and no pandas?

def load_region_file(apple_path):
    with open(apple_path) as csvfile:
        reader = csv.reader(csvfile)
        region_records = [row[3:] # ignoring district names for now
                          for row in reader] 
    return region_records

def get_year(year):
    year_col = "YR{}".format(str(year)[-2:])
    apple_path = './data/from_agency/by_region/REGION_{}_DISTRICT_summary_{}.csv'
    one_year = [load_region_file(apple_path.format(str(region).zfill(2),str(year)[-2:]))
                for region in range(1,21)]
    return [item for sublist in one_year for item in sublist]

a = get_year(2008)
print(a[:10])
