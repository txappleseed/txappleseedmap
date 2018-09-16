# When deciding how often to run these tests,
# remember that they interact with other servers.

import pytest

from makedata import collectFromFile

def test_download_region_file():
    assert 'YEAR END ENROLLMENT","225"' in collectFromFile.download_one_file(
        "https://rptsvr1.tea.texas.gov/cgi/sas/broker",
        payload = {'_service': 'marykay', 
                    '_program': 'adhoc.download_static_summary.sas',
                    'report_type':'csv',
                    'agg_level':'DISTRICT',
                    'referrer': 'Download_Region_Districts.html', 
                    '_debug':"0", 
                    'school_yr': "09", 
                    'region': "15"})[-30:]

def test_download_district_report():
    assert '14,29,4,5,2,0,0' in collectFromFile.download_one_file(
        "https://rptsvr1.tea.texas.gov/perfreport/snapshot/push.cgi",
        payload = {'level': 'district', 
                    'set': "09",
                    'suf':'.dat'})[-20:]
