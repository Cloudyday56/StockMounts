import { useState, useEffect } from "react";
import api from "../lib/axios";
import StockChart from "./StockChart";
import { toast } from "react-hot-toast";

const StockPredictor = () => {
  const [ticker, setTicker] = useState("SPY");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(false); // State for grid visibility

  const fetchPrediction = async (tickerSymbol) => {
    if (!tickerSymbol) {
      toast.error("Please enter a stock ticker.");
      return;
    }
    setLoading(true);
    // setPrediction(null);

    try {
      const response = await api.get(`/predict/${tickerSymbol.toUpperCase()}`);
      setPrediction(response.data);
    } catch (err) {
      console.error("Error fetching prediction:", err);
      toast.error("Please enter a valid stock ticker.");
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
    fetchPrediction("SPY");
  }, []);

  return (
    <div>
      <form
        onSubmit={handlePredict}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Ticker (e.g., AAPL)"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && !prediction ? "Predicting..." : "Predict"}
        </button>
      </form>

      {/* Show a loading skeleton or the prediction */}
      {loading && !prediction && (
        <div className="mt-6 text-center">Loading initial data... (may take a few minutes to load models) </div>
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
              <div className="stat-value text-primary text-2xl md:text-3xl">
                ${prediction.current_price.toFixed(2)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title text-info">Next Trading Day</div>
              <div className="stat-value text-primary text-2xl md:text-3xl">
                {prediction.direction}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title text-info">Confidence</div>
              <div className="stat-value text-primary text-2xl md:text-3xl">
                {prediction.confidence.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="relative mt-8 h-[500px]">
            <button
              onClick={() => setIsGridVisible(!isGridVisible)} //toggle grid visibility
              className="btn btn-secondary btn-sm absolute top-0 right-2 z-10"
              title="Toggle Grid Lines"
            >
              {isGridVisible ? "Hide Grid" : "Show Grid"}
            </button>

            <StockChart
              chartData={prediction.chartData}
              ticker={prediction.ticker}
              isGridVisible={isGridVisible}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPredictor;
