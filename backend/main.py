from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import json
import random
import asyncio
from datetime import datetime
from fastapi import WebSocket

app = FastAPI(title="DiaSense AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ML_PATH = "/Users/saksham/Desktop/diabestes-web-app/backend/ml"

clinical_model = joblib.load(f"{ML_PATH}/clinical_model.pkl")
feature_columns = joblib.load(f"{ML_PATH}/feature_columns.pkl")
lifestyle_model = joblib.load(f"{ML_PATH}/lifestyle_model.pkl")

with open(f"{ML_PATH}/feature_importance.json") as f:
    clinical_importance = json.load(f)

with open(f"{ML_PATH}/lifestyle_feature_importance.json") as f:
    lifestyle_importance = json.load(f)

class ClinicalInput(BaseModel):
    HighBP: float
    HighChol: float
    BMI: float
    Smoker: float
    Stroke: float
    HeartDiseaseorAttack: float
    PhysActivity: float
    Fruits: float
    Veggies: float
    HvyAlcoholConsump: float
    GenHlth: float
    MentHlth: float
    PhysHlth: float
    DiffWalk: float
    Sex: float
    Age: float
    Education: float
    Income: float

class LifestyleInput(BaseModel):
    sleep_duration: float
    sleep_consistency: float
    daily_activity: float
    steps_walked: float
    water_intake: float
    meal_timing_score: float
    smoking_habits: float
    alcohol_consumption: float
    stress_level: float
    screen_time: float
    weight_change: float
    diet_quality: float

@app.get("/")
def root():
    return {"message": "DiaSense AI API", "status": "running"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/clinical/predict")
def predict_clinical(data: ClinicalInput):
    try:
        input_dict = data.dict()
        input_array = np.array([[input_dict[col] for col in feature_columns]])
        
        prediction = clinical_model.predict(input_array)[0]
        probability = clinical_model.predict_proba(input_array)[0]
        
        risk_percentage = float(probability[1]) * 100
        
        if risk_percentage < 30:
            risk_level = "Low"
        elif risk_percentage < 60:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        importances = clinical_model.feature_importances_
        
        feature_contributions = []
        for i, col in enumerate(feature_columns):
            contribution = importances[i] * input_dict[col] * 10
            feature_contributions.append({
                "feature": col,
                "value": float(input_dict[col]),
                "contribution": float(contribution),
                "impact": "increases" if contribution > 0.5 else "decreases"
            })
        
        feature_contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)
        
        top_insights = []
        total_positive = sum([f["contribution"] for f in feature_contributions if f["contribution"] > 0])
        for fc in feature_contributions[:5]:
            if fc["contribution"] > 0 and total_positive > 0:
                pct = (fc["contribution"] / total_positive) * 100
                top_insights.append({
                    "feature": fc["feature"],
                    "contribution_pct": round(pct, 1),
                    "description": f"{fc['feature']} at {fc['value']} increased risk by {pct:.1f}%"
                })
        
        return {
            "prediction": int(prediction),
            "risk_percentage": round(risk_percentage, 1),
            "risk_level": risk_level,
            "feature_contributions": feature_contributions[:10],
            "top_insights": top_insights,
            "model_info": {
                "accuracy": 0.87,
                "dataset": "BRFSS 2015",
                "samples": 253681
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clinical/feature-importance")
def get_clinical_importance():
    return clinical_importance

@app.post("/api/lifestyle/predict")
def predict_lifestyle(data: LifestyleInput):
    try:
        input_dict = data.dict()
        input_array = np.array([[input_dict[k] for k in input_dict.keys()]])
        
        prediction = lifestyle_model.predict(input_array)[0]
        probability = lifestyle_model.predict_proba(input_array)[0]
        
        risk_score = float(probability[1]) * 100
        
        if risk_score < 30:
            risk_level = "Low"
            recommendation = "Your lifestyle patterns are healthy. Keep up the good work!"
        elif risk_score < 60:
            risk_level = "Medium"
            recommendation = "Some lifestyle factors could be improved. Focus on sleep consistency and daily activity."
        else:
            risk_level = "High"
            recommendation = "Multiple lifestyle factors are increasing your metabolic risk. Consider consulting a healthcare provider."
        
        insights = []
        
        if data.sleep_duration < 6:
            insights.append("Poor sleep duration may increase insulin resistance risk")
        if data.sleep_consistency < 0.5:
            insights.append("Irregular sleep patterns can affect metabolic health")
        if data.daily_activity < 30:
            insights.append("Low physical activity is a significant risk factor")
        if data.steps_walked < 5000:
            insights.append(f"Your daily steps ({int(data.steps_walked)}) are below the recommended 10,000")
        if data.stress_level > 7:
            insights.append("High stress levels can impact blood sugar regulation")
        if data.screen_time > 8:
            insights.append("Excessive screen time correlates with sedentary behavior")
        if data.smoking_habits == 1:
            insights.append("Smoking is a major risk factor for metabolic disorders")
        if data.alcohol_consumption > 4:
            insights.append("High alcohol consumption affects metabolic health")
        if data.water_intake < 4:
            insights.append("Low water intake may affect metabolic function")
        
        positive_feedback = []
        if data.sleep_duration >= 7:
            positive_feedback.append("Good sleep duration supports metabolic health")
        if data.daily_activity >= 60:
            positive_feedback.append("High physical activity level is beneficial")
        if data.steps_walked >= 8000:
            positive_feedback.append("Your step count is excellent")
        if data.water_intake >= 8:
            positive_feedback.append("Great hydration supporting metabolic function")
        
        metabolic_score = 100 - risk_score
        
        return {
            "risk_score": round(risk_score, 1),
            "metabolic_score": round(metabolic_score, 1),
            "risk_level": risk_level,
            "recommendation": recommendation,
            "insights": insights[:6],
            "positive_feedback": positive_feedback[:4],
            "feature_importance": lifestyle_importance[:8]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lifestyle/feature-importance")
def get_lifestyle_importance():
    return lifestyle_importance

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            heart_rate = random.randint(55, 100)
            resting_hr = random.randint(45, 75)
            steps = random.randint(0, 200)
            calories = round(random.uniform(0, 50), 1)
            distance = round(random.uniform(0, 0.3), 2)
            sleep_quality = random.randint(60, 95)
            activity_level = random.choice(["Sedentary", "Light", "Moderate", "Active"])
            
            blood_sugar = random.randint(80, 140)
            
            data = {
                "timestamp": datetime.now().isoformat(),
                "heart_rate": heart_rate,
                "resting_heart_rate": resting_hr,
                "steps": steps,
                "calories_burned": calories,
                "distance_km": distance,
                "sleep_quality": sleep_quality,
                "activity_level": activity_level,
                "blood_sugar": blood_sugar,
                "oxygen_saturation": random.randint(95, 100),
                "body_temperature": round(random.uniform(36.1, 37.2), 1)
            }
            
            await websocket.send_json(data)
            await asyncio.sleep(2)
            
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/api/insights/generate")
def generate_insights():
    insights_pool = [
        "Your sedentary behavior has increased by 18% this week.",
        "Poor sleep consistency may increase insulin resistance risk.",
        "Your recent activity trend improved metabolic health score by 12%.",
        "Irregular meal timing affects blood sugar regulation.",
        "Stress levels correlate with elevated glucose levels.",
        "Regular physical activity reduces diabetes risk by up to 40%.",
        "Hydration plays a crucial role in metabolic function.",
        "Screen time over 8 hours daily increases metabolic risk.",
        "Consistent sleep schedule supports hormonal balance.",
        "High BMI is a significant predictor of diabetes risk."
    ]
    
    return {
        "insights": random.sample(insights_pool, 5),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/dashboard/summary")
def dashboard_summary():
    return {
        "clinical_risk": round(random.uniform(20, 50), 1),
        "lifestyle_risk": round(random.uniform(25, 55), 1),
        "metabolic_score": round(random.uniform(60, 85), 1),
        "last_updated": datetime.now().isoformat(),
        "alerts": [
            "Monitor blood pressure regularly",
            "Increase daily step count",
            "Improve sleep consistency"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)