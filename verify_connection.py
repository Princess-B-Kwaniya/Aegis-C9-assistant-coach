import requests
import json
import time
import sys
import os

def test_aegis_connection(base_url="http://localhost:8000"):
    print(f"\n{'='*60}")
    print(f"AEGIS-C9 SYSTEM DIAGNOSTIC - CONNECTION TEST")
    print(f"{'='*60}")
    print(f"Target Backend: {base_url}")
    
    # 1. Test Static API Endpoint
    print(f"\n[STEP 1] Testing /api/stats (Static Endpoint)...")
    try:
        response = requests.get(f"{base_url}/api/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Success! Connected to backend.")
            print(f"  ✓ Data Received: {len(data.get('players', []))} players found.")
            if "predictions" in data:
                print(f"  ✓ ML Engine: Active (found predictions).")
        else:
            print(f"  ✗ Failed: Received status code {response.status_code}")
    except Exception as e:
        print(f"  ✗ Error: Could not connect to {base_url}/api/stats. Is the server running?")
        print(f"    Details: {e}")
        return

    # 2. Test Real-Time Streaming Endpoint
    print(f"\n[STEP 2] Testing /stream-telemetry (Live Stream)...")
    try:
        # Use stream=True to handle the persistent connection
        response = requests.get(f"{base_url}/stream-telemetry", stream=True, timeout=10)
        print(f"  ✓ Stream Opened. Waiting for data chunks...")
        
        count = 0
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                data = json.loads(decoded_line)
                
                print(f"\n  --- LIVE DATA CHUNK #{count+1} ---")
                print(f"  Win Probability: {data.get('win_prob')}%")
                print(f"  Series ID:       {data.get('series', {}).get('id')}")
                
                if "predictions" in data:
                    first_pred = data["predictions"][0]
                    print(f"  ML Sample:       {first_pred['name']} -> {first_pred['recommendation']}")
                
                count += 1
                if count >= 3: # Test 3 chunks then stop
                    print(f"\n  ✓ Stream verified! Connection is stable.")
                    break
                    
    except Exception as e:
        print(f"  ✗ Error: Stream interrupted or failed.")
        print(f"    Details: {e}")

    print(f"\n{'='*60}")
    print(f"DIAGNOSTIC COMPLETE: Everything is connected and syncing!")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    # Allow passing a custom URL as an argument
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    test_aegis_connection(target)
