# Heart Disease Prediction Project

## Overview

This project focuses on predicting the likelihood of heart disease using machine learning techniques. The workflow includes exploratory data analysis (EDA), model comparison, model training, and deployment using an API.

## Exploratory Data Analysis & Model Selection
The notebook ***heart_disease.ipynb*** contains:
- Data visualization and exploratory data analysis (EDA)
- Comparison of multiple machine learning models:
  - Decision Tree Classifier
  - Logistic Regression
  - K-Nearest Neighbors (KNN)
  - Random Forest Classifier

Based on performance evaluation, Logistic Regression was selected as the final model.

## Dataset
**heart-disease.csv**: Contains the raw dataset used for training and evaluation.

## Model Training and Inference

***Before training the model install all the dependencies libraries from the requirement.txt. You can also create an virtual environment, go to (https://docs.python.org/3/library/venv.html)***
```bash
pip install -r requirement.txt
```

**Step 1: Train the Model**

Run the following file:
```
python main.py
```

This will:

- Train the Logistic Regression model

- Apply preprocessing using a pipeline

- Save the trained artifacts using joblib:
  - heart_model.pkl
  - heart_pipeline.pkl



**Step 2: Provide Input for Prediction**

Create an input file:

- **input.csv** (sample already provided)

Ensure:
- Column names match the training dataset
- Column order remains unchanged

**Step 3: Run Inference**

After running main.py again, the model will:

- Read input.csv
- Generate predictions
- Save results in:
**output.csv**

# API Implementation (FastAPI)

The project includes an API for real-time predictions.

**Relevant Files**:

app.py — FastAPI application

schema.py — Input data validation schema

**Step 1: Start the API Server**

```bash
fastapi dev app.py
```

**Step 2: Access API Documentation**

Open in browser:

**http://127.0.0.1:8000/docs**

You can enter input features directly through the interactive UI.

**Step 3: Make a Request via Terminal (cURL)**
```
curl -X POST \
  "http://127.0.0.1:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 0,
    "sex": 0,
    "cp": 0,
    "trestbps": 0,
    "chol": 0,
    "fbs": 0,
    "restecg": 0,
    "thalach": 0,
    "exang": 0,
    "oldpeak": 0,
    "slope": 0,
    "ca": 0,
    "thal": 0
  }'
```

**Note: The above values are placeholders. Replace them with appropriate values based on the dataset.**


# Frontend (React + Vite)

The project includes a React-based UI for real-time predictions via a form interface.

**Relevant Files**:

`frontend/src/App.jsx` — Main UI component with the prediction form

`frontend/src/App.css` — Styling

### Setup

**Step 1: Install frontend dependencies**

Install Node.js from https://nodejs.org/en/download, then run

```bash
cd frontend
npm install
npm install axios
```

**Step 2: Start the frontend dev server**

```bash
npm run dev
```

Open in browser: **http://localhost:5173**

### Usage

Fill in all 13 patient fields in the form and click **Run Prediction**. The result will display below the form showing whether heart disease is detected along with the risk probability.

> **Note:** The FastAPI backend must be running on `http://localhost:8000` before submitting the form.

---

# Running the Full Stack

Open two terminals:

**Terminal 1 — Backend**
```bash
fastapi dev app.py
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```