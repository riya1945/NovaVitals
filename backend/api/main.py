import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load model and features
model = joblib.load("backend/model/model.pkl")
feature_columns = joblib.load("backend/model/feature_columns.pkl")

class InputData(BaseModel):
    features: list[float]

@app.get("/")
def root():
    return {"NovaVitals is now live!"}

@app.post("/predict")
def predict(data: InputData):
    input_df = pd.DataFrame([data.features], columns=feature_columns)
    prediction = model.predict(input_df)[0]
    return {"prediction": prediction}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔓 Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)