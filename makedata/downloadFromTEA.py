# This downloads all the Texas Education Agency's district disciplinary report records.

import requests
import time

applePath = '../data/from_agency/by_region/REGION_{}_DISTRICT_summary_{}.csv'

for year in range(2006, 2018): # Change these variables when more years become available.
    for region in range(1,21):
        payload = {'_service': 'marykay', '_program': 'adhoc.download_static_summary.sas','report_type':'csv',
                   'agg_level':'DISTRICT','referrer': 'Download_Region_Districts.html', '_debug':"0", 
                   'school_yr':str(year)[-2:], 'region': str(region).zfill(2)}

        r = requests.post("https://rptsvr1.tea.texas.gov/cgi/sas/broker", 
                          verify=False, data=payload) # verify=False overrides the SSL error

        with open(applePath.format(str(region).zfill(2),str(year)[-2:]), "w") as f:
            f.write(r.text)
            f.close()
        time.sleep(1)