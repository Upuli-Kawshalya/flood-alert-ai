from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/flood_db")
client = None
db = None
alerts_collection = None
predictions_collection = None

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client.admin.command("ping")  # Test connection
    db = client["flood_alert_db"]
    alerts_collection = db["alerts"]
    predictions_collection = db["predictions"]
    print("✅ MongoDB connected successfully")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(f"⚠️  MongoDB connection failed: {e}")
    print("   → Running in dev mode: predictions work, DB logging skipped")
except Exception as e:
    print(f"⚠️  Unexpected MongoDB error: {e}")

def check_connection():
    """Check if MongoDB is connected"""
    try:
        if client is not None:
            client.admin.command("ping")
            return True
    except:
        pass
    return False