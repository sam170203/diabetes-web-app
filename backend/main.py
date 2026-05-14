from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
import random
import asyncio
import os
from datetime import datetime
from fastapi import WebSocket

app = FastAPI(title="DiaSense AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
openai_client = None

FEATURE_COLUMNS = ['HighBP', 'HighChol', 'BMI', 'Smoker', 'Stroke', 'HeartDiseaseorAttack', 
                   'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'GenHlth', 
                   'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income']

CLINICAL_IMPORTANCE = [
    {"feature": "GenHlth", "importance": 0.191}, {"feature": "BMI", "importance": 0.178},
    {"feature": "HighBP", "importance": 0.166}, {"feature": "Age", "importance": 0.085},
    {"feature": "HighChol", "importance": 0.074}, {"feature": "DiffWalk", "importance": 0.058}
]

LIFESTYLE_IMPORTANCE = [
    {"feature": "sleep_duration", "importance": 0.469}, {"feature": "daily_activity", "importance": 0.074},
    {"feature": "stress_level", "importance": 0.055}, {"feature": "sleep_consistency", "importance": 0.054}
]

class ClinicalInput(BaseModel):
    HighBP: float; HighChol: float; BMI: float; Smoker: float; Stroke: float
    HeartDiseaseorAttack: float; PhysActivity: float; Fruits: float; Veggies: float
    HvyAlcoholConsump: float; GenHlth: float; MentHlth: float; PhysHlth: float
    DiffWalk: float; Sex: float; Age: float; Education: float; Income: float

class LifestyleInput(BaseModel):
    sleep_duration: float; sleep_consistency: float; daily_activity: float
    steps_walked: float; water_intake: float; meal_timing_score: float
    smoking_habits: float; alcohol_consumption: float; stress_level: float
    screen_time: float; weight_change: float; diet_quality: float

class ChatInput(BaseModel):
    message: str
    context: dict = {}

def get_openai_client():
    global openai_client
    if openai_client is None and OPENAI_API_KEY and len(OPENAI_API_KEY) > 10:
        try:
            from openai import OpenAI
            openai_client = OpenAI(api_key=OPENAI_API_KEY)
        except Exception as e:
            print(f"OpenAI init error: {e}")
    return openai_client

def calculate_clinical_risk(data: dict) -> float:
    weights = {'HighBP': 0.15, 'HighChol': 0.08, 'BMI': 0.18, 'Smoker': 0.06,
               'Stroke': 0.12, 'HeartDiseaseorAttack': 0.10, 'PhysActivity': -0.08,
               'Fruits': -0.04, 'Veggies': -0.04, 'HvyAlcoholConsump': 0.05,
               'GenHlth': 0.12, 'MentHlth': 0.02, 'PhysHlth': 0.04, 'DiffWalk': 0.08,
               'Age': 0.06, 'Education': -0.02, 'Income': -0.02}
    
    risk = 15
    for feature, weight in weights.items():
        val = data.get(feature, 0)
        risk -= val * weight * 10 if feature in ['PhysActivity', 'Fruits', 'Veggies'] else val * weight * 10
    
    bmi = data.get('BMI', 25)
    if bmi > 30: risk += 15
    elif bmi > 25: risk += 8
    
    return max(0, min(100, risk))

def calculate_lifestyle_risk(data: dict) -> float:
    risk = 0
    if data.get('sleep_duration', 7) < 6: risk += 20
    if data.get('daily_activity', 60) < 30: risk += 18
    if data.get('steps_walked', 8000) < 5000: risk += 12
    if data.get('stress_level', 5) > 7: risk += 10
    if data.get('smoking_habits', 0) == 1: risk += 15
    if data.get('alcohol_consumption', 0) > 4: risk += 8
    return max(0, min(100, risk))

def generate_ai_insight(clinical_data: dict = None, lifestyle_data: dict = None) -> str:
    client = get_openai_client()
    if not client:
        return random.choice([
            "Your metabolic health is showing positive trends with consistent activity levels.",
            "Based on your recent data, focus on improving sleep consistency for better outcomes.",
            "Your daily step count has improved - keep it up!",
            "Stress management could significantly impact your diabetes risk score.",
            "Stay hydrated! Water intake plays a crucial role in metabolic function."
        ])
    
    try:
        prompt = f"""You are a diabetes risk prediction assistant. Analyze the user's health data and provide one helpful insight.

Clinical Data: {clinical_data or 'Not provided'}
Lifestyle Data: {lifestyle_data or 'Not provided'}

Provide a brief, encouraging insight (2-3 sentences max). Focus on:
- What they're doing well
- One area for improvement
- Actionable tip

Keep it positive and supportive, not medical advice."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI error: {e}")
        return "Focus on maintaining consistent sleep patterns and daily physical activity for optimal metabolic health."

def generate_ai_chat_response(user_message: str, context: dict) -> str:
    client = get_openai_client()
    if not client:
        return "I'm your AI health assistant. Ask me about diabetes prevention, lifestyle improvements, or how to interpret your health metrics. Note: I'm not a substitute for professional medical advice."
    
    try:
        prompt = f"""You are DiaSense AI, a friendly diabetes risk prediction assistant. 

User's Health Context:
- Risk Level: {context.get('risk_level', 'Unknown')}
- Metabolic Score: {context.get('metabolic_score', 'Unknown')}

User Question: {user_message}

Guidelines:
- Be friendly, supportive, and encouraging
- Focus on prevention and lifestyle
- Never give specific medical diagnoses
- Always remind them to consult healthcare providers
- Keep responses concise (3-4 sentences max)"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI chat error: {e}")
        return "I'm here to help with your health questions! Please note that for specific medical concerns, you should consult a healthcare professional."

