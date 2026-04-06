from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/flood_db")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.admin.command("ping")
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️  MongoDB connection failed: {e}")
    client = None

db = client["flood_alert_db"] if client else None

# Collections
alerts_collection = db["alerts"] if db else None
predictions_collection = db["predictions"] if db else None

def check_connection():
    """Check if MongoDB is connected"""
    try:
        if client:
            client.admin.command("ping")
            return True
    except:
        pass
    return False