import csv
import logging
import os

def load_region_file(apple_path: str) -> list:
    with open(apple_path) as csvfile:
        reader = csv.reader(csvfile)
        region_records = [row[3:] # ignoring district names for now
                          for row in reader] 
    return region_records

def get_year(year: int) -> list:
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


def mandatory_and_discretionary(year_of_records: list, 
                                code_index: int, 
                                demo_index: int, 
                                punishment_index: int) -> list:

    code_headings = {
        "B04": ("EXP", "CNT"),
        "B05": ("EXP", "MAN"),
        "B06": ("EXP", "DIS"),
        "B07": ("DAE", "CNT"),
        "B08": ("DAE", "MAN"),
        "B09": ("DAE", "DIS"),
        "B10": ("ISS", "CNT"),
        "B11": ("ISS", "MAN"),
        "B12": ("ISS", "DIS"),
        "B13": ("OSS", "CNT"),
        "B14": ("OSS", "MAN"),
        "B15": ("OSS", "DIS"),
        "D05": ("EXP", "SPE"),
        "D06": ("EXP", "NON"),
        "D08": ("DAE", "SPE"),
        "D09": ("DAE", "NON"),
        "D11": ("OSS", "SPE"),
        "D12": ("OSS", "NON"),
        "D14": ("ISS", "SPE"),
        "D15": ("ISS", "NON"),
        "E06": ("EXP", "ECO"),
        "E10": ("DAE", "ECO"),
        "E14": ("OSS", "ECO"),
        "E18": ("ISS", "ECO"),

    }

    for row in year_of_records:
        if row[code_index] in code_headings:
            row[punishment_index] = code_headings[row[code_index]][0]
            row[demo_index] = code_headings[row[code_index]][1]
    return year_of_records


def filter_year_by_column(year_of_records: list, 
                          column_index: int, 
                          pattern: tuple,
                          keep_matches: bool = False) -> list:
    
    log = logging.getLogger(__name__)
    log.debug(f'{sum(row[3] == "SPE" for row in year_of_records)}'
        ' SPE rows before filtering')

    if keep_matches:
        year_of_records[1:] = [row for row in year_of_records[1:] 
                                if any(word in row[column_index]
                                    for word in pattern)]
    else:
        year_of_records[1:] = [row for row in year_of_records[1:] 
                        if all(word not in row[column_index]
                            for word in pattern)]
        
    log.debug(f'{sum(row[3] == "SPE" for row in year_of_records)}'
        ' SPE rows after filtering')

    return year_of_records
    

def filter_records(year_of_records: list, 
                   demo_index: int,
                   punishment_index: int) -> list:

    # Keeping only the rows that categorize students by protected class, 
    # or that have totals.
    
    heading_name_in = ("WHITE", 
                       "AFRICAN AMERICAN", 
                       "AMERICAN INDIAN OR ALASKA NAT",
                       "HISPANIC", 
                       "NATIVE HAWAIIAN", 
                       "ASIAN", 
                       "TWO OR MORE RACES", 
                       "SPEC. ED",
                       "ECO. DISAD", 
                       "ECO DISAD.", 
                       "TOTAL", 
                       "DISTRICT CUMULATIVE YEAR END ENROLLMENT",    
                       "MANDATORY", 
                       "DISCRETIONARY", 
                       "NATIVE AMERICAN",
                       "NON",
                       "SPE",
                       "MAN",
                       "DIS")

    year_of_records = filter_year_by_column(year_of_records, 
                          demo_index, heading_name_in, keep_matches=True)

    # Getting rid of rows that count students instead of incidents, or 
    # non-disadvantaged kids.
    
    heading_name_out = ("SPEC. ED. STUDENTS", 
                        "EXPULSIONS TO JJAEP", 
                        "ECO DISAD. STUDENTS",
                        "ECO. DISAD. STUDENTS", 
                        "AT RISK", 
                        "NON AT", 
                        "UNKNOWN AT",
                        "UNKNOWN ECO STATUS",
                        "NON ECO DISAD.", 
                        "NON ECO. DISAD.",
                        "REMOVAL",
                        "MANSLAUGHTER",
                        "DISTRICT DISCIPLINE POPULATION",
                        "DISTRICT DISCIPLINE RECORD COUNT",
                        "DIST EMPL",
                        "DISTRICT EMPLOYEE",
                        "NON-TITLE",
                        "NON-ILLEGAL")


    year_of_records = filter_year_by_column(year_of_records, 
                          demo_index, heading_name_out, keep_matches=False)

    # Delete rows appearing to double-count the same expulsions.
    
    section_out = ("M-ECO. DISADV. JJAEP PLACEMENTS", 
                   "H-SPEC. ED. JJAEP EXPULSIONS",
                   "JJAEP EXPULSIONS", 
                   "DISCIPLINE ACTION COUNTS")
    
    year_of_records = filter_year_by_column(year_of_records, 
                         punishment_index, section_out, keep_matches=False)
    
    return year_of_records


