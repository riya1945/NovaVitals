import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model.explain import explain_prediction

# =============================
# App Setup
# =============================
app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "model", "feature_columns.pkl")
THRESHOLD_PATH = os.path.join(BASE_DIR, "model", "threshold.pkl")

# =============================
# Load Model Artifacts
# =============================
model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)
threshold = joblib.load(THRESHOLD_PATH)

print("Loaded feature order:", feature_columns)
print("Loaded threshold:", threshold)

class InputData(BaseModel):
    features: list[float]

# =============================
# Routes
# =============================
@app.get("/")
def root():
    return {"message": "NovaVitals ML Backend is live 🚀"}

@app.get("/feature-order")
def get_feature_order():
    return {"feature_order": feature_columns}

@app.post("/predict")
def predict(data: InputData):

    if len(data.features) != len(feature_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Expected {len(feature_columns)} features, got {len(data.features)}"
        )

    input_df = pd.DataFrame([data.features], columns=feature_columns)

    # =============================
    # Model Prediction
    # =============================
    prob_critical = model.predict_proba(input_df)[0][1]

    prediction_num = 1 if prob_critical >= threshold else 0

    label_map = {
        0: "Healthy",
        1: "Critical"
    }

    prediction_label = label_map[prediction_num]

    # =============================
    # Confidence Score
    # =============================
    confidence = max(prob_critical, 1 - prob_critical)

    # =============================
    # SHAP Explainability
    # =============================
    exp = explain_prediction(data.features)

    # =============================
    # Alert Logic
    # =============================
    alert = False
    severity = "Normal"

    if prob_critical > 0.8:
        alert = True
        severity = "Critical"
    elif prob_critical > 0.5:
        severity = "Warning"

    # =============================
    # Response
    # =============================
    return {
    "prediction": prediction_label,
    "probability_critical": float(prob_critical),
    "confidence": float(confidence),
    "threshold_used": float(threshold),
    "alert": alert,
    "severity": severity,
    "explanation": exp["explanation"],
    "plot": exp["plot"]
}

# =============================
# CORS
# =============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)