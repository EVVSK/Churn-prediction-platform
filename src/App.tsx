import React, { useState } from 'react';
import './App.css';

type CustomerData = {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
};

type PredictionResult = {
  churn: boolean;
  probability: number;
};

const initialForm: CustomerData = {
  gender: '',
  SeniorCitizen: 0,
  Partner: '',
  Dependents: '',
  tenure: 0,
  PhoneService: '',
  MultipleLines: '',
  InternetService: '',
  OnlineSecurity: '',
  OnlineBackup: '',
  DeviceProtection: '',
  TechSupport: '',
  StreamingTV: '',
  StreamingMovies: '',
  Contract: '',
  PaperlessBilling: '',
  PaymentMethod: '',
  MonthlyCharges: 0,
  TotalCharges: 0,
};

function App() {
  const [form, setForm] = useState<CustomerData>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'SeniorCitizen' || name === 'tenure' || name === 'MonthlyCharges' || name === 'TotalCharges' 
        ? Number(value) 
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/submit-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App-container">
      <h2>Telco Customer Churn Prediction</h2>
      <form onSubmit={handleSubmit} className="churn-form">
        <label>
          Gender:
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Senior Citizen:
          <select name="SeniorCitizen" value={form.SeniorCitizen} onChange={handleChange} required>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>
        <label>
          Partner:
          <select name="Partner" value={form.Partner} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Dependents:
          <select name="Dependents" value={form.Dependents} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Tenure (months):
          <input type="number" name="tenure" value={form.tenure} onChange={handleChange} min={0} required />
        </label>
        <label>
          Phone Service:
          <select name="PhoneService" value={form.PhoneService} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Multiple Lines:
          <select name="MultipleLines" value={form.MultipleLines} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No phone service">No phone service</option>
          </select>
        </label>
        <label>
          Internet Service:
          <select name="InternetService" value={form.InternetService} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="DSL">DSL</option>
            <option value="Fiber optic">Fiber optic</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Online Security:
          <select name="OnlineSecurity" value={form.OnlineSecurity} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Online Backup:
          <select name="OnlineBackup" value={form.OnlineBackup} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Device Protection:
          <select name="DeviceProtection" value={form.DeviceProtection} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Tech Support:
          <select name="TechSupport" value={form.TechSupport} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Streaming TV:
          <select name="StreamingTV" value={form.StreamingTV} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Streaming Movies:
          <select name="StreamingMovies" value={form.StreamingMovies} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="No internet service">No internet service</option>
          </select>
        </label>
        <label>
          Contract:
          <select name="Contract" value={form.Contract} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Month-to-month">Month-to-month</option>
            <option value="One year">One year</option>
            <option value="Two year">Two year</option>
          </select>
        </label>
        <label>
          Paperless Billing:
          <select name="PaperlessBilling" value={form.PaperlessBilling} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Payment Method:
          <select name="PaymentMethod" value={form.PaymentMethod} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Electronic check">Electronic check</option>
            <option value="Mailed check">Mailed check</option>
            <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
            <option value="Credit card (automatic)">Credit card (automatic)</option>
          </select>
        </label>
        <label>
          Monthly Charges:
          <input type="number" name="MonthlyCharges" value={form.MonthlyCharges} onChange={handleChange} min={0} step={0.01} required />
        </label>
        <label>
          Total Charges:
          <input type="number" name="TotalCharges" value={form.TotalCharges} onChange={handleChange} min={0} step={0.01} required />
        </label>
        
        <button type="submit" disabled={loading} className="churn-btn">
          {loading ? 'Predicting...' : 'Predict Churn'}
        </button>
      </form>
      
      {error && (
        <div className="churn-error">
          <span className="error-title">Error:</span> {error}
        </div>
      )}
      {result && (
        <div className={`churn-result ${result.churn ? 'churn-yes' : 'churn-no'}`}>
          <h3 className="result-title">Prediction Results</h3>
          <div className="result-prediction">
            Customer is <span className={result.churn ? 'churn-status-yes' : 'churn-status-no'}>
              {result.churn ? 'likely to churn' : 'not likely to churn'}
            </span>
          </div>
          <div className="result-confidence">
            Confidence Level: <strong>{(result.probability).toFixed(1)}%</strong>
          </div>
          <div className="result-recommendation">
            {result.churn 
              ? 'Recommendation: Consider proactive retention measures for this customer.' 
              : 'Recommendation: Continue providing excellent service to maintain customer satisfaction.'}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
