from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PredictionInput(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude (-90 to 90)")
    lng: float = Field(..., ge=-180, le=180, description="Longitude (-180 to 180)")
    rainfall_24h: float = Field(..., ge=0, description="Rainfall in last 24 hours (mm)")
    river_level: Optional[float] = Field(None, ge=0, description="Current river level (m)")
    phone: Optional[str] = Field(None, description="Phone number for alerts")
    email: Optional[str] = Field(None, description="Email for alerts")

class PredictionOutput(BaseModel):
    probability: float = Field(..., ge=0, le=1, description="Flood probability (0-1)")
    level: str = Field(..., description="Risk level: Green/Yellow/Red")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "probability": 0.75,
                "level": "Red",
                "timestamp": "2024-01-01T12:00:00"
            }
        }