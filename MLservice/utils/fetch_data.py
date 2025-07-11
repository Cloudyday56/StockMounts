import yfinance as yf
# import pandas as pd
# from datetime import datetime, timedelta

def fetch_stock_data(symbol, period="1y"):
    """
    Fetch stock data from Yahoo Finance
    
    Args:
        symbol (str): Stock ticker (e.g., 'AAPL', 'MSFT')
        period (str): Time period ('1y', '2y', '5y', 'max')
    
    Returns:
        pandas.DataFrame: Stock data with OHLCV columns
    """
    
    # Download data using yfinance (data already includes OHLCV)
    stock = yf.Ticker(symbol)
    data = stock.history(period=period) #this is a Panda
    
    return data

# Testing
if __name__ == "__main__":
    # Let's start with Apple stock
    aapl_data = fetch_stock_data("AAPL", "1y")
    print("Apple Stock Data (last 5 rows):")
    print(aapl_data.tail())
    print(f"\nData shape: {aapl_data.shape}")
    print(f"Columns: {list(aapl_data.columns)}")