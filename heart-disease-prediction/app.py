from fastapi import FastAPI
import pandas as pd
import joblib
from schema import HeartInput
from fastapi.middleware.cors import CORSMiddleware

# Load model and pipeline 
model = joblib.load("heart_model.pkl")
pipeline = joblib.load("heart_pipeline.pkl")

app = FastAPI(title="Heart Disease Prediction API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is running"}


@app.post("/predict")
def predict(data: HeartInput):
    input_df = pd.DataFrame([data.dict()])

    transformed = pipeline.transform(input_df)

    prediction = model.predict(transformed)[0]
    probability = model.predict_proba(transformed)[0][1]

    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }