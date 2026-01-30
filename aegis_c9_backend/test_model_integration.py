import unittest
import pandas as pd
import os
import sys
import json

# Add parent directory to path to import find_live_match
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from find_live_match import ValorantPredictor, get_live_predictions

class TestValorantModel(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.predictor = ValorantPredictor()
        # Path to data for verification
        cls.data_file = os.path.join(os.path.dirname(__file__), 'data', 'valorant', 'vct_2025', 'matches', 'overview.csv')

    def test_model_loading(self):
        """Verify the model is loaded correctly"""
        self.assertIsNotNone(self.predictor.model)
        # Check if it has the predict method (standard for XGBoost)
        self.assertTrue(has_value := hasattr(self.predictor.model, 'predict'))

    def test_preprocessing(self):
        """Test if raw data is correctly transformed into features"""
        raw_data = {
            'Kills': 25,
            'Deaths': 10,
            'Assists': 5,
            'Headshot %': '30%',
            'First Kills': 4,
            'First Deaths': 2,
            'Average Damage Per Round': 180
        }
        processed = self.predictor._preprocess(raw_data)
        
        self.assertEqual(processed['Deaths'][0], 10.0)
        self.assertEqual(processed['Headshot_Pct'][0], 0.30)
        self.assertEqual(processed['First Kills'][0], 4.0)
        self.assertEqual(processed['Survival_Rate'][0], 1.0 / 11.0)
        self.assertEqual(processed['Headshot_Impact'][0], 0.30 * 25)

    def test_prediction_output(self):
        """Test prediction output range and type"""
        raw_data = {
            'Kills': 10,
            'Deaths': 20,
            'Assists': 2,
            'Headshot %': '10%',
            'First Kills': 1,
            'First Deaths': 5,
            'Average Damage Per Round': 80
        }
        prob = self.predictor.predict_high_assists(raw_data)
        self.assertIsInstance(prob, float)
        self.assertTrue(0.0 <= prob <= 1.0)

    def test_get_live_predictions(self):
        """Test the batch prediction interface"""
        match_data = {
            'players': [
                {
                    'name': 'TestPlayer',
                    'team': 'TestTeam',
                    'stats': {
                        'Kills': 15, 'Deaths': 15, 'Assists': 5,
                        'Headshot %': '20%', 'First Kills': 2, 'First Deaths': 2,
                        'Average Damage Per Round': 130
                    }
                }
            ]
        }
        results = get_live_predictions(match_data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'TestPlayer')
        self.assertIn('recommendation', results[0])

    def test_real_data_samples(self):
        """Verify the model against samples from the overview.csv"""
        if os.path.exists(self.data_file):
            df = pd.read_csv(self.data_file, nrows=10)
            for _, row in df.iterrows():
                stats = {
                    'Kills': row['Kills'],
                    'Deaths': row['Deaths'],
                    'Assists': row['Assists'],
                    'Headshot %': row['Headshot %'],
                    'First Kills': row['First Kills'],
                    'First Deaths': row['First Deaths'],
                    'Average Damage Per Round': row['Average Damage Per Round']
                }
                prob = self.predictor.predict_high_assists(stats)
                self.assertTrue(0.0 <= prob <= 1.0)
        else:
            self.skipTest("Real data file not found for sample testing")

if __name__ == '__main__':
    unittest.main()
