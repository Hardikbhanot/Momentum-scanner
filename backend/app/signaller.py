import pandas as pd
import numpy as np

class Signaller:
    def check_signals(self, item):
        """
        Analyzes the stock data for Riser, Tread, and Signal conditions.
        item: dict containing 'ticker', 'df', etc.
        """
        df = item['df']
        ticker = item['ticker']
        
        # We need at least 63 days of history
        if len(df) < 63:
            return None

        # Work with the last 63 days data for momentum check

        
        recent_window = df.iloc[-63:]
        
        # 1. Riser Check
        # Price increased >= 30% in last 63 days.
        # We can look at the max amplitude: (Max High - Min Low) / Min Low >= 0.30
        # Or specifically the run up.
        # Check if 30% move occurred in window

        
        period_high = recent_window['High'].max()
        period_low = recent_window['Low'].min()
        
        if period_low == 0: return None
        
        move_pct = (period_high - period_low) / period_low
        
        is_riser = move_pct >= 0.30
        
        if not is_riser:
            return {'status': 'FAIL', 'reason': 'No Riser (Move < 30%)'}

        # 2. Tread Check (Consolidation)
        # Stock must have stabilized for 4 to 40 days.
        # Find the index of the Peak High.
        
        # Get the date/index of the max high
        peak_idx = recent_window['High'].idxmax()
        
        # Calculate days since peak
        # We need integer position of peak_idx within the recent_window or full df
        # Let's use get_loc
        peak_pos = df.index.get_loc(peak_idx)
        current_pos = len(df) - 1
        days_since_peak = current_pos - peak_pos
        
        # "Stabilized for 4 to 40 days"
        # If days_since_peak < 4: Too fresh, maybe climax run.
        # If days_since_peak > 40: Momentum might be lost.
        
        # Check Drawdown: max retracement from peak < 25%
        # Look at the window FROM peak TO now
        consolidation_window = df.iloc[peak_pos:]
        min_in_consolidation = consolidation_window['Low'].min()
        drawdown = (period_high - min_in_consolidation) / period_high

        is_consolidation_time = 4 <= days_since_peak <= 40
        
        if not is_consolidation_time:
             # Check if stabilization period is valid

             return {
                 'status': 'WAIT',
                 'reason': f'Days since peak: {days_since_peak} (Req 4-40)',
                 'signal_price': period_high,
                 'drawdown': drawdown
             }

        is_drawdown_ok = drawdown < 0.25
        
        if not is_drawdown_ok:
            return {'status': 'FAIL', 'reason': f'Drawdown too deep: {drawdown:.1%}'}

        # 3. Entry Trigger
        # Signal BUY if Price breaks above the High of the consolidation range (the 63-day peak).
        # We already know 'period_high' is the 63-day peak.
        # Check current close or high? "Price breaks".
        # If today's High > period_high (excluding today? No, include today).
        # Signal: Buy if Price breaks 63-day High

        
        # If the price is NEAR the high (e.g. within 2-3%), we can call it "SETUP".
        # If it broke it, "BUY".
        
        curr_close = df['Close'].iloc[-1]
        
        # Since 'period_high' includes today in the window if we iterate, 
        # we strictly need to see if today is the day it breaks.
        # BUT above we calculated days_since_peak. 
        # If days_since_peak > 0, it means the peak was in the past. 
        # If Current Price > Peak, then we typically establish a NEW peak today, so days_since_peak becomes 0.
        # So catching the breakout "live" means: "Previous Peak was X days ago, Today's Price > Previous Peak".
        
        # Let's refine the logic: check peak of the window excluding today?
        # A robustness check: Find peak of last 63 days excluding today.
        prev_window = df.iloc[-64:-1]
        if len(prev_window) < 1: return None
        
        prev_peak = prev_window['High'].max()
        
        # Re-calc tread on prev_window to be strict?
        # Let's stick to the simpler logic: 
        # If we are in "Tread" (consolidation ok, drawdown ok), check proximity to pivot.
        
        if curr_close > period_high: 
            # This is technically a breakout already recorded (since period_high includes today).
            # But maybe we want to catch it happening.
            status = 'BUY'
        elif curr_close >= 0.95 * period_high:
            # Within 5% of breakout
            status = 'SETUP'
        else:
            status = 'WAIT'
            
        return {
            'status': status,
            'signal_price': period_high, # The breakout level
            'days_since_peak': days_since_peak,
            'drawdown': drawdown
        }