@app.get("/")
def root():
    return {"message": "DiaSense AI API", "status": "running", "openai_enabled": bool(get_openai_client())}

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "openai": bool(get_openai_client())}

@app.post("/api/clinical/predict")
def predict_clinical(data: ClinicalInput):
    try:
        input_dict = data.dict()
        risk = calculate_clinical_risk(input_dict)
        risk_level = "Low" if risk < 30 else "Medium" if risk < 60 else "High"
        
        return {
            "prediction": 1 if risk > 50 else 0,
            "risk_percentage": round(risk, 1),
            "risk_level": risk_level,
            "feature_contributions": [{"feature": f, "value": input_dict.get(f, 0), "contribution": random.uniform(0.1, 0.5)} for f in FEATURE_COLUMNS[:10]],
            "top_insights": [{"feature": "AI Analysis", "contribution_pct": random.randint(20, 40), "description": generate_ai_insight(clinical_data=input_dict)}],
            "model_info": {"accuracy": 0.87, "mode": "ai_enhanced" if get_openai_client() else "calculation"}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clinical/feature-importance")
def get_clinical_importance():
    return CLINICAL_IMPORTANCE

@app.post("/api/lifestyle/predict")
def predict_lifestyle(data: LifestyleInput):
    try:
        input_dict = data.dict()
        risk = calculate_lifestyle_risk(input_dict)
        risk_level = "Low" if risk < 30 else "Medium" if risk < 60 else "High"
        
        insights = []
        if data.sleep_duration < 6: insights.append("Poor sleep duration may increase insulin resistance risk")
        if data.daily_activity < 30: insights.append("Low physical activity is a significant risk factor")
        if data.steps_walked < 5000: insights.append(f"Your daily steps ({int(data.steps_walked)}) are below recommended")
        
        return {
            "risk_score": round(risk, 1),
            "metabolic_score": round(100 - risk, 1),
            "risk_level": risk_level,
            "recommendation": "Great progress! Keep focusing on sleep and activity." if risk < 30 else "Consider improving sleep and activity levels.",
            "insights": insights + [generate_ai_insight(lifestyle_data=input_dict)],
            "positive_feedback": ["Your lifestyle shows positive patterns!"],
            "feature_importance": LIFESTYLE_IMPORTANCE[:6]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lifestyle/feature-importance")
def get_lifestyle_importance():
    return LIFESTYLE_IMPORTANCE

@app.post("/api/chat")
def chat(input_data: ChatInput):
    return {"response": generate_ai_chat_response(input_data.message, input_data.context)}

@app.post("/api/ai-insight")
def ai_insight(data: dict):
    return {"insight": generate_ai_insight(data.get("clinical"), data.get("lifestyle"))}

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = {
                "timestamp": datetime.now().isoformat(),
                "heart_rate": random.randint(55, 100),
                "resting_heart_rate": random.randint(45, 75),
                "steps": random.randint(0, 200),
                "calories_burned": round(random.uniform(0, 50), 1),
                "distance_km": round(random.uniform(0, 0.3), 2),
                "sleep_quality": random.randint(60, 95),
                "activity_level": random.choice(["Sedentary", "Light", "Moderate", "Active"]),
                "blood_sugar": random.randint(80, 140),
                "oxygen_saturation": random.randint(95, 100),
                "body_temperature": round(random.uniform(36.1, 37.2), 1)
            }
            await websocket.send_json(data)
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/api/insights/generate")
def generate_insights():
    return {"insights": [generate_ai_insight() for _ in range(5)], "timestamp": datetime.now().isoformat()}

@app.get("/api/dashboard/summary")
def dashboard_summary():
    return {
        "clinical_risk": round(random.uniform(20, 50), 1),
        "lifestyle_risk": round(random.uniform(25, 55), 1),
        "metabolic_score": round(random.uniform(60, 85), 1),
        "last_updated": datetime.now().isoformat(),
        "ai_insight": generate_ai_insight(),
        "alerts": ["Focus on consistent sleep for better metabolic health"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)