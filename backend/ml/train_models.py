import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
import joblib
import os
import json

DATA_PATH = "/Users/saksham/Desktop/diabestes-web-app/diabetes-lifestyle-dataset"
OUTPUT_PATH = "/Users/saksham/Desktop/diabestes-web-app/backend/ml"

def load_clinical_data():
    df = pd.read_csv(f"{DATA_PATH}/diabetes_binary_health_indicators_BRFSS2015.csv")
    return df

def preprocess_clinical_data(df):
    feature_columns = [
        'HighBP', 'HighChol', 'BMI', 'Smoker', 'Stroke', 
        'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies',
        'HvyAlcoholConsump', 'GenHlth', 'MentHlth', 'PhysHlth', 
        'DiffWalk', 'Sex', 'Age', 'Education', 'Income'
    ]
    
    X = df[feature_columns].copy()
    y = df['Diabetes_binary'].copy()
    
    X = X.fillna(X.median())
    
    return X, y, feature_columns

def train_clinical_model():
    print("Loading clinical data...")
    df = load_clinical_data()
    print(f"Dataset shape: {df.shape}")
    
    print("Preprocessing data...")
    X, y, feature_columns = preprocess_clinical_data(df)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print("\n=== Clinical Model Performance ===")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n=== Top 10 Feature Importance ===")
    print(feature_importance.head(10))
    
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    
    joblib.dump(model, f"{OUTPUT_PATH}/clinical_model.pkl")
    joblib.dump(feature_columns, f"{OUTPUT_PATH}/feature_columns.pkl")
    
    feature_importance.to_json(f"{OUTPUT_PATH}/feature_importance.json", orient='records')
    
    print(f"\n✓ Clinical model saved to {OUTPUT_PATH}")
    
    return model, feature_columns

def create_lifestyle_model():
    print("\n" + "="*50)
    print("Creating Lifestyle Risk Model...")
    print("="*50)
    
    np.random.seed(42)
    n_samples = 5000
    
    data = {
        'sleep_duration': np.random.uniform(4, 10, n_samples),
        'sleep_consistency': np.random.uniform(0, 1, n_samples),
        'daily_activity': np.random.uniform(0, 100, n_samples),
        'steps_walked': np.random.uniform(1000, 15000, n_samples),
        'water_intake': np.random.uniform(1, 10, n_samples),
        'meal_timing_score': np.random.uniform(0, 1, n_samples),
        'smoking_habits': np.random.randint(0, 2, n_samples),
        'alcohol_consumption': np.random.uniform(0, 7, n_samples),
        'stress_level': np.random.uniform(1, 10, n_samples),
        'screen_time': np.random.uniform(1, 14, n_samples),
        'weight_change': np.random.uniform(-5, 10, n_samples),
        'diet_quality': np.random.uniform(0, 1, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    risk_score = (
        0.15 * (10 - df['sleep_duration']) +
        0.1 * (1 - df['sleep_consistency']) +
        0.12 * (100 - df['daily_activity']) / 100 +
        0.1 * (15000 - df['steps_walked']) / 15000 +
        0.08 * (10 - df['water_intake']) / 10 +
        0.1 * (1 - df['meal_timing_score']) +
        0.1 * df['smoking_habits'] +
        0.08 * df['alcohol_consumption'] / 7 +
        0.1 * df['stress_level'] / 10 +
        0.07 * df['screen_time'] / 14 +
        0.05 * df['weight_change'] / 10 +
        0.05 * (1 - df['diet_quality'])
    )
    
    df['risk_score'] = np.clip(risk_score * 100, 0, 100)
    
    X = df.drop(['risk_score'], axis=1)
    y = (df['risk_score'] > 50).astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print(f"Lifestyle Model Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"Lifestyle Model ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")
    
    feature_importance_lifestyle = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n=== Lifestyle Feature Importance ===")
    print(feature_importance_lifestyle)
    
    joblib.dump(model, f"{OUTPUT_PATH}/lifestyle_model.pkl")
    feature_importance_lifestyle.to_json(
        f"{OUTPUT_PATH}/lifestyle_feature_importance.json", 
        orient='records'
    )
    
    print(f"✓ Lifestyle model saved")

if __name__ == "__main__":
    print("="*60)
    print("DIASENSE AI - ML TRAINING PIPELINE")
    print("="*60)
    
    train_clinical_model()
    create_lifestyle_model()
    
    print("\n" + "="*60)
    print("✓ ALL MODELS TRAINED SUCCESSFULLY")
    print("="*60)