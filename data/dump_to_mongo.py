from bson.json_util import loads
from pymongo import MongoClient


def init_server(db_name, col):
    client = MongoClient()
    db = client[db_name]
    collection = db[col]
    return db, collection


def load_feeds_from_json(f_name):
    with open(f_name, "r") as f:
        res = loads(f.read())

    return res


if __name__ == '__main__':
    db, collection = init_server(db_name="mean", col="assets")
    num_of_files = 2

    docs = [
        "feeds_{}.json".format(i) for i in range(1, num_of_files)
    ]

    for doc in docs:
        #print(f"writing doc to DB, doc name: {doc}")
        res = load_feeds_from_json(doc)

        for item in res.values():
            collection.insert(item)