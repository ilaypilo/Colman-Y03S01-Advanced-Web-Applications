# -*- coding: utf-8 -*-
from bson.json_util import loads
from pymongo import MongoClient
from bson.code import Code
import requests
import lxml
import lxml.html
from datetime import datetime


#URL = "http://homeprices.yad2.co.il/street/%D7%9B%D7%A4%D7%A8-%D7%A1%D7%91%D7%90/%D7%A8%D7%95%D7%98%D7%A9%D7%99%D7%9C%D7%93"
URL = "http://homeprices.yad2.co.il/street/כפר-סבא/רוטשילד"

HEADERS = {
    "Connection": "keep-alive",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9,he;q=0.8",
    "Cookie": "SPSI=4fb48720f779bb8b8e522997063123e4; sbtsck=jav; UTGv2=h433685f4b0feae33772f7ad7586644b5d84; PHPSESSID=9l7a80r4m7aqtcje6ivce2hsk4; y2018-2-cohort=85; y2018-2-access=true; _ga=GA1.3.1207357502.1545424959; _gid=GA1.3.1621445391.1545424959; use_elastic_search=1; yad2_session=BBulquXqQ7UaWMknD05ZdD4Ie72CMZbHSWkPLz1r; fitracking_12=no; fi_utm=direct%7Cdirect%7C%7C%7C%7C; __gads=ID=58a86ba80b7c2dc3:T=1545424963:S=ALNI_MYhs8qKUhqU3xB9Ueg09FjaD-buXg; _hjIncludedInSample=1; sp_lit=fqXCzvSImMG7tXZpXwcveQ==; PRLST=Le; adOtr=84WW40bf277; favorites_userid=fbj9587662061; yad2upload=520093706.38005.0000; spcsrf=7f6b23025a40f9853eb807273025ea90"
}

def init_db(name):
    client = MongoClient()
    db = client[name]
    return db


if __name__ == '__main__':
    db = init_db(name="mean")

    res = db.assets.find({},{"city": 1, "street": 1})
    # distinct
    res = {v['city']+v['street']:v for v in res}.values()
    print "number of streets:", len(res)
    # drop all before crawl
    db.deals.drop()
    deals = []
    index = 0
    for q in res:
        index+=1
        url =  u"http://homeprices.yad2.co.il/street/{}/{}".format(q['city'], q['street'])
        print "%d/%d, url: %s" % (index, len(res), url)

        r = requests.get(url, headers=HEADERS)
        html = lxml.html.fromstring(r.content)

        tr_xpath = lxml.etree.XPath("//*[@class='data_tr']")
        td_xpath = lxml.etree.XPath("td/a/div/text()")
        url_res = []
        for row in tr_xpath(html):
            td = td_xpath(row)
            # check the row size
            if len(td) == 9:
                # filter relative part from results
                if not td[7].strip():
                    url_res.append({
                        "sale_date" : datetime.strptime(td[0].strip(), '%d-%m-%Y').strftime('%Y-%m-%dT%H:%M:%S.000Z'),
                        "city" : q['city'],
                        "street" : q['street'],
                        "address" : td[1].strip(),
                        "asset_type" : td[2].strip(),
                        "rooms" : td[3].strip(),
                        "floor" : td[4].strip(),
                        "year" : td[5].strip(),
                        "square_meters" : td[6].strip(),
                        "price" : td[8].strip()
                    })
        print "res from url:", len(url_res)
        deals.extend(url_res)

    print "total:", len(deals)
    print "dump to mongo"
    for deal in deals:
        db.deals.insert(deals)
