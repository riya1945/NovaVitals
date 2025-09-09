import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "model", "feature_columns.pkl")

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)

class InputData(BaseModel):
    features: list[float]

@app.get("/")
def root():
    return {"message": "NovaVitals is now live!"}

@app.post("/predict")
def predict(data: InputData):
    input_df = pd.DataFrame([data.features], columns=feature_columns)
    prediction = model.predict(input_df)[0]
    return {"prediction": prediction}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
