import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, accuracy_score, recall_score
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)

# Generate synthetic flood data (2000 samples)
print("📊 Generating synthetic flood dataset...")
n_samples = 2000

data = pd.DataFrame({
    "lat": np.random.uniform(5.9, 9.9, n_samples),  # Sri Lanka latitude range
    "lng": np.random.uniform(79.7, 82.0, n_samples),  # Sri Lanka longitude range
    "rainfall_24h": np.random.exponential(50, n_samples),  # Rainfall in mm
    "river_level": np.random.exponential(2.5, n_samples)  # River level in meters
})

# Create realistic flood labels based on rules
# High flood risk if: heavy rain (>80mm) + high river (>4m) + low elevation areas (lat < 7.5)
data["flood_risk_score"] = (
    (data["rainfall_24h"] > 80).astype(int) * 2 +
    (data["river_level"] > 4).astype(int) * 2 +
    (data["lat"] < 7.5).astype(int) * 1
)

# Flood occurs if risk score >= 3
data["is_flood"] = (data["flood_risk_score"] >= 3).astype(int)

print(f"📈 Dataset created: {n_samples} samples")
print(f"   Flood cases: {data['is_flood'].sum()} ({data['is_flood'].mean()*100:.1f}%)")
print(f"   Non-flood cases: {(data['is_flood']==0).sum()} ({(1-data['is_flood'].mean())*100:.1f}%)")

# Prepare features and target
X = data[["lat", "lng", "rainfall_24h", "river_level"]]
y = data["is_flood"]

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train XGBoost model
print("\n🤖 Training XGBoost model...")
model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    eval_metric="logloss",
    random_state=42,
    use_label_encoder=False
)

model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]

print("\n📊 Model Performance:")
print(f"   Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"   Recall: {recall_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["No Flood", "Flood"]))

# Save model and scaler
os.makedirs("../data", exist_ok=True)
pipeline = {
    "scaler": scaler,
    "model": model,
    "feature_names": ["lat", "lng", "rainfall_24h", "river_level"]
}

model_path = "../data/flood_model.pkl"
joblib.dump(pipeline, model_path)
print(f"\n✅ Model saved to {model_path}")
print(f"   File size: {os.path.getsize(model_path) / 1024:.2f} KB")