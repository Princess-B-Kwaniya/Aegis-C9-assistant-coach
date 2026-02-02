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
all_matches_files = glob.glob(os.path.join(DATA_DIR, "matches/*.csv"), recursive=False)

if not all_matches_files:
    print("ERROR: No match CSV files found in 'matches/' folder.")
    print("Please ensure your LoL data is organized appropriately.")
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

# CSV columns based on actual data: kills, deaths, assists, gold_earned, win, duration,
# damage_to_champ, damage_dealt, damage_taken, vision_score, kill_participation,
# team_baronKills, team_dragonKills, team_towerKills, etc.

critical_features = ['kills', 'deaths', 'assists', 'gold_earned', 'win']
available_critical = [c for c in critical_features if c in master_df.columns]
master_df = master_df.dropna(subset=available_critical)
print(f"  After cleaning: {len(master_df):,} records")

# Clean win column (convert TRUE/FALSE string to 1/0)
def clean_boolean(val):
    if pd.isna(val):
        return 0
    if isinstance(val, bool):
        return 1 if val else 0
    val_str = str(val).upper().strip()
    if val_str in ['TRUE', '1', 'YES', 'WIN']:
        return 1
    return 0

master_df['win_binary'] = master_df['win'].apply(clean_boolean)
print(f"  Win distribution: Win={master_df['win_binary'].sum():,} | Loss={len(master_df) - master_df['win_binary'].sum():,}")

# --- PHASE 3: FEATURE ENGINEERING (PREDICTIVE ONLY - NO LEAKAGE) ---
print("\n[PHASE 3] Advanced Feature Engineering (Predictive Features Only)...")

# 1. SKILL-BASED METRICS
master_df['KDA_Ratio'] = (master_df['kills'] + master_df['assists']) / (master_df['deaths'] + 1)
master_df['Kill_Death_Diff'] = master_df['kills'] - master_df['deaths']
master_df['Survival_Rate'] = 1.0 / (master_df['deaths'] + 1)
master_df['Assist_Ratio'] = master_df['assists'] / (master_df['kills'] + 1)

# 2. ECONOMY METRICS
master_df['Gold_Efficiency'] = master_df['gold_earned'] / (master_df['duration'] / 60.0 + 1)
master_df['Gold_Spent_Ratio'] = master_df['gold_spent'] / (master_df['gold_earned'] + 1)

# 3. DAMAGE METRICS
master_df['Damage_Efficiency'] = master_df['damage_to_champ'] / (master_df['damage_dealt'] + 1)
master_df['Damage_Per_Gold'] = master_df['damage_to_champ'] / (master_df['gold_earned'] + 1)
master_df['Damage_Taken_Ratio'] = master_df['damage_taken'] / (master_df['damage_dealt'] + 1)

# 4. ENGAGEMENT METRICS
master_df['Vision_Per_Min'] = master_df['vision_score'] / (master_df['duration'] / 60.0 + 1)

# 5. TEAM OBJECTIVE METRICS (normalized)
master_df['Objective_Control'] = (
    master_df['team_baronKills'] * 3 + 
    master_df['team_dragonKills'] * 2 + 
    master_df['team_riftHeraldKills'] * 1.5 + 
    master_df['team_towerKills'] + 
    master_df['team_inhibitorKills'] * 2
) / 20.0

# 6. FINAL STATS METRICS (end game power level)
master_df['Final_Power_Score'] = (
    master_df['final_attackDamage'] + 
    master_df['final_abilityPower'] + 
    master_df['final_armor'] + 
    master_df['final_health'] / 10
) / 100.0

# CREATE TARGET
print("  Creating target variable (Win/Loss)...")
master_df['Target'] = master_df['win_binary']

# Select features for prediction
ENGINEERED_FEATURES = [
    'deaths', 'kills', 'assists', 
    'KDA_Ratio', 'Kill_Death_Diff', 'Survival_Rate', 'Assist_Ratio',
    'Gold_Efficiency', 'Gold_Spent_Ratio',
    'Damage_Efficiency', 'Damage_Per_Gold', 'Damage_Taken_Ratio',
    'Vision_Per_Min', 'Objective_Control', 'Final_Power_Score',
    'kill_participation'
]

