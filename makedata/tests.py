# try moving tests to tests/ and using "python -m pytest tests/"
# not just "pytest tests.py"

import pytest

from . import collectFromFile

@pytest.fixture()
def load_year_for_testing():
    return collectFromFile.get_year(2008)

@pytest.fixture()
def load_charter_list():
    return collectFromFile.get_charters()

@pytest.fixture()
def load_empty_dict():
    return collectFromFile.make_empty_dict(2006, 2016)

def test_load_one_year():
    assert load_year_for_testing()[0][0] == 'DISTRICT'
    assert int(load_year_for_testing()[1][0]) == 31901
    assert len(load_year_for_testing()) == 74271

SHORT_DATA = [["DISTRICT","SECTION","HEADING","HEADING NAME","YR08"],
            ["184907","G-IN SCHOOL SUSPENSIONS","C24","NATIVE AMERICAN","14"],
            ["184907","G-IN SCHOOL SUSPENSIONS","C25","WHITE","509"],
            ["184907","I-SPEC. ED. EXPULSIONS","D04",
                "SPEC. ED. STUDENTS EXPELLED","-99999999"],
            ["126901", "F-OUT OF SCHOOL SUSPENSIONS", "C16", 
                "AFRICAN AMERICAN", "-99999999"],
            ["126901","B-DISCIPLINE DATA TRENDS","B03",
                "DISCRETIONARY EXPULSIONS TO JJAEP","-99999999"],
            ["126901","B-DISCIPLINE DATA TRENDS","B04",
                "COUNT OF STUDENTS EXPELLED","-99999999"]]

def test_relabel_mandatory_and_discretionary():
    assert collectFromFile.mandatory_and_discretionary(
            SHORT_DATA,2,3,1)[-2][1] == "B-DISCIPLINE DATA TRENDS"
    assert collectFromFile.mandatory_and_discretionary(
            SHORT_DATA,2,3,1)[-1][1] == "EXP"
    assert collectFromFile.mandatory_and_discretionary(
            SHORT_DATA,2,3,1)[-1][3] == "CNT"

def test_filter_year_by_column(load_year_for_testing):
    assert len(collectFromFile.filter_year_by_column(
        SHORT_DATA, 1, 
        ("IN SCHOOL SUSPENSION", "OUT OF SCHOOL SUSPENSIONS"), 
        keep_matches=True)) == 4
    
    assert len(collectFromFile.filter_year_by_column(
        load_year_for_testing, 1, 
        ("IN SCHOOL SUSPENSION", "OUT OF SCHOOL SUSPENSIONS"), 
        keep_matches=True)) == 6569

def test_int_values_for_row():
    assert collectFromFile.number_strings_to_int(SHORT_DATA[-1]) == [126901, 
        "F-OUT OF SCHOOL SUSPENSIONS", "C16", "AFRICAN AMERICAN", 1]

def test_replace_category_names_for_sample_data():
    assert collectFromFile.replace_category_names(SHORT_DATA, 3, 1)[1][1] \
            == "ISS"
    assert collectFromFile.replace_category_names(SHORT_DATA, 3, 1)[2][3] \
            == "WHI"

def test_replace_category_names_for_one_year():
    a = load_year_for_testing()
    a = collectFromFile.mandatory_and_discretionary(a,2,3,1)
    a = collectFromFile.filter_records(a,3,1)
    a = collectFromFile.replace_category_names(a,3,1)
    assert max(len(row[1]) for row in a[1:]) == 3

def test_get_demo_year():
    assert collectFromFile.get_demo_year(2008)["BLA"][5902] == 1
    assert collectFromFile.get_demo_year(2008)["WHI"][5902] == 93

def test_get_charters():
    assert 14803 in collectFromFile.get_charters()

def test_add_year_exclude_charters(load_empty_dict):
    assert 14803 not in collectFromFile.add_year_to_dict(
            2009, load_empty_dict, False, True)[2009]["ALL"]["POP"].keys()

def test_add_year_include_charters(load_empty_dict):
    assert 14803 in collectFromFile.add_year_to_dict(
            2009, load_empty_dict, True, False)[2009]["ALL"]["POP"].keys()