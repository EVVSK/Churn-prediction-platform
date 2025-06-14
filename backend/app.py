from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and preprocessing objects
model = joblib.load('best_model.pkl')
scaler = joblib.load('scaler.pkl')
selector = joblib.load('selector.pkl')
numeric_cols = joblib.load('numeric_cols.pkl')
all_feature_cols = joblib.load('all_feature_cols.pkl')

# Define column types
binary_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling']
multi_cat_cols = ['MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
                  'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
                  'Contract', 'PaymentMethod']

@app.route('/submit-customer', methods=['POST'])
def submit_customer():
    try:
        data = request.json
        print("Input data:", data)
        
        # Create DataFrame
        df = pd.DataFrame([data])
        
        # Convert binary features EXACTLY like notebook
        binary_map = {'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0}
        for col in binary_cols:
            df[col] = df[col].map(binary_map)
        print("\nBinary encoded features:", df[binary_cols].to_dict('records')[0])
        
        # One-hot encode categorical columns EXACTLY like notebook
        df_encoded = pd.get_dummies(df, columns=multi_cat_cols, drop_first=True)
        print("\nFeatures after one-hot encoding:", df_encoded.columns.tolist())
        
        # Ensure all feature columns exist and in correct order
        for col in all_feature_cols:
            if col not in df_encoded.columns:
                df_encoded[col] = 0
        df_encoded = df_encoded[all_feature_cols]
        
        # Scale ONLY numeric features EXACTLY like notebook
        X_scaled = scaler.transform(df_encoded[numeric_cols])
        print("\nScaled numeric features shape:", X_scaled.shape)
        
        # Apply feature selection EXACTLY like notebook
        X_selected = selector.transform(X_scaled)
        print(f"Selected features shape: {X_selected.shape}")
        
        # Make prediction
        probability = model.predict_proba(X_selected)[0, 1]
        prediction = probability >= 0.5
        print("\nPrediction details:")
        print(f"Raw probability: {probability}")
        print(f"Prediction: {prediction}")
        
        return jsonify({
            'churn': bool(prediction),
            'probability': float(probability * 100)
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)