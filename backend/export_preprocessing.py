import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.model_selection import train_test_split

# Load and prepare data EXACTLY like the notebook
df = pd.read_csv('Telco_Customer_Churn_Dataset  (1).csv')

# Drop CustomerID and convert TotalCharges
df = df.drop('customerID', axis=1)
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())

# Convert target variable
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

# Encode binary columns EXACTLY like notebook
binary_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling']
for col in binary_cols:
    df[col] = df[col].map({'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0})

# One-hot encode categorical columns EXACTLY like notebook
multi_cat_cols = [
    'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
    'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
    'Contract', 'PaymentMethod'
]
df = pd.get_dummies(df, columns=multi_cat_cols, drop_first=True)

# Prepare features and target EXACTLY like notebook
X = df.drop('Churn', axis=1)
y = df['Churn']

# Train-test split EXACTLY like notebook
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Scale ONLY numeric columns EXACTLY like notebook
numeric_cols = X.select_dtypes(include=['float64', 'int64']).columns
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train[numeric_cols])
X_test_scaled = scaler.transform(X_test[numeric_cols])

# Save the scaler
joblib.dump(scaler, 'scaler.pkl')

# Feature selection EXACTLY like notebook
selector = SelectKBest(mutual_info_classif, k=20)
X_train_selected = selector.fit_transform(X_train_scaled, y_train)
X_test_selected = selector.transform(X_test_scaled)

# Save the selector
joblib.dump(selector, 'selector.pkl')

# Save feature column names and numeric columns for app.py
joblib.dump(list(numeric_cols), 'numeric_cols.pkl')
joblib.dump(list(X.columns), 'all_feature_cols.pkl')

print('Successfully exported preprocessing files')
print(f'Total features before selection: {len(X.columns)}')
print(f'Numeric features: {len(numeric_cols)}')
print(f'Selected features: {X_train_selected.shape[1]}')
print(f'Numeric columns: {list(numeric_cols)}')