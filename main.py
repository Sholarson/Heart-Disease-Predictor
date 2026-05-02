import os
import pandas as pd
import numpy as np
import joblib
 
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

MODEL_FILE = "heart_model.pkl"
PIPELINE_FILE = "heart_pipeline.pkl"

# BUILD PIPELINE
def build_pipeline(num_attribs):
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    full_pipeline = ColumnTransformer([
        ("num", num_pipeline, num_attribs)
    ])

    return full_pipeline


# TRAINING PHASE
if not os.path.exists(MODEL_FILE):

    data = pd.read_csv("heart-disease.csv")

    X = data.drop("target", axis=1)
    y = data["target"]

    num_attribs = ["age", "trestbps", "chol", "thalach", "oldpeak"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = build_pipeline(num_attribs)

    X_train_prepared = pipeline.fit_transform(X_train)
    X_test_prepared = pipeline.transform(X_test)

    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_prepared, y_train)

    preds = model.predict(X_test_prepared)

    print("Model Evaluation:")
    print("Accuracy:", accuracy_score(y_test, preds))
    print("Confusion Matrix:\n", confusion_matrix(y_test, preds))
    print("Classification Report:\n", classification_report(y_test, preds))

    joblib.dump(model, MODEL_FILE)
    joblib.dump(pipeline, PIPELINE_FILE)

    print("Model trained and saved.")

# INFERENCE PHASE
else:
    model = joblib.load(MODEL_FILE)
    pipeline = joblib.load(PIPELINE_FILE)

    input_data = pd.read_csv("input.csv")

    transformed_input = pipeline.transform(input_data)

    predictions = model.predict(transformed_input)

    input_data["prediction"] = predictions

    input_data.to_csv("output.csv", index=False)

    print("Inference complete. Results saved to output.csv")

