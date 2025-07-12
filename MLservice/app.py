# Streamlit app, doesnt do anything currently


import streamlit as st
import os
import pandas as pd
import plotly.graph_objects as go
from model.predictor import StockPredictor

# --- Page Configuration ---
st.set_page_config(page_title="ML Stock Predictor", page_icon="📈", layout="wide")
st.title("📈 Machine Learning Stock Predictor")
st.write("Select a pre-trained stock or enter any other ticker symbol.")
st.write("---")

# Define our expert stocks - updated to match train_models.py
EXPERT_STOCKS = ["AAPL", "GOOG", "MSFT", "TSLA", "AMZN", "NFLX", "META", "NVDA", "AMD", "INTC", "BABA", "SPY"]

# --- Model Loading Function ---
@st.cache_resource
def load_predictor(model_path):
    """Loads the trained model from the specified path."""
    if not os.path.exists(model_path):
        st.error(f"Model file not found at {model_path}. Please run `python train_models.py` first.")
        return None
    predictor = StockPredictor()
    predictor.load_model(model_path)
    return predictor

# Function to make prediction
def predict_stock(symbol, period):
    with st.spinner(f"Making prediction for {symbol}..."):
        # --- Smart Model Selection Logic ---
        specific_model_path = f"trained_models/model_{symbol}.joblib"
        default_model_path = "trained_models/model_SPY.joblib"  # Our fallback

        if os.path.exists(specific_model_path):
            st.info(f"✅ Using specialized model trained on {symbol}.")
            model_to_load = specific_model_path
        else:
            st.warning(f"⚠️ No specialized model for {symbol}. Using general model trained on SPY.")
            model_to_load = default_model_path

        # --- Load the chosen model and make prediction ---
        predictor = load_predictor(model_to_load)
        if predictor:
            try:
                # The prediction logic
                X, _, full_data = predictor.prepare_data(symbol, period)
                
                # Ensure feature alignment
                if predictor.feature_columns is not None:
                    # Check for missing features
                    for col in predictor.feature_columns:
                        if col not in X.columns:
                            # Add missing column with zeros
                            X[col] = 0
                    
                    # Keep only the features the model was trained on
                    X = X[predictor.feature_columns]
                
                latest_features = X.iloc[-1:]
                
                prediction_val = predictor.model.predict(latest_features)[0]
                probability = predictor.model.predict_proba(latest_features)[0]
                
                direction = "📈 UP" if prediction_val == 1 else "📉 DOWN"
                confidence = max(probability) * 100
                current_price = full_data['Close'].iloc[-1]

                # Display results
                st.header(f"Prediction for {symbol}")
                if "UP" in direction:
                    st.success(f"**Prediction: {direction}**")
                else:
                    st.error(f"**Prediction: {direction}**")
                
                col1, col2 = st.columns(2)
                col1.metric("Confidence", f"{confidence:.1f}%")
                col2.metric("Current Price", f"${current_price:.2f}")
                st.write("---")

                # Display chart
                st.header("Price History")
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=full_data.index, y=full_data['Close'], name='Close Price'))
                fig.add_trace(go.Scatter(x=full_data.index, y=full_data['MA_50'], name='50-Day MA', 
                                        line=dict(color='orange', dash='dash')))
                
                fig.update_layout(
                    height=500,
                    xaxis_title='Date',
                    yaxis_title='Price ($)',
                    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
                )
                st.plotly_chart(fig, use_container_width=True)

            except Exception as e:
                st.error(f"An error occurred during prediction: {e}")
                st.error("This might happen if the stock ticker is invalid or if there's an issue with the data.")

# --- Main Interface ---
# Create two columns for the layout
col1, col2 = st.columns([2, 1])

with col1:
    # Chart period selection
    period = st.radio("Select Historical Period for Chart", ["1y", "2y", "5y"], horizontal=True)

    # Expert Stocks Section
    st.subheader("💼 Pre-trained Expert Stocks")
    
    # Create a 4-column layout for buttons (since we have more stocks now)
    button_cols = st.columns(4)
    
    # Create a button for each expert stock
    for i, stock in enumerate(EXPERT_STOCKS):
        col_idx = i % 4  # This cycles through 0, 1, 2, 3, 0, 1, 2, 3, etc.
        if button_cols[col_idx].button(stock, key=f"expert_{stock}", use_container_width=True):
            predict_stock(stock, period)

with col2:
    # Custom Stock Section
    st.subheader("🔍 Search Any Stock")
    custom_symbol = st.text_input("Enter Stock Ticker:", "").upper()
    
    if st.button("🔮 Predict", use_container_width=True):
        if not custom_symbol:
            st.warning("Please enter a stock ticker.")
        else:
            predict_stock(custom_symbol, period)