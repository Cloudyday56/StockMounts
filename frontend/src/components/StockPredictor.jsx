import { useState } from 'react';
import api from '../lib/axios';
import StockChart from './StockChart';

const StockPredictor = () => {
  const [ticker, setTicker] = useState('SPY');
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
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-base-content">
        Stock Trend Predictor
      </h2>
      <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Ticker (e.g., AAPL)"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-error">{error}</p>}

      {prediction && (
        <>
          <div className="mt-6 p-4 bg-base-300 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-primary">
              Prediction for {prediction.ticker}
            </h3>
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-transparent">
              <div className="stat">
                <div className="stat-title">Current Price</div>
                <div className="stat-value text-secondary">${prediction.current_price.toFixed(2)}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Direction</div>
                <div className="stat-value text-secondary">{prediction.direction}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Confidence</div>
                <div className="stat-value text-secondary">{prediction.confidence.toFixed(2)}%</div>
              </div>
            </div>
          </div>
          
          {/* Add the chart component here */}
          <div className="mt-6">
            <StockChart chartData={prediction.chartData} ticker={prediction.ticker} />
          </div>
        </>
      )}
    </div>
  );
};

export default StockPredictor;

