import { useState } from 'react';
import api from '../lib/axios';

const StockPredictor = () => {
  const [ticker, setTicker] = useState('SPY'); // Default ticker
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!ticker) {
      setError('Please enter a stock ticker.');
      return;
    }
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Use your custom api instance to call the backend
      const response = await api.get(`/predict/${ticker.toUpperCase()}`);
      setPrediction(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-predictor">
      <h2>Stock Trend Predictor</h2>
      <form onSubmit={handlePredict}>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Ticker (e.g., AAPL)"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {prediction && (
        <div className="prediction-result">
          <h3>Prediction for {prediction.ticker}</h3>
          <p>Current Price: ${prediction.current_price.toFixed(2)}</p>
          <p>Predicted Direction: {prediction.direction}</p>
          <p>Confidence: {prediction.confidence.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default StockPredictor;