import { useState } from "react";
import axios from "axios";
import "./App.css";

const FIELDS = [
  { key: "age", label: "Age", type: "number", placeholder: "e.g. 52", min: 1, max: 120, step: 1 },
  {
    key: "sex", label: "Sex", type: "select",
    options: [{ value: 1, label: "Male" }, { value: 0, label: "Female" }]
  },
  {
    key: "cp", label: "Chest Pain Type", type: "select",
    options: [
      { value: 0, label: "0 — Typical Angina" },
      { value: 1, label: "1 — Atypical Angina" },
      { value: 2, label: "2 — Non-anginal Pain" },
      { value: 3, label: "3 — Asymptomatic" },
    ]
  },
  { key: "trestbps", label: "Resting Blood Pressure (mm Hg)", type: "number", placeholder: "e.g. 130", min: 50, max: 250, step: 1 },
  { key: "chol", label: "Serum Cholesterol (mg/dl)", type: "number", placeholder: "e.g. 240", min: 50, max: 600, step: 1 },
  {
    key: "fbs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select",
    options: [{ value: 1, label: "Yes" }, { value: 0, label: "No" }]
  },
  {
    key: "restecg", label: "Resting ECG Results", type: "select",
    options: [
      { value: 0, label: "0 — Normal" },
      { value: 1, label: "1 — ST-T Wave Abnormality" },
      { value: 2, label: "2 — Left Ventricular Hypertrophy" },
    ]
  },
  { key: "thalach", label: "Max Heart Rate Achieved", type: "number", placeholder: "e.g. 150", min: 50, max: 250, step: 1 },
  {
    key: "exang", label: "Exercise Induced Angina", type: "select",
    options: [{ value: 1, label: "Yes" }, { value: 0, label: "No" }]
  },
  { key: "oldpeak", label: "ST Depression (Oldpeak)", type: "number", placeholder: "e.g. 1.2", min: 0, max: 10, step: 0.1 },
  {
    key: "slope", label: "Slope of Peak ST Segment", type: "select",
    options: [
      { value: 0, label: "0 — Upsloping" },
      { value: 1, label: "1 — Flat" },
      { value: 2, label: "2 — Downsloping" },
    ]
  },
  {
    key: "ca", label: "Major Vessels Colored (Fluoroscopy)", type: "select",
    options: [
      { value: 0, label: "0" }, { value: 1, label: "1" },
      { value: 2, label: "2" }, { value: 3, label: "3" },
    ]
  },
  {
    key: "thal", label: "Thalassemia", type: "select",
    options: [
      { value: 1, label: "1 — Normal" },
      { value: 2, label: "2 — Fixed Defect" },
      { value: 3, label: "3 — Reversible Defect" },
    ]
  },
];

const defaultForm = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    // Validate all fields filled
    for (const f of FIELDS) {
      if (String(form[f.key]).trim() === "" || form[f.key] === null) {
        setError(`Please fill in: ${f.label}`);
        return;
      }
    }

    const payload = {};
    for (const f of FIELDS) {
      payload[f.key] = f.type === "number" ? parseFloat(String(form[f.key]).trim()) : parseInt(String(form[f.key]).trim());
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:8000/predict", payload);
      setResult(res.data);
    } catch (err) {
      setError("Could not reach the prediction API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setResult(null);
    setError(null);
  };

  const riskPercent = result ? Math.round(result.probability * 100) : 0;
  const hasDisease = result?.prediction === 1;

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-icon">♥</div>
          <div>
            <h1>Heart Disease Predictor</h1>
            <p className="subtitle">Clinical risk assessment powered by logistic regression</p>
          </div>
        </header>

        {/* Form */}
        <div className="card form-card">
          <h2 className="section-title">Patient Data</h2>
          <div className="grid">
            {FIELDS.map(f => (
              <div className="field" key={f.key}>
                <label>{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={form[f.key]}
                    onChange={e => handleChange(f.key, e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {f.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    onChange={e => handleChange(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <div className="actions">
            <button className="btn-reset" onClick={handleReset}>Reset</button>
            <button className="btn-predict" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" /> : "Run Prediction"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`card result-card ${hasDisease ? "positive" : "negative"}`}>
            <div className="result-header">
              <span className="result-icon">{hasDisease ? "⚠" : "✓"}</span>
              <div>
                <h2 className="result-title">
                  {hasDisease ? "Heart Disease Detected" : "No Heart Disease Detected"}
                </h2>
                <p className="result-sub">
                  {hasDisease
                    ? "The model predicts a positive risk. Please consult a cardiologist."
                    : "The model predicts low risk. Maintain a healthy lifestyle."}
                </p>
              </div>
            </div>

            <div className="risk-bar-wrap">
              <div className="risk-bar-labels">
                <span>Risk Probability</span>
                <span className="risk-pct">{riskPercent}%</span>
              </div>
              <div className="risk-bar-track">
                <div
                  className="risk-bar-fill"
                  style={{ width: `${riskPercent}%` }}
                />
              </div>
            </div>

            <p className="disclaimer">
              ⓘ This tool is for educational purposes only and does not constitute medical advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}