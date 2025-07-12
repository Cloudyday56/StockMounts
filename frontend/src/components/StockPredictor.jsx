import { useState, useEffect } from 'react';
import api from '../lib/axios';
import StockChart from './StockChart';

const StockPredictor = () => {
  const [ticker, setTicker] = useState('SPY');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrediction = async (tickerSymbol) => {
    if (!tickerSymbol) {
      setError('Please enter a stock ticker.');
      return;
    }
    setLoading(true);
    setError('');
    // setPrediction(null); 

    try {
      const response = await api.get(`/predict/${tickerSymbol.toUpperCase()}`);
      setPrediction(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault(); // Prevent form submission
    fetchPrediction(ticker);
  };

  // Fetch SPY data when the component first loads
  useEffect(() => {
    fetchPrediction('SPY');
  }, []);


  return (
    <div>
      <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Ticker (e.g., AAPL)"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && !prediction ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-error">{error}</p>}

      {/* Show a loading skeleton or the prediction */}
      {loading && !prediction && (
        <div className="mt-6 text-center">Loading initial data...</div>
      )}

      {prediction && (
        <div className="mt-8">
          {/* Use a simple, centered heading for the prediction */}
          <h3 className="text-2xl font-bold text-primary text-center mb-4">
            Prediction for {prediction.ticker}
          </h3>

          {/* Stats container, no more complex positioning */}
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-300 w-full text-center">
            <div className="stat">
              <div className="stat-title text-info">Current Price</div>
              <div className="stat-value text-primary text-2xl md:text-3xl">${prediction.current_price.toFixed(2)}</div>
            </div>
            <div className="stat">
              <div className="stat-title text-info">Tomorrow</div>
              <div className="stat-value text-primary text-2xl md:text-3xl">{prediction.direction}</div>
            </div>
            <div className="stat">
              <div className="stat-title text-info">Confidence</div>
              <div className="stat-value text-primary text-2xl md:text-3xl">{prediction.confidence.toFixed(2)}%</div>
            </div>
          </div>
          
          <div className="mt-8 h-[500px]">
            <StockChart chartData={prediction.chartData} ticker={prediction.ticker} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPredictor;