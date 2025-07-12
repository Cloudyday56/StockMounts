import pandas as pd
import numpy as np
from .fetch_data import fetch_stock_data

def create_features(data):
    """
    Create machine learning features from raw stock data
    
    Args:
        data (DataFrame): Raw stock data with OHLCV columns
    
    Returns:
        DataFrame: Data with additional feature columns
    """
    # Make a copy to avoid modifying original data
    df = data.copy()
    
    #* 1. MOVING AVERAGES - Show trend direction
    df['MA_10'] = df['Close'].rolling(window=10).mean()  # 10-day average
    df['MA_50'] = df['Close'].rolling(window=50).mean()  # 50-day average
    
    #* 2. PRICE CHANGES - Show momentum
    df['Price_Change'] = df['Close'].pct_change()  # Daily % change
    df['Price_Change_5d'] = df['Close'].pct_change(periods=5)  # 5-day % change

    #* 3. VOLATILITY - Show how much price jumps around
    df['Volatility'] = df['Close'].rolling(window=10).std()  # 10-day price volatility

    #* 4. VOLUME INDICATORS - Show trading activity
    df['Volume_MA'] = df['Volume'].rolling(window=10).mean()  # Average volume
    df['Volume_Ratio'] = df['Volume'] / df['Volume_MA']  # Current vs average volume

    #* 5. TECHNICAL INDICATORS - Classic trading signals
    # RSI (Relative Strength Index) - Shows if stock is overbought/oversold
    df['RSI'] = calculate_rsi(df['Close'], window=14)

    #* 6. TREND INDICATORS - Direction of price movement
    df['Trend_10d'] = np.where(df['Close'] > df['MA_10'], 1, 0)  # Above 10-day MA = 1
    df['Trend_50d'] = np.where(df['Close'] > df['MA_50'], 1, 0)  # Above 50-day MA = 1

    #* 7. ADVANCED TECHNICAL INDICATORS
    # MACD (Moving Average Convergence Divergence)
    exp12 = df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp12 - exp26
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

    #* 8. LAGGED FEATURES (what happened yesterday?)
    df['Lag_1d_Price_Change'] = df['Price_Change'].shift(1)
    df['Lag_1d_Volume_Ratio'] = df['Volume_Ratio'].shift(1)
    
    return df

def calculate_rsi(prices, window=14):
    """Calculate Relative Strength Index"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def prepare_ml_data(symbol, period="1y"):
    """
    Prepare data for machine learning with features and target
    """
    # Get raw data
    raw_data = fetch_stock_data(symbol, period)
    
    # Filter out non-standard columns (like 'Capital Gains')
    standard_columns = ['Open', 'High', 'Low', 'Close', 'Volume', 'Dividends', 'Stock Splits']
    columns_to_keep = [col for col in raw_data.columns if col in standard_columns]
    raw_data = raw_data[columns_to_keep]
    
    # Create features
    featured_data = create_features(raw_data)
    
    # Create target variable (what we want to predict)
    # We want to predict if price will go UP or DOWN tomorrow
    featured_data['Target'] = np.where( #add 1 more column
        featured_data['Close'].shift(-1) > featured_data['Close'], 1, 0
    )
    #* 1 = price goes up next day, 0 = price goes down next day
    
    # Remove rows with missing data (due to rolling calculations)
    featured_data = featured_data.dropna()
    
    return featured_data

def add_technical_indicators(df):
    """
    Adds technical indicators to the dataframe. (graphing)
    Currently adds a 50-day Simple Moving Average (SMA).
    """
    # Ensure the index is a DatetimeIndex for rolling calculations
    if not isinstance(df.index, pd.DatetimeIndex):
        df.index = pd.to_datetime(df.index)
        
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    
    # Can add other indicators here in the future
    # df['SMA_200'] = df['Close'].rolling(window=200).mean()
    # df['RSI'] = ...
    
    return df

# Testing
if __name__ == "__main__":
    # Create features for Apple
    apple_features = prepare_ml_data("AAPL", "1y")
    
    print("Apple Stock with Features:")
    print(f"Data shape: {apple_features.shape}")
    print(f"Columns: {list(apple_features.columns)}")
    
    # Show last few rows
    print("\nLast 5 rows of featured data:")
    print(apple_features.tail())
    
    # Show feature statistics
    print("\nFeature Statistics:")
    print(apple_features[['Close', 'MA_10', 'MA_50', 'Price_Change', 'RSI', 'Target']].describe())