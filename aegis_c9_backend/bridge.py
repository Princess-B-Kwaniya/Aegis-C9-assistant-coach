import requests
import os
from dotenv import load_dotenv
from find_live_match import get_live_predictions

load_dotenv()

# Verify the script identity
print(f"ACTIVE FILE: {os.path.abspath(__file__)}")

def simulated_live_stats():
    """
    Returns simulated live match data enriched with stats for the model.
    """
    return {
        "status": "simulated",
        "series": {
            "id": "2616372",
            "teams": [
                {"baseInfo": {"name": "Cloud9 (Simulated)"}},
                {"baseInfo": {"name": "Opponent (Simulated)"}}
            ]
        },
        "players": [
            {
                "name": "C9 Player 1",
                "team": "Cloud9",
                "stats": {
                    "Kills": 18, "Deaths": 12, "Assists": 8,
                    "Headshot %": "22%", "First Kills": 2, "First Deaths": 1,
                    "Average Damage Per Round": 145
                }
            },
            {
                "name": "Opponent Player 1",
                "team": "Opponent",
                "stats": {
                    "Kills": 12, "Deaths": 18, "Assists": 4,
                    "Headshot %": "18%", "First Kills": 1, "First Deaths": 3,
                    "Average Damage Per Round": 110
                }
            }
        ]
    }

def fetch_aegis_data(series_id="2616372"):
    """
    Fetches live data from GRID API or fallback to simulated data.
    Refactored for performance with Session management.
    """
    url = "https://api.grid.gg/central-data/graphql"
    api_key = os.getenv("GRID_API_KEY")
    
    if not api_key:
        print("--- AEGIS-C9 | ERROR: API Key is missing! ---")
        return simulated_live_stats()

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }

    query = """
    query GetSeries($id: ID!) {
      series(id: $id) {
        id
        teams { 
            baseInfo { name }
        }
      }
    }
    """

    try:
        print(f"--- AEGIS-C9 | TARGETING: {url} ---")
        
        with requests.Session() as session:
            response = session.post(
                url, 
                json={'query': query, 'variables': {'id': series_id}}, 
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
        
        if 'errors' in data:
            for error in data['errors']:
                if error.get('extensions', {}).get('code') == 'PERMISSION_DENIED':
                    print("--- AEGIS-C9 | PERMISSION DENIED: Switching to Simulated Data ---")
                    return simulated_live_stats()
        
        # Enrich real data with dummy stats for model if missing (since real API might not have all yet)
        if 'players' not in data:
             data.update(simulated_live_stats())
             
        return data

    except requests.exceptions.RequestException as e:
        print(f"--- AEGIS-C9 | CONNECTION ERROR: {e} | Falling back to Simulation ---")
        return simulated_live_stats()
    except Exception as e:
        print(f"--- AEGIS-C9 | ERROR: {e} ---")
        return {"error": str(e)}

def run_coaching_bridge():
    """
    Main entry point for the coaching system.
    Fetches data and runs predictions.
    """
    print("\n--- AEGIS-C9 | STARTING COACHING BRIDGE ---")
    match_data = fetch_aegis_data()
    
    if "error" in match_data:
        print(f"Critical error in bridge: {match_data['error']}")
        return

    print("--- AEGIS-C9 | DATA FETCHED | ANALYZING WITH XGBOOST MODEL ---")
    predictions = get_live_predictions(match_data)
    
    print("\n[LIVE ANALYTICS & COACHING RECOMMENDATIONS]")
    for pred in predictions:
        print(f"Player: {pred['name']:20} | Assist Prob: {pred['high_assist_probability']:.2f} | Rec: {pred['recommendation']}")
    
    return predictions

if __name__ == "__main__":
    run_coaching_bridge()
