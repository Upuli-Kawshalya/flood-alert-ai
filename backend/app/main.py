from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import pandas as pd
import os
from dotenv import load_dotenv

from app.schemas import PredictionInput, PredictionOutput
from app.ml_service import ml_service
from app.alerts import alert_service
from app.database import check_connection

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting Flood Alert AI API...")
    ml_service.load_model()
    db_status = "Connected" if check_connection() else "Disconnected"
    print(f"💾 Database: {db_status}")
    yield
    # Shutdown
    print("👋 Shutting down API...")

# Initialize FastAPI app
app = FastAPI(
    title="Flood Alert AI API",
    description="AI-powered flood risk prediction system for Sri Lanka",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_HOSTS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Flood Alert AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected" if check_connection() else "disconnected",
        "model": "loaded" if ml_service.model else "not loaded"
    }

@app.post("/predict", response_model=PredictionOutput)
@limiter.limit("10/minute")
async def predict_flood(request: Request, data: PredictionInput):
    """
    Predict flood risk for given location and weather conditions
    
    Args:
        data: PredictionInput with lat, lng, rainfall_24h, river_level
        
    Returns:
        PredictionOutput with probability and risk level
    """
    try:
        # Prepare features
        features = pd.DataFrame([{
            "lat": data.lat,
            "lng": data.lng,
            "rainfall_24h": data.rainfall_24h,
            "river_level": data.river_level if data.river_level is not None else 0.0
        }])
        
        # Get prediction
        result = ml_service.predict(features)
        
        # Send alert and log if needed
        await alert_service.send_alert_and_log(data.dict(), result)
        
        return PredictionOutput(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)