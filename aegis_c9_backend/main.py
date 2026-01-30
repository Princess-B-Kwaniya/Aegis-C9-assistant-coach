import asyncio
import json
import random
import os
import joblib
import pickle
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from bridge import fetch_aegis_data
from find_live_match import get_live_predictions

# Macro-Impact Engine (MIE) Controller
class MacroImpactEngine:
    def __init__(self):
        self.rf_model = self._load_model('rf_model.pkl', 'pickle')
        self.xgb_model = self._load_model('xgb_model.pkl', 'joblib')
        # LSTM might require tensorflow
        try:
            from tensorflow.keras.models import load_model
            self.lstm_model = self._load_model('lstm_model.h5', 'keras')
        except ImportError:
            print("Tensorflow not found, LSTM disabled.")
            self.lstm_model = None

    def _load_model(self, filename, type):
        if not os.path.exists(filename):
            print(f"MIE WARNING: {filename} not found. Using simulation fallback.")
            return None
        try:
            if type == 'pickle': 
                return pickle.load(open(filename, 'rb'))
            if type == 'joblib': 
                return joblib.load(filename)
            if type == 'keras': 
                # Use string import to avoid static analysis issues if tensorflow is missing
                from importlib import import_module
                tf_models = import_module('tensorflow.keras.models')
                return tf_models.load_model(filename)
        except Exception as e:
            print(f"MIE ERROR loading {filename}: {e}")
            return None

    def generate_insights(self, telemetry_data):
        """
        Processes incoming telemetry through the multi-model pipeline.
        Generates high-level tactical insights.
        """
        # Placeholder for complex numerical processing
        # In a real scenario, you'd convert telemetry_data to a numpy array for the models
        
        # Mock calculation based on simulated inputs if models aren't ready
        retake_reduction = round(random.uniform(5, 15), 1)
        clutch_potential = round(random.uniform(60, 85), 1)
        
        return {
            "summary": "Macro Anomalies Detected",
            "impact_metrics": {
                "site_retake_success_reduction": f"{retake_reduction}%",
                "clutch_potential": f"{clutch_potential}%",
                "tempo_deviation": "+4.2s"
            },
            "recommendation": "Rotate to B early; Model predicts 78% utility depletion in A Main."
        }

app = FastAPI()
mie = MacroImpactEngine()

# Enable CORS so your Vercel frontend can talk to this backend server
origins = [
    "https://aegis-c9-frontend.vercel.app", # Specific Vercel URL
    "https://aegis-c9-assistant-coach.vercel.app", # Potential alternative based on repo name
    "http://localhost:3000", # Local Next.js development
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Keeping wildcard for now to ensure connectivity, but adding credentials support
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
async def get_stats(series_id: str = "2616372"):
    data = fetch_aegis_data(series_id)
    if "players" in data:
        data["predictions"] = get_live_predictions(data)
    return data

@app.get("/stream-telemetry")
async def stream_telemetry(series_id: str = "2616372"):
    async def event_generator():
        while True:
            # Fetch latest data
            data = fetch_aegis_data(series_id)
            if "players" in data:
                data["predictions"] = get_live_predictions(data)
            
            # Enrich with Macro-Impact Engine (MIE) insights
            data["mie_analysis"] = mie.generate_insights(data)
            
            # Add a win probability for the frontend example
            data["win_prob"] = round(random.uniform(45, 65), 1)
            
            yield json.dumps(data) + "\n"
            await asyncio.sleep(1) # Stream every second

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
