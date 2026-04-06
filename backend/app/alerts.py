from app.database import alerts_collection
from datetime import datetime
import httpx
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

class AlertService:
    @staticmethod
    async def send_alert_and_log(data: Dict[str, Any], result: Dict[str, Any]):
        """
        Send alert if risk is Red and log to MongoDB
        
        Args:
            data: Input prediction data
            result: Prediction result with probability and level
        """
        # Log to MongoDB
        if alerts_collection:
            doc = {
                "lat": data.get("lat"),
                "lng": data.get("lng"),
                "rainfall_24h": data.get("rainfall_24h"),
                "river_level": data.get("river_level"),
                "phone": data.get("phone"),
                "email": data.get("email"),
                "probability": result["probability"],
                "level": result["level"],
                "created_at": datetime.utcnow()
            }
            try:
                alerts_collection.insert_one(doc)
                print(f"📝 Alert logged to MongoDB: {result['level']} risk")
            except Exception as e:
                print(f"⚠️  Failed to log to MongoDB: {e}")
        
        # Send Telegram alert if Red level
        if result["level"] == "Red" and TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
            await AlertService._send_telegram_alert(data, result)
    
    @staticmethod
    async def _send_telegram_alert(data: Dict[str, Any], result: Dict[str, Any]):
        """Send alert via Telegram Bot API"""
        message = (
            f"🚨 *FLOOD ALERT - RED LEVEL* 🚨\n\n"
            f"📊 Risk Probability: {result['probability']*100:.1f}%\n"
            f"📍 Location: {data['lat']:.4f}, {data['lng']:.4f}\n"
            f"💧 24h Rainfall: {data['rainfall_24h']:.1f}mm\n"
            f"🌊 River Level: {data.get('river_level', 'N/A')}m\n\n"
            f"⚠️  Take immediate precautions!"
        )
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10)
                response.raise_for_status()
                print("✅ Telegram alert sent successfully")
        except Exception as e:
            print(f"⚠️  Failed to send Telegram alert: {e}")

alert_service = AlertService()