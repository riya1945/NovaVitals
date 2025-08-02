import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = joblib.load("../model/model.pkl")
feature_columns = joblib.load("../model/feature_columns.pkl")

class InputData(BaseModel):
    features: list[float]

@app.get("/")
def root():
    return {"NovaVitals is now live!"}

@app.post("/predict")
@app.post("/predict")
def predict(data: InputData):
    
    input_df = pd.DataFrame([data.features], columns=feature_columns)
    prediction = model.predict(input_df)[0]
    return {"prediction": prediction}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)