import joblib
import pandas as pd
import os
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../data/flood_model.pkl")

class MLService:
    def __init__(self):
        self.pipeline = None
        self.scaler = None
        self.model = None
        self.feature_names = None
        
    def load_model(self):
        """Load the trained model from disk"""
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Run python scripts/train_model.py first."
            )
        
        self.pipeline = joblib.load(MODEL_PATH)
        self.scaler = self.pipeline["scaler"]
        self.model = self.pipeline["model"]
        self.feature_names = self.pipeline["feature_names"]
        print(f"✅ Model loaded from {MODEL_PATH}")
        
    def predict(self, features: pd.DataFrame) -> Dict[str, Any]:
        """
        Predict flood risk
        
        Args:
            features: DataFrame with columns [lat, lng, rainfall_24h, river_level]
            
        Returns:
            Dict with probability and risk level
        """
        if self.model is None:
            self.load_model()
        
        # Ensure correct column order
        features = features[self.feature_names]
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Predict probability
        proba = self.model.predict_proba(features_scaled)[0][1]
        
        # Determine risk level
        if proba < 0.45:
            level = "Green"
        elif proba < 0.70:
            level = "Yellow"
        else:
            level = "Red"
        
        return {
            "probability": round(float(proba), 3),
            "level": level
        }

# Global instance
ml_service = MLService()