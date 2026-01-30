from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bridge import fetch_aegis_data
from find_live_match import get_live_predictions

app = FastAPI()

# Enable CORS so your Vercel frontend can talk to this local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
async def get_stats(series_id: str = "2616372"):
    data = fetch_aegis_data(series_id)
    if "players" in data:
        data["predictions"] = get_live_predictions(data)
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
