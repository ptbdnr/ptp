import logging
import os
import sys

import dotenv
import mongoengine
from pymongo import MongoClient

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

# Constants
HOST = os.environ.get("VULTR_MONGODB_HOST")
PORT = int(os.environ.get("VULTR_MONGODB_PORT"))
USERNAME = os.environ.get("VULTR_MONGODB_USERNAME")
PASSWORD = os.environ.get("VULTR_MONGODB_PASSWORD")
DATABASE_NAME = "defaultdb"


# Print env variables
logger.info("HOST: %s", HOST)
logger.info("PORT: %s", PORT)
logger.info("USERNAME: %s", USERNAME)
logger.info("PASSWORD len: %d", len(PASSWORD))
logger.info("DATABASE_NAME: %s", DATABASE_NAME)

# uri = f"mongodb://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}?authSource=admin"
uri = f"mongodb://{HOST}:{PORT}/{DATABASE_NAME}?authSource=admin"
mongodb_client = MongoClient(uri)

# mongodb_client = MongoClient(
#     HOST,
#     port=int(PORT),
#     username=USERNAME,
#     password=PASSWORD,
#     authSource="admin",
# )

# list databases
databases = mongodb_client.list_database_names()
logger.info("Databases %s", databases)

# Check if database exists
database_exists = False
for db in databases:
    if db == DATABASE_NAME:
        database_exists = True
        break
if not database_exists:
    logger.info("Database %s does not exist", DATABASE_NAME)
    sys.exit(1)
    mongodb_client[DATABASE_NAME].create_collection("items")
    logger.info("Database %s created", DATABASE_NAME)

class Item(mongoengine.Document):
    """Represent an item in the database."""

    name = mongoengine.StringField(required=True)
    quantity = mongoengine.IntField(required=True)

    def __repr__(self) -> str:
        """Return a string representation of the item."""
        return f"Item[{self.name}]"

mongoengine.connect(
    DATABASE_NAME,
    host=HOST,
    port=int(PORT)  ,
    username=USERNAME,
    password=PASSWORD,
    authentication_source="admin",
)

item1 = Item(name="oven", quantity=1)
item1.save()

# list items
items = Item.objects.all()
logger.info("Items %s", items)
