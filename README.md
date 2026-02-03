# Aegis-C9 Assistant Coach 🎮🤖

**AI-Powered Real-Time Esports Analytics Platform for Cloud9**

An intelligent coaching assistant that provides live ML-driven tactical insights for League of Legends and VALORANT matches. Built for the Cloud9 organization to enhance competitive performance through real-time data analysis and predictive modeling.

![Cloud9](https://img.shields.io/badge/Cloud9-00AEEF?style=for-the-badge&logo=cloud9&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)

---

## ✨ Features

### 🎯 Real-Time Win Probability
- XGBoost ML model trained on 124,500+ professional match samples
- 91.2% model accuracy with 0.945 ROC-AUC score
- Live probability updates based on game state

### 📊 ML-Powered Tactical Insights
- **Objective Control Analysis** (22% weight) - Dragon/Baron priority recommendations
- **Gold Efficiency Tracking** (18% weight) - Farm pattern optimization
- **KDA Ratio Monitoring** (15% weight) - Player positioning suggestions
- **Damage Efficiency** (14% weight) - Target focus recommendations
- **Vision Control** (12% weight) - Ward placement priorities
- **Kill Participation** (10% weight) - Team fight involvement analysis
- **Survival Rate** (9% weight) - Death prevention strategies

### 🎮 Multi-Game Support
- **League of Legends** - Full dashboard with champion stats, objectives, and gold tracking
- **VALORANT** - Round-by-round analysis with agent performance metrics

### 📈 Live Dashboard
- Player performance cards with real-time KDA, CS, and impact scores
- Win probability chart with historical trend
- Tactical Comms feed with ML-driven suggestions
- Feature importance visualization
- Match configuration settings
- JSON export functionality

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.4** - React framework with App Router
- **React 19** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python API framework
- **XGBoost** - Gradient boosting ML models
- **scikit-learn** - Model training and preprocessing
- **joblib** - Model serialization
- **Uvicorn** - ASGI server

### Development Tools
- **WebStorm** - Frontend IDE
- **PyCharm** - Backend IDE
- **Junie** - AI-assisted development

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Princess-B-Kwaniya/Aegis-C9-assistant-coach.git
   cd Aegis-C9-assistant-coach
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd aegis_c9_backend
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   cd aegis_c9_backend
   python main.py
   ```
   Backend runs on `http://localhost:8000`

5. **Start the frontend** (new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure

```
Aegis-C9-assistant-coach/
├── aegis_c9_backend/           # Python FastAPI backend
│   ├── main.py                 # API endpoints & ML predictors
│   ├── bridge.py               # GRID API integration
│   ├── find_live_match.py      # Live match detection
│   └── data/
│       ├── lol/                # LoL ML model & training
│       │   ├── lol_model.json
│       │   ├── scaler.joblib
│       │   └── train_lol_model.py
│       └── valorant/           # VALORANT ML model
│           ├── valorant_model.json
│           └── scaler.joblib
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx            # LoL dashboard
│   │   └── valorant/page.tsx   # VALORANT dashboard
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Sidebar & navigation
│   │   └── modals/             # Settings modal
│   ├── hooks/                  # React hooks
│   │   ├── useAegisLive.ts     # LoL data hook
│   │   └── useValorantLive.ts  # VALORANT data hook
│   └── types/                  # TypeScript definitions
└── public/                     # Static assets
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/lol-predictions` | GET | LoL ML predictions & game state |
| `/valorant-predictions` | GET | VALORANT ML predictions |
| `/api/stats` | GET | Raw match statistics |
| `/stream-telemetry` | GET | Live telemetry stream (SSE) |

---

## 🧠 ML Model Details

### LoL Predictor (XGBoost)
- **Training Data**: 124,500 professional match samples
- **Features**: 15 engineered features from raw game stats
- **Target**: Win/Loss binary classification
- **Performance**: 91.2% accuracy, 0.945 ROC-AUC

### Feature Engineering
```python
# Key features used by the model
- kda_ratio = (kills + assists) / (deaths + 1)
- gold_efficiency = gold_earned / duration_mins
- damage_efficiency = damage_to_champ / damage_dealt
- vision_per_min = vision_score / duration_mins
- objective_control = (barons*3 + dragons*2 + towers) / 10
```

---

## 🎨 Screenshots

*Dashboard showing live win probability, player stats, and ML tactical insights*

---

## 👥 Team

Built with ❤️ for **Cloud9** 

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🙏 Acknowledgments

- Cloud9 Esports Organization
- GRID Esports Data API
- JetBrains (WebStorm, PyCharm, Junie)
