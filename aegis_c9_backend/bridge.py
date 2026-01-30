import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Verify the script identity
print(f"ACTIVE FILE: {os.path.abspath(__file__)}")

def simulated_live_stats():
    return {
        "status": "simulated",
        "series": {
            "id": "2616372",
            "teams": [
                {"baseInfo": {"name": "Cloud9 (Simulated)"}},
                {"baseInfo": {"name": "Opponent (Simulated)"}}
            ]
        }
    }

def fetch_aegis_data(series_id="2616372"):
    # FINAL PRODUCTION URL FOR CENTRAL DATA
    url = "https://api.grid.gg/central-data/graphql"
    
    api_key = os.getenv("GRID_API_KEY")
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }

    query = """
    query GetSeries($id: ID!) {
      series(id: $id) {
        id
        teams { baseInfo { name } }
      }
    }
    """

    try:
        # Verify the key exists
        if not api_key:
            return {"error": "API Key is missing in your .env file!"}

        print(f"--- AEGIS-C9 | TARGETING: {url} ---")
        # Testing with one of your known Series IDs
        response = requests.post(url, json={'query': query, 'variables': {'id': series_id}}, headers=headers)
        
        # This will catch if the URL or Key is incorrect
        response.raise_for_status()
        
        data = response.json()
        
        # Check for PERMISSION_DENIED error
        if 'errors' in data:
            for error in data['errors']:
                if error.get('extensions', {}).get('code') == 'PERMISSION_DENIED' or \
                   error.get('extensions', {}).get('errorType') == 'PERMISSION_DENIED':
                    print("--- AEGIS-C9 | PERMISSION DENIED: Switching to Simulated Data ---")
                    return simulated_live_stats()
        
        return data

    except requests.exceptions.HTTPError as e:
        return {"error": f"Status {e.response.status_code}", "msg": "Check Central Data permissions or ID availability."}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    result = fetch_aegis_data()
    print(result)
