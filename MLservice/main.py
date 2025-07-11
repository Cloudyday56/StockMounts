from fastapi import FastAPI, HTTPException
from pathlib import Path
from model.predictor import StockPredictor
import numpy as np

#* Create an instance of the FastAPI class
app = FastAPI(
    title="Stock Prediction API",
    description="API to predict stock prices using a trained ML model.",
    version="1.0.0"
)

# This will hold our loaded model instance
predictor = None

def convert_numpy_types(obj): #* important: This helper function is used to convert numpy types to native Python types
    """
    Recursively converts numpy number types in an object to native Python types.
    """
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
    """
    This function runs once when the API server starts.
    It loads the ML model into memory.
    """
    global predictor
    model_path = Path(__file__).parent / "trained_models" / "model_AAPL.joblib" # Adjust the path as needed
    
    if not model_path.exists():
        print(f"Warning: Model file not found at {model_path}. The /predict endpoint will not work.")
        return

    print(f"Loading model from {model_path}...")
    predictor = StockPredictor()
    predictor.load_model(model_path)
    print("Model loaded successfully.")


@app.get("/") #* This is the root endpoint (FastAPI tool)
def read_root():
    return {"message": "ML Service is running. Go to /docs for API documentation."}

@app.get("/predict/{ticker}") #* This is the prediction endpoint
def get_prediction(ticker: str, period: str = "1y"):
    """
    Predicts the next day's stock price for a given ticker.
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model is not available. Check server logs for errors.")
    
    try:
        
        # 1. The model's predictor returns a Python dictionary
        prediction_data = predictor.predict_tomorrow(ticker, period)

        # 2. This function cleans it up, but it's still a Python dictionary
        # Sanitize the dictionary to convert any numpy types to native Python types
        sanitized_data = convert_numpy_types(prediction_data)

        if 'ticker' not in sanitized_data:
            sanitized_data['ticker'] = ticker

        # 3. FastAPI automatically converts this Python dictionary into a JSON response. (actually its just a python dictionary)
        return sanitized_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")