def replace_category_names(year_of_records: list,
                           demo_index: int, 
                           punishment_index: int) -> list:
    headings = {
        "SECTION": {
            'A-PARTICIPATION': 'POP',
            'D-EXPULSION ACTIONS': 'EXP', 
            'N-ECO. DISADV. EXPULSIONS': 'EXP',
            'I-SPEC. ED. EXPULSIONS': 'EXP',
            'E-DAEP PLACEMENTS': 'DAE',
            'O-ECO. DISADV. DAEP PLACEMENTS': 'DAE',
            'J-SPEC. ED. DAEP PLACEMENTS': 'DAE',
            'F-OUT OF SCHOOL SUSPENSIONS': 'OSS',
            'P-ECO. DISADV. OUT OF SCHOOL SUS.': 'OSS',
            'K-SPEC. ED. OUT OF SCHOOL SUS.': 'OSS',
            'G-IN SCHOOL SUSPENSIONS': 'ISS',
            'Q-ECO. DISADV. IN SCHOOL SUS.': 'ISS',
            'L-SPEC. ED. IN SCHOOL SUS.': 'ISS',
            },
        "HEADING NAME": {
            'SPEC. ED.': 'SPE',
            'SPEC. EDU.': 'SPE',
            'SPEC. EDUCATION': 'SPE',
            'ECO. DISAD.': 'ECO',
            'ECON. DISAD.': 'ECO',
            'ECO. DISADV.': 'ECO',
            'HIS/LATINO': 'HIS',
            'HISPANIC/LATINO': 'HIS',
            'HISPANIC': 'HIS',
            'BLACK OR AFRICAN AMERICAN': 'BLA',
            'BLACK/AFRICAN AMERICAN': 'BLA',
            'AFRICAN AMERICAN': 'BLA',
            'WHITE': 'WHI',
            'NATIVE AMERICAN':'IND',
            'AMERICAN INDIAN OR ALASKA NAT': 'IND',
            'ASIAN': 'ASI',
            'NATIVE HAWAIIAN/OTHER PACIFIC': 'PCI',
            'TWO OR MORE RACES': 'TWO',
            'DISTRICT CUMULATIVE YEAR END ENROLLMENT': 'ALL',
                        }
        }
    for row in year_of_records[1:]:
        if len(row[demo_index]) > 3:
            row[demo_index] = headings["HEADING NAME"][row[demo_index]]
        if len(row[punishment_index]) > 3:
            row[punishment_index] = headings["SECTION"][row[punishment_index]]
    return year_of_records

    
def number_strings_to_int(row: list) -> list:   
    row[0] = int(row[0]) # DISTRICT
    
    row[-1] = int(row[-1]) # YR[XX]
    if row[-1] < -8: # -999+ is a masked value meaning "1 to 4"
        row[-1] = 1
    return row

def make_empty_dict(first_year: int, last_year: int) -> dict:
    # measurements = {"POP", "ISS", "OSS", "EXP", "DAE"}
    demos = {'SPE', 'ECO', 'HIS', 'BLA', 'WHI', 'IND', 
             'ASI', 'PCI', 'TWO', 'ALL', 'NON', 'MAN', 'DIS'}
    return {year: {demo: {} for demo in demos} 
            for year in range(first_year, last_year + 1)}


def make_year_of_records(year: int) -> list:
    
    year_of_records = get_year(year)
    demo_index = year_of_records[0].index("HEADING NAME")
    code_index = year_of_records[0].index("HEADING")
    punishment_index = year_of_records[0].index("SECTION")

    year_of_records = mandatory_and_discretionary(year_of_records, code_index,
                                                demo_index, punishment_index)
    year_of_records = filter_records(year_of_records, demo_index,
                                    punishment_index)
    year_of_records[1:] = [number_strings_to_int(row) 
                           for row in year_of_records[1:]]
    return replace_category_names(year_of_records,
                                  demo_index, punishment_index)


