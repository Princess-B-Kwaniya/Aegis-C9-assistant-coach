import xgboost as xgb
import pandas as pd
import numpy as np
import os
import joblib

class ValorantPredictor:
    def __init__(self, model_path='valorant_model.json', scaler_path='scaler.joblib'):
        # Find path relative to this script
        base_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(base_dir, 'data', 'valorant')
        
        # Model path resolution
        target_model_path = None
        if os.path.exists(model_path):
            target_model_path = model_path
        elif os.path.exists(os.path.join(data_dir, 'valorant_model.json')):
            target_model_path = os.path.join(data_dir, 'valorant_model.json')
        
        if target_model_path:
            self.model = xgb.Booster()
            self.model.load_model(target_model_path)
        else:
            print(f"Warning: Model file not found")
            self.model = None

        # Scaler path resolution
        target_scaler_path = None
        if os.path.exists(scaler_path):
            target_scaler_path = scaler_path
        elif os.path.exists(os.path.join(data_dir, 'scaler.joblib')):
            target_scaler_path = os.path.join(data_dir, 'scaler.joblib')
        
        if target_scaler_path:
            self.scaler = joblib.load(target_scaler_path)
        else:
            print(f"Warning: Scaler file not found")
            self.scaler = None

        # Feature names must match exactly what was used in training, including order
        # If the model was trained with DataFrame, it expects these names.
        self.features = [
            'Deaths', 'Headshot_Pct', 'First Kills', 'First Deaths',
            'Survival_Rate', 'Headshot_Impact', 'First_Blood_Dominance',
            'Damage_Per_Round', 'Consistency', 'First_Engagement', 'Clutch_Factor'
        ]
        
        if self.model:
            # Override with actual feature names from the model if available
            try:
                model_features = self.model.feature_names
                if model_features:
                    self.features = model_features
            except:
                pass

    def _preprocess(self, data):
        """
        Preprocess raw match data into engineered features.
        Expected input 'data' is a dictionary with keys:
        'Kills', 'Deaths', 'Assists', 'Headshot %', 'First Kills', 'First Deaths', 'Average Damage Per Round'
        """
        # Clean Headshot %
        hs_pct_raw = data.get('Headshot %', '0%')
        if isinstance(hs_pct_raw, str):
            hs_pct = float(hs_pct_raw.replace('%', '').strip()) / 100.0
        else:
            hs_pct = float(hs_pct_raw)

        kills = float(data.get('Kills', 0))
        deaths = float(data.get('Deaths', 0))
        assists = float(data.get('Assists', 0))
        fk = float(data.get('First Kills', 0))
        fd = float(data.get('First Deaths', 0))
        adpr = float(data.get('Average Damage Per Round', 0))

        # Engineering (Matching train_valorant_model.py)
        survival_rate = 1.0 / (deaths + 1)
        headshot_impact = hs_pct * kills
        fb_dominance = fk - fd
        damage_per_round = adpr / 50.0
        consistency = 1.0 / (deaths + 1)
        first_engagement = (fk + fd) / 26.0
        clutch_factor = (kills - assists) / (kills + 1)

        processed = {
            'Deaths': deaths,
            'Headshot_Pct': hs_pct,
            'First Kills': fk,
            'First Deaths': fd,
            'Survival_Rate': survival_rate,
            'Headshot_Impact': headshot_impact,
            'First_Blood_Dominance': fb_dominance,
            'Damage_Per_Round': damage_per_round,
            'Consistency': consistency,
            'First_Engagement': first_engagement,
            'Clutch_Factor': clutch_factor
        }

        return pd.DataFrame([processed])[self.features]

    def predict_high_assists(self, player_stats):
        """
        Predicts if a player will have high assists (above median).
        Returns probability of high assists.
        """
        if self.model is None:
            return 0.5 # Default if model not loaded

        try:
            X = self._preprocess(player_stats)
            
            # Apply scaling if available
            if self.scaler:
                X_scaled = self.scaler.transform(X)
                X = pd.DataFrame(X_scaled, columns=self.features)
            
            # DMatrix needs feature names if the model has them
            dmatrix = xgb.DMatrix(X, feature_names=list(X.columns))
            proba = self.model.predict(dmatrix)[0]
            return float(proba)
        except Exception as e:
            print(f"Prediction error: {e}")
            return 0.0

def get_live_predictions(match_data):
    """
    Interface function for bridge.py.
    Processes a list of players in match_data.
    """
    predictor = ValorantPredictor()
    predictions = []
    
    players = match_data.get('players', [])
    for player in players:
        stats = player.get('stats', {})
        prob = predictor.predict_high_assists(stats)
        predictions.append({
            'name': player.get('name', 'Unknown'),
            'team': player.get('team', 'Unknown'),
            'high_assist_probability': prob,
            'recommendation': "Support Role High Impact" if prob > 0.6 else "Focus on Entry/Frags"
        })
    
    return predictions

if __name__ == "__main__":
    # Example test
    sample_match = {
        'players': [
            {
                'name': 'TenZ',
                'team': 'Sentinels',
                'stats': {
                    'Kills': 20,
                    'Deaths': 15,
                    'Assists': 5,
                    'Headshot %': '25%',
                    'First Kills': 3,
                    'First Deaths': 2,
                    'Average Damage Per Round': 150
                }
            }
        ]
    }
    
    results = get_live_predictions(sample_match)
    for res in results:
        print(f"Player: {res['name']} | High Assist Prob: {res['high_assist_probability']:.2f} | Rec: {res['recommendation']}")