# Filter to only available columns
ENGINEERED_FEATURES = [f for f in ENGINEERED_FEATURES if f in master_df.columns]

# --- PHASE 4: DATA PREPARATION ---
print("\n[PHASE 4] Data Preparation & Normalization...")

master_df = master_df.dropna(subset=ENGINEERED_FEATURES + ['Target'])
X = master_df[ENGINEERED_FEATURES].copy()
y = master_df['Target'].copy()

X = X.replace([np.inf, -np.inf], 0).fillna(0)

# Clip outliers (Z-score > 3)
for col in X.columns:
    mean, std = X[col].mean(), X[col].std()
    if std > 0:
        X[col] = X[col].clip(mean - 3*std, mean + 3*std)

print(f"  Final dataset: {len(X):,} samples, {len(ENGINEERED_FEATURES)} features")
print(f"  Target distribution: Win={y.sum():,} ({y.mean()*100:.1f}%) | Loss={len(y)-y.sum():,} ({(1-y.mean())*100:.1f}%)")
print(f"  Features: {ENGINEERED_FEATURES}")

# --- PHASE 5: FEATURE SCALING ---
print("\n[PHASE 5] Feature Scaling (RobustScaler)...")
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
X = pd.DataFrame(X_scaled, columns=ENGINEERED_FEATURES)

# --- PHASE 6: TRAIN-TEST SPLIT ---
print("\n[PHASE 6] Train-Test Split (80-20 Stratified)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"  Training: {len(X_train):,} | Testing: {len(X_test):,}")

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

# --- PHASE 8: MODEL EVALUATION ---
print("\n[PHASE 8] Model Evaluation & Validation...")

predictions = model.predict(X_test)
pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, predictions)
auc_score = roc_auc_score(y_test, pred_proba)

print(f"\n{'='*80}")
print(f"MODEL PERFORMANCE METRICS")
print(f"{'='*80}")
print(f"  Accuracy:        {accuracy*100:.2f}%")
print(f"  ROC-AUC Score:   {auc_score:.4f}")
print(f"{'='*80}")

print("\nDetailed Classification Report:")
print(classification_report(y_test, predictions, target_names=['Loss', 'Win']))

cm = confusion_matrix(y_test, predictions)
specificity = cm[0,0] / (cm[0,0] + cm[0,1]) if (cm[0,0] + cm[0,1]) > 0 else 0
sensitivity = cm[1,1] / (cm[1,0] + cm[1,1]) if (cm[1,0] + cm[1,1]) > 0 else 0
print(f"\nConfusion Matrix Analysis:")
print(f"  True Negatives:  {cm[0,0]:,} | Specificity: {specificity*100:.2f}%")
print(f"  False Positives: {cm[0,1]:,}")
print(f"  False Negatives: {cm[1,0]:,}")
print(f"  True Positives:  {cm[1,1]:,} | Sensitivity: {sensitivity*100:.2f}%")

# Feature Importance
print("\n[PHASE 9] Feature Importance...")
feature_importance = model.feature_importances_
feature_names = ENGINEERED_FEATURES
importance_df = pd.DataFrame({'feature': feature_names, 'importance': feature_importance})
importance_df = importance_df.sort_values('importance', ascending=False)
print("\nTop Features:")
for idx, row in importance_df.head(10).iterrows():
    print(f"  {row['feature']}: {row['importance']*100:.2f}%")

# --- PHASE 10: SAVING ---
print(f"\n[PHASE 10] Saving Model and Scaler...")
model.save_model(OUTPUT_MODEL_PATH)
joblib.dump(scaler, 'scaler.joblib')

# Save feature list for reference
with open('features.txt', 'w') as f:
    f.write('\n'.join(ENGINEERED_FEATURES))

print(f"✓ Model saved: {OUTPUT_MODEL_PATH}")
print(f"✓ Scaler saved: scaler.joblib")
print(f"✓ Features saved: features.txt")

print("\n" + "="*80)
print("AEGIS-C9 LOL MODEL - TRAINING COMPLETE")
print("="*80)