def get_charters() -> set:
    charters = set()
    dirname=os.path.dirname
    district_path = os.path.join(dirname(dirname(__file__)), 
                            os.path.join('data', 'from_agency', 'districts',
                            'district2016.dat'))
    with open(district_path) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row["COMMTYPE"] == "Charters":
                charters.add(int(row["DISTRICT"]))
    return charters


def punishment_totals_for_year(year: int, d: dict) -> dict:

    # Trying two methods to get total disciplinary actions per district:
    # adding up "Mandatory" and "Discretionary" actions (which are not always 
    # reported), and adding up actions against special ed and non-special ed 
    # students. Relying on whichever number is higher, on the assumption that
    # if actions are reported anywhere, they probably really happened.

    for action in ("ISS", "OSS", "EXP", "DAE"):
        for district in set(d[year]["WHI"][action].keys() | 
                            d[year]["BLA"][action].keys()):
            sn = d[year]["SPE"].get(action, {}).get(district, 0)
            sn += d[year]["NON"].get(action, {}).get(district, 0)
            md = d[year]["MAN"].get(action, {}).get(district, 0)
            md += d[year]["DIS"].get(action, {}).get(district, 0)
            if action not in d[year]["ALL"]:
                d[year]["ALL"][action] = {}
            d[year]["ALL"][action][district] = max(sn, md)
    d[year].pop("NON", None)
    d[year].pop("MAN", None)
    d[year].pop("DIS", None)
    return d

     
def get_demo_year(year: int) -> dict:
    dirname=os.path.dirname
    district_path = os.path.join(dirname(dirname(__file__)), 
                            os.path.join('data', 'from_agency', 'districts',
                            f'district{year}.dat'))
    demos = {'SPE', 'ECO', 'HIS', 'BLA', 'WHI', 'IND', 
             'ASI', 'PCI', 'TWO'}

    # dropping 'DPETALLC', which is also a measure of district population,
    # but isn't what TEA uses in the discipline reports processed above.

    demo_dict = {demo: {} for demo in demos}
    with open(district_path) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            for demo in demos:
                if f"DPET{demo}P" in reader.fieldnames:
                    demo_dict[demo][int(row["DISTRICT"])] = float(
                            row[f"DPET{demo}P"])
    return demo_dict


def add_demo_populations(year: int, d: dict) -> dict:
    demo_dict = get_demo_year(year)
    for demo in (demo for demo in demo_dict if demo != "ALL"):
        if "POP" not in d[year][demo]:
            d[year][demo]["POP"] = {}
        for district in demo_dict[demo]:
            if d[year]["ALL"]["POP"].get(district, None):
                d[year][demo]["POP"][district] = int(
                        d[year]["ALL"]["POP"][district] 
                        * demo_dict[demo][district] // 100)
    return d


def add_statewide_totals(year: int, d: dict) -> dict:
    for demo in d[year]:
        for punishment in d[year][demo]:
            d[year][demo][punishment][0] = sum(
                d[year][demo][punishment].values()
            )
    return d

def add_year_to_dict(year: int,
                     d: dict,
                     include_charters: bool = False,
                     include_traditional: bool = True) -> dict:      
    
    year_of_records = make_year_of_records(year)
    demo_index = year_of_records[0].index("HEADING NAME")
    punishment_index = year_of_records[0].index("SECTION")                               
    charters = get_charters()
    for row in year_of_records[1:]:
        if row[punishment_index] not in d[year].get(row[demo_index], {}):
            d[year][row[demo_index]][row[punishment_index]] = {}
        if row[0] in charters and include_charters:
            d[year][row[demo_index]][row[punishment_index]][row[0]] = row[-1]
        if row[0] not in charters and include_traditional:
            d[year][row[demo_index]][row[punishment_index]][row[0]] = row[-1]
    d = punishment_totals_for_year(year, d)
    d = add_demo_populations(year, d)
    d = add_statewide_totals(year, d)

    return d



if __name__ == "__main__":
    year = 2009
    log = logging.getLogger(__name__)
    logging.basicConfig(level=os.environ.get("LOGLEVEL", "DEBUG"))
    # log.debug(filter_records(mandatory_and_discretionary(get_year(2009),2,3,1),3,1)
    # print(get_demo_year(2009))
    d = make_empty_dict(2006, 2016)
    d = add_year_to_dict(year, d)


    log.debug(d[year]["BLA"])
    
# year_col = "YR{}".format(str(year)[-2:])
