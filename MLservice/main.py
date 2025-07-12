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
    "http://localhost:5001", # Default Vite dev port for frontend
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = None

# ... (convert_numpy_types and load_model functions remain the same) ...
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

@app.on_event("startup")
def load_model():
    global predictor
    model_path = Path(__file__).parent / "trained_models" / "model_AAPL.joblib"
    if not model_path.exists():
        print(f"Warning: Model file not found at {model_path}. The /predict endpoint will not work.")
        return
    print(f"Loading model from {model_path}...")
    predictor = StockPredictor()
    predictor.load_model(model_path)
    print("Model loaded successfully.")

@app.get("/")
def read_root():
    return {"message": "ML Service is running. Go to /docs for API documentation."}


@app.get("/predict/{ticker}")
def get_prediction(ticker: str, period: str = "1y"):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model is not available. Check server logs for errors.")
    
    try:
        # 1. Get the prediction
        prediction_data = predictor.predict_tomorrow(ticker, period)
        
        # 2. Fetch historical data for the chart
        hist_data = fetch_stock_data(ticker, period='1y')
        hist_data = add_technical_indicators(hist_data) # Calculate SMA
        
        hist_data = hist_data.fillna(value=np.nan).replace([np.nan], [None])

        # 3. Format data for Chart.js
        chart_data = {
            "labels": hist_data.index.strftime('%Y-%m-%d').tolist(),
            "prices": hist_data['Close'].tolist(),
            "sma": hist_data['SMA_50'].tolist()
        }

        # 4. Combine all data into one response
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
    




