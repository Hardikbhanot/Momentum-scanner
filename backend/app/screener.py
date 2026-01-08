import yfinance as yf
import pandas as pd
import numpy as np

UNIVERSE = [
    'AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN', 'META', 'TSLA', 'AMD', 'INTC', 'CSCO',
    'NFLX', 'PEP', 'ADBE', 'PYPL', 'CMCSA', 'QCOM', 'TXN', 'AVGO', 'COST', 'TMUS'
]

class Screener:
    def __init__(self):
        self.universe = UNIVERSE

    def fetch_data(self):
        # Fetch 1 year of daily data to ensure sufficient history for SMA-50 and 63-day momentum logic.
        data = yf.download(self.universe, period="1y", interval="1d", group_by='ticker', progress=False)
        return data

    def filter_universe(self, data):
        """
        Applies filters:
        1. Price >= $3.00
        2. 50-day Avg Vol >= 300k
        3. Price > 50-day SMA
        """
        valid_tickers = []
        rejected_tickers = []
        
        # yfinance returns a MultiIndex if multiple tickers
        for ticker in self.universe:
            try:
                df = data[ticker].copy()
                if df.empty:
                    rejected_tickers.append({'ticker': ticker, 'reason': 'No Data'})
                    continue
                
                # drop na
                df.dropna(inplace=True)
                
                # Check if we have enough data (at least 50 days)
                if len(df) < 50:
                    rejected_tickers.append({'ticker': ticker, 'reason': 'Not enough data (<50 days)'})
                    continue

                curr_price = df['Close'].iloc[-1]
                
                # Calculate indicators
                sma_50 = df['Close'].rolling(window=50).mean()
                vol_avg_50 = df['Volume'].rolling(window=50).mean()
                
                curr_sma_50 = sma_50.iloc[-1]
                curr_vol_avg = vol_avg_50.iloc[-1]
                
                # Filter 1: Price >= 3.00
                if curr_price < 3.00:
                    rejected_tickers.append({'ticker': ticker, 'reason': f'Price ${curr_price:.2f} < $3.00'})
                    continue
                
                # Filter 2: 50-day Avg Vol >= 300k
                if curr_vol_avg < 300_000:
                    rejected_tickers.append({'ticker': ticker, 'reason': f'Volume {int(curr_vol_avg)} < 300k'})
                    continue
                
                # Filter 3: Price > 50-day SMA
                if curr_price <= curr_sma_50:
                    rejected_tickers.append({'ticker': ticker, 'reason': f'Downtrend (Price ${curr_price:.2f} <= SMA50)'})
                    continue
                
                # If pass, add to list with the dataframe (to reuse in Signaller)
                valid_tickers.append({
                    'ticker': ticker,
                    'price': curr_price,
                    'sma_50': curr_sma_50,
                    'vol_avg': curr_vol_avg,
                    'df': df  # Pass the dataframe to avoid re-fetching
                })
                
            except Exception as e:
                print(f"Error processing {ticker}: {e}")
                rejected_tickers.append({'ticker': ticker, 'reason': f'Error: {str(e)}'})
                continue
                
        return valid_tickers, rejected_tickers
