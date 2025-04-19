from __future__ import annotations

import json
import logging
import os
import sys
from pathlib import Path
from typing import Optional

import dotenv
import mongoengine
from pymongo import MongoClient, ReturnDocument, database
from bson.objectid import ObjectId

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

dotenv.load_dotenv(".env.local")

# Constants
TMP_DIR = Path("./.tmp")
COLLECTION_NAME = "meals"

class NoSQLMongoClient:
    """MongoDB NoSQL database."""

    client: MongoClient
    db: database.Database

    def __init__(
            self,
            connection_string: Optional[str] = None,
            db_name: Optional[str] = None,
    ) -> None:
        """Initialize instance."""
        connection_string = connection_string or os.environ.get("MONGODB_CONNECTION_STRING")
        self.db_name = db_name or os.environ.get("MONGODB_DATABASE_NAME")
        logger.debug("MongoDB connection parameters: %s", {
            "connection_string": connection_string,
            "db_name": self.db_name,
        })

        self.client = MongoClient(connection_string)
        logger.info("MongoDB client created")
        self.db = self.client[self.db_name]
        logger.info("MongoDB database %s selected", self.db_name)

    def create_collection(
            self,
            collection_name: str,
            drop_old_database: bool = False,
            drop_old_collection: bool = False,
    ) -> database.Collection:
        """Create a collection."""
        if self.client is None:
            msg = "MongoDB client not found"
            raise ValueError(msg)

        if drop_old_database:
            self.client.drop_database(self.db_name)
        self.db = self.client[self.db_name]

        collection_names = self.db.list_collection_names()
        if drop_old_collection and collection_name in collection_names:
            self.db.drop_collection(collection_name)
        if collection_name not in self.db.list_collection_names():
            self.db.create_collection(collection_name)
        return self.db[collection_name]

    def insert(
            self,
            collection_name: str,
            payload: dict,
    ) -> dict:
        """Insert a payload."""
        collection = self.create_collection(collection_name=collection_name)
        # if payload contains an _id, use it as filter for upsert, otherwise use payload as filter
        filter = {"_id": payload["_id"]} if "_id" in payload else payload
        return collection.find_one_and_update(
            filter,
            {"$set": payload},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

    def find(
        self,
        collection_name: str,
        filter: Optional[dict] = None,
    ) -> list:
        """Find items."""
        collection = self.create_collection(collection_name=collection_name)
        return collection.find(filter=filter)


mongodb_client = NoSQLMongoClient()
mongodb_client.create_collection(
    collection_name=COLLECTION_NAME,
    drop_old_collection=True,
)

with Path(f"{TMP_DIR}/mockupMeals.json").open("r") as fp:
    mockup_meals = json.load(fp)
    for meal in mockup_meals:
        item = {
            "_id": meal["id"],
            "name": meal["name"],
            "description": meal["description"],
        }
        for key in ["ingredients", "instructions", "images", "videos"]:
            if key in meal:
                item[key] = meal[key]
        response = mongodb_client.insert(
            collection_name=COLLECTION_NAME,
            payload=item,
        )
        logger.debug("Inserted item %s", response)

# list items
meals = mongodb_client.find(
    collection_name=COLLECTION_NAME,
    filter={},
)
logger.info("Meals %s", meals)
