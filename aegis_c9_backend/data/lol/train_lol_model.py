import pandas as pd
import glob
import os
import xgboost as xgb
from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.preprocessing import StandardScaler, RobustScaler
import numpy as np
import warnings
import joblib

warnings.filterwarnings('ignore')

print("="*80)
print("AEGIS-C9 LOL PREDICTION MODEL - ELITE COACHING SYSTEM")
print("="*80)

# --- CONFIGURATION ---
DATA_DIR = '.' 
OUTPUT_MODEL_PATH = 'lol_model.json'

# --- PHASE 1: DATA LOADING & CONSOLIDATION ---
print("\n[PHASE 1] Loading LoL Historical Data...")
# Note: Adjust these glob patterns to match your LoL data structure
all_matches_files = glob.glob(os.path.join(DATA_DIR, "matches/*.csv"), recursive=False)

if not all_matches_files:
    print("ERROR: No match CSV files found in 'matches/' folder.")
    print("Please ensure your LoL data is organized appropriately.")
    # For now, we will exit if no data, but you should populate the 'matches' folder
    exit()

df_list = []
for filename in all_matches_files:
    try:
        df = pd.read_csv(filename, low_memory=False)
        df_list.append(df)
        print(f"  ✓ Match Data: {os.path.basename(filename)} ({len(df)} rows)")
    except Exception as e:
        print(f"  ✗ {filename}: {e}")

if not df_list:
    print("ERROR: Could not load any data.")
    exit()

master_df = pd.concat(df_list, axis=0, ignore_index=True)
print(f"\n  Total Records: {len(master_df):,}")

# --- PHASE 2: DATA CLEANING & PREPROCESSING ---
print("\n[PHASE 2] Data Cleaning & Preprocessing...")

# Example critical features for LoL - update based on your CSV columns
critical_features = ['kills', 'deaths', 'assists', 'gold_earned', 'win']
# Ensure columns exist before dropping
available_critical = [c for c in critical_features if c in master_df.columns]
master_df = master_df.dropna(subset=available_critical)
print(f"  After cleaning: {len(master_df):,} records")

# --- PHASE 3: FEATURE ENGINEERING ---
print("\n[PHASE 3] Advanced Feature Engineering...")

# Example LoL Metrics
if 'kills' in master_df.columns and 'deaths' in master_df.columns:
    master_df['KDA'] = (master_df['kills'] + master_df['assists']) / (master_df['deaths'] + 1)
    master_df['Kill_Participation'] = master_df['kills'] / (master_df['kills'].mean() + 1) # Simplified
    
if 'gold_earned' in master_df.columns and 'game_duration' in master_df.columns:
    master_df['GPM'] = master_df['gold_earned'] / (master_df['game_duration'] / 60.0)

# Define target and features
# Target: 'win' (1 for win, 0 for loss)
if 'win' in master_df.columns:
    master_df['Target'] = master_df['win'].astype(int)
else:
    # Placeholder target if 'win' is not present
    print("WARNING: 'win' column not found. Using a dummy target for structure.")
    master_df['Target'] = np.random.randint(0, 2, size=len(master_df))

# Features to use for prediction (update these to match your LoL dataset)
ENGINEERED_FEATURES = [col for col in ['kills', 'deaths', 'assists', 'gold_earned', 'KDA', 'GPM'] if col in master_df.columns]

if not ENGINEERED_FEATURES:
    print("ERROR: No features available for training.")
    exit()

# --- PHASE 4: DATA PREPARATION ---
print("\n[PHASE 4] Data Preparation & Normalization...")

master_df = master_df.dropna(subset=ENGINEERED_FEATURES + ['Target'])
X = master_df[ENGINEERED_FEATURES].copy()
y = master_df['Target'].copy()

X = X.replace([np.inf, -np.inf], 0).fillna(0)

# Clip outliers
for col in X.columns:
    mean, std = X[col].mean(), X[col].std()
    if std > 0:
        X[col] = X[col].clip(mean - 3*std, mean + 3*std)

print(f"  Final dataset: {len(X):,} samples, {len(ENGINEERED_FEATURES)} features")

# --- PHASE 5: FEATURE SCALING ---
print("\n[PHASE 5] Feature Scaling (RobustScaler)...")
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
X = pd.DataFrame(X_scaled, columns=ENGINEERED_FEATURES)

# --- PHASE 6: TRAIN-TEST SPLIT ---
print("\n[PHASE 6] Train-Test Split...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- PHASE 7: TRAINING ---
print("\n[PHASE 7] Fast Training...")
model = xgb.XGBClassifier(
    objective='binary:logistic',
    use_label_encoder=False,
    eval_metric='logloss',
    random_state=42,
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1
)
model.fit(X_train, y_train)

# --- PHASE 8: EVALUATION ---
print("\n[PHASE 8] Model Evaluation...")
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"  Accuracy: {accuracy*100:.2f}%")

# --- PHASE 9: SAVING ---
print(f"\n[PHASE 9] Saving Model and Scaler...")
model.save_model(OUTPUT_MODEL_PATH)
joblib.dump(scaler, 'scaler.joblib')
print(f"✓ Model saved: {OUTPUT_MODEL_PATH}")
print(f"✓ Scaler saved: scaler.joblib")

print("\n" + "="*80)
print("AEGIS-C9 LOL MODEL - TRAINING COMPLETE")
print("="*80)
