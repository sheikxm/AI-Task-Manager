from pymongo import MongoClient
from decouple import config

MONGO_URI = config("MONGO_URI")

client = MongoClient(MONGO_URI , connect=False)

db = client['TaskApplication']
tasks_collection = db['tasks']