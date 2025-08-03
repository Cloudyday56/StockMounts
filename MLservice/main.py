from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from model.predictor import StockPredictor
from utils.fetch_data import fetch_stock_data
from utils.feature_engineering import add_technical_indicators
import numpy as np

# FastAPI app instance
app = FastAPI(
    title="Stock Prediction API",
    description="API to predict stock prices using a trained ML model.",
    version="1.0.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5001",
    "http://localhost:5000",
    "https://stockmounts.onrender.com",
    "https://backend-6z9h.onrender.com",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXPERT_STOCKS = ["AAPL", "GOOG", "MSFT", "TSLA", "AMZN", "NFLX", "META", "NVDA", "AMD", "INTC", "BABA", "SPY"]
models = {}

@app.on_event("startup") #run only once to load all models
def load_all_models():
    """Load all expert models into a dictionary."""
    global models #accessible anywhere
    for stock in EXPERT_STOCKS:
        model_path = Path(f"trained_models/model_{stock}.joblib")
        if model_path.exists():
            predictor = StockPredictor()
            predictor.load_model(model_path)
            models[stock] = predictor
        else:
            print(f"Warning: Model file not found for {stock} at {model_path}.")

# Helper function to convert numpy types to native Python types
def convert_numpy_types(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(i) for i in obj]
    elif isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj


# Health check/ping endpoint for Render wake-up
@app.get("/ping")
def ping():
    return {"ok": True}

@app.get("/")
def read_root():
    return {"message": "ML Service is running"}

# Get stock prediction
@app.get("/predict/{ticker}")
def get_prediction(ticker: str, period: str = "1y"):
    
    
    predictor = models.get(ticker.upper(), models.get("SPY")) # Default to SPY if ticker not found

    try:
        # Get the prediction
        prediction_data = predictor.predict_tomorrow(ticker, period)
        
        # Fetch historical data for the chart
        hist_data = fetch_stock_data(ticker, period='1y')
        hist_data = add_technical_indicators(hist_data) # Calculate SMA
        
        hist_data = hist_data.fillna(value=np.nan).replace([np.nan], [None])

        # Format data for Chart.js
        chart_data = {
            "labels": hist_data.index.strftime('%Y-%m-%d').tolist(),
            "prices": hist_data['Close'].tolist(),
            "sma": hist_data['SMA_50'].tolist()
        }

        # Combine all data into one response
        response_data = {
            **prediction_data,
            "chartData": chart_data
        }
        
        sanitized_data = convert_numpy_types(response_data)

        if 'ticker' not in sanitized_data:
            sanitized_data['ticker'] = ticker
            
        return sanitized_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")
    




