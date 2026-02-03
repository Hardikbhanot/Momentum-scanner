from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .screener import Screener
from .signaller import Signaller
from .executor import Executor
import yfinance as yf
import pandas as pd

app = FastAPI(title="Momentum Trading Dashboard")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

screener = Screener()
signaller = Signaller()
executor = Executor()

import datetime
import pytz

def get_market_status():
    # US Market Hours: 9:30 AM - 4:00 PM Eastern, Mon-Fri
    tz = pytz.timezone('US/Eastern')
    now = datetime.datetime.now(tz)
    
    # Check Weekend
    if now.weekday() >= 5: # 5=Sat, 6=Sun
        return 'CLOSED'
        
    start_time = now.replace(hour=9, minute=30, second=0, microsecond=0)
    end_time = now.replace(hour=16, minute=0, second=0, microsecond=0)
    
    if start_time <= now <= end_time:
        return 'OPEN'
    else:
        return 'CLOSED'

@app.get("/scan")
def run_scan():
    try:
        # 1. Screen
        raw_data = screener.fetch_data()
        candidates, rejected = screener.filter_universe(raw_data)
        
        results = []
        
        # 2. Signal & 3. Execute logic
        for item in candidates:
            sig = signaller.check_signals(item)
            
            # Determine signal status

            status = 'WAIT'
            signal_data = {}
            exec_data = {}
            
            if sig:
                status = sig['status']
                signal_data = sig
                
                # Calculate execution metrics
                exec_data = executor.calculate_risk(item, sig)
            else:
                 # Signaller returned None (unlikely with current code unless error)
                 rejected.append({'ticker': item['ticker'], 'reason': 'Signal Check Failed (Unknown)'})
                 continue

            # If status failed filters in signaller, it returns 'FAIL'. We skip those.
            if status == 'FAIL':
                reason = sig.get('reason', 'Failed Signal Criteria')
                rejected.append({'ticker': item['ticker'], 'reason': reason})
                continue
                
            results.append({
                'ticker': item['ticker'],
                'price': round(item['price'], 2),
                'sma_50': round(item['sma_50'], 2),
                'vol_avg': int(item['vol_avg']),
                'status': status,
                'signal_details': signal_data,
                'execution': exec_data
            })
            
        return {
            'status': get_market_status(),
            'candidates': results,
            'rejected': rejected,
            'universe_size': len(screener.universe)
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{ticker}")
def get_history(ticker: str):
    try:
        # Fetch 1y data to show context + SMA50
        df = yf.download(ticker, period="1y", interval="1d", progress=False)
        if df.empty:
             raise HTTPException(status_code=404, detail="Ticker not found")
        
        # Flatten MultiIndex if present (yfinance 0.2+ often returns MultiIndex)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.droplevel(1)

        # Ensure we have SMA50
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        
        # Reset index to make Date a column
        df.reset_index(inplace=True)
        
        # Format for Recharts: list of dicts
        # { date: '2023-01-01', open: 100, high: 110... }
        chart_data = []
        for _, row in df.iterrows():
            chart_data.append({
                'date': row['Date'].strftime('%Y-%m-%d'),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume']),
                'sma_50': float(row['SMA_50']) if not pd.isna(row['SMA_50']) else None
            })
            
        return chart_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
