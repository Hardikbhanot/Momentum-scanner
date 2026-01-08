# Systematic Momentum Trading Dashboard

A full-stack algorithmic trading dashboard designed to automate the scanning, signal detection, and risk management for a "Trend + Consolidation + Breakout" momentum strategy.

## 🚀 Features
*   **Automated Scanning**: Scans a universe of US Tech stocks using `yfinance` daily data.
*   **Pattern Recognition**: Identifies "Riser" (Momentum) and "Tread" (Consolidation) patterns automatically.
*   **Risk Management**: Auto-calculates Stop Loss (at Low of Day or 1ATR) and Position Sizing (2% Risk).
*   **Transparency**: "Screening Audit" log explains exactly why stocks were rejected.
*   **Visual Interface**: Dark-mode financial terminal UI with interactive Recharts.

## 🛠️ Technology Stack
*   **Backend**: Python 3.10+, FastAPI, Pandas, NumPy, yfinance.
*   **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons.

## 📦 Installation & Setup

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

## ▶️ Running the Application

### Step 1: Start the Backend API
In a terminal, run the FastAPI server:
```bash
cd backend
# Starts server at http://127.0.0.1:8000
python -m uvicorn app.main:app --reload
```

### Step 2: Start the Frontend UI
In a separate terminal, start the React development server:
```bash
cd frontend
npm run dev
```

### Step 3: Access the Dashboard
Open your browser and navigate to the URL shown in the frontend terminal (usually `http://localhost:5173`).

## 📂 Project Structure
```
trading-system/
├── backend/
│   ├── app/
│   │   ├── main.py       # API Endpoints & Orchestration
│   │   ├── screener.py   # Data Fetching & Filtering Logic
│   │   ├── signaller.py  # Pattern Recognition Algorithm
│   │   └── executor.py   # Risk Management Math
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # UI Components (Charts, Tables)
│   │   └── App.jsx       # Main Dashboard Layout
└── README.md
```
