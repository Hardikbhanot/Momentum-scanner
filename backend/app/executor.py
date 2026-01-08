import pandas as pd
import numpy as np

ACCOUNT_SIZE = 100000
RISK_PER_TRADE = 0.02 # 2%

class Executor:
    def calculate_risk(self, item, signal_data):
        """
        Calculates position size and stop loss levels.
        """
        if not signal_data or signal_data['status'] == 'FAIL':
            return None
        
        df = item['df']
        curr_price = item['price']
        ticker = item['ticker']
        
        # Calculate ATR(14)
        high = df['High']
        low = df['Low']
        close = df['Close']
        prev_close = close.shift(1)
        
        tr1 = high - low
        tr2 = (high - prev_close).abs()
        tr3 = (low - prev_close).abs()
        
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        atr_14 = tr.rolling(window=14).mean().iloc[-1]
        
        # Stop Loss: Low of Day (LOD) of the trigger candle

        lod = df['Low'].iloc[-1]
        
        stop_dist = curr_price - lod
        max_stop_dist = 1.0 * atr_14
        
        # Constraint: Max distance = 1.0 * ATR(14)
        if stop_dist > max_stop_dist:
            # Cap the stop loss
            stop_price = curr_price - max_stop_dist
            note = "Capped at 1ATR"
        else:
            stop_price = lod
            note = "LOD"
            
        # Position Sizing
        # Risk Amount = $2000
        # Shares = Risk Amount / (Entry Price - Stop Price)
        risk_amt = ACCOUNT_SIZE * RISK_PER_TRADE
        risk_per_share = curr_price - stop_price
        
        if risk_per_share <= 0:
            shares = 0
        else:
            shares = int(risk_amt / risk_per_share)
            
        # Trailing Stop: 10-day SMA
        sma_10 = close.rolling(window=10).mean().iloc[-1]
        
        return {
            'risk_per_share': round(risk_per_share, 2),
            'stop_price': round(stop_price, 2),
            'stop_note': note,
            'shares': shares,
            'position_value': round(shares * curr_price, 2),
            'trailing_stop_sma10': round(sma_10, 2),
            'atr_14': round(atr_14, 2)
        }
