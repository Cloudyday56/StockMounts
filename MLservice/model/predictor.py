import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pandas as pd
import numpy as np
from utils.feature_engineering import prepare_ml_data

class StockPredictor:
    """
    Machine Learning Stock Predictor
    Predicts if stock price will go UP (1) or DOWN (0) tomorrow
    """
    
    def __init__(self, model_type='random_forest'):
        """
        Initialize the predictor
        
        Args:
            model_type (str): 'random_forest' or 'logistic_regression'
        """
        self.model_type = model_type
        self.model = None
        self.feature_columns = None
        
        # Choose the algorithm
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=100,  # 100 decision trees
                random_state=42,   # For reproducible results
                max_depth=5,       # Prevent overfitting
                min_samples_leaf=5,   # Require at least 5 samples to create a leaf
                class_weight='balanced',
            )
        elif model_type == 'logistic_regression':
            self.model = LogisticRegression(
                random_state=42,
                max_iter=1000
            )
    
    def prepare_data(self, symbol, period="1y"):
        """
        Get data and split into features (X) and target (y)
        """
        # Get the featured data
        data = prepare_ml_data(symbol, period)
        
        # Define feature columns (everything except Target)
        feature_columns = [col for col in data.columns if col != 'Target']
        self.feature_columns = feature_columns
        
        # Separate features (X) and target (y)
        X = data[feature_columns]
        y = data['Target']
        
        return X, y, data

    #! TRAIN
    def train(self, symbol, period="1y", test_size=0.2): 
        """
        Train the model on historical data
        
        Args:
            symbol (str): Stock ticker
            period (str): Time period for data
            test_size (float): Fraction of data for testing (0.2 = 20%)
        """
        print(f"Training model on {symbol} data...")
        
        # Get and prepare data
        X, y, full_data = self.prepare_data(symbol, period)
        
        # Split data: 80% for training, 20% for testing
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, shuffle=False
        )
        
        print(f"Training data shape: {X_train.shape}")
        print(f"Testing data shape: {X_test.shape}")
        
        # Train the model
        self.model.fit(X_train, y_train)
        
        # Test the model
        train_predictions = self.model.predict(X_train)
        test_predictions = self.model.predict(X_test)
        
        # Calculate accuracy
        train_accuracy = accuracy_score(y_train, train_predictions)
        test_accuracy = accuracy_score(y_test, test_predictions)
        
        print(f"\n📊 MODEL PERFORMANCE:")
        print(f"Training Accuracy: {train_accuracy:.3f} ({train_accuracy*100:.1f}%)")
        print(f"Testing Accuracy: {test_accuracy:.3f} ({test_accuracy*100:.1f}%)")
        
        # Detailed performance report
        print(f"\n📋 DETAILED RESULTS:")
        print(classification_report(y_test, test_predictions, 
                                  target_names=['Down (0)', 'Up (1)']))
        
        # Show feature importance (for Random Forest)
        if self.model_type == 'random_forest':
            self.show_feature_importance()
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'X_test': X_test,
            'y_test': y_test,
            'predictions': test_predictions
        }
    
    def show_feature_importance(self):
        """
        Show which features are most important for predictions
        """
        if self.model_type == 'random_forest':
            importance = self.model.feature_importances_
            feature_imp = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': importance
            }).sort_values('importance', ascending=False)
            
            print(f"\n🎯 MOST IMPORTANT FEATURES:")
            print(feature_imp.head(10))
    
    def predict_tomorrow(self, symbol, period="1y"):
        """
        Predict if stock will go up or down tomorrow
        """
        if self.model is None:
            raise ValueError("Model not trained yet! Call train() first.")
        
        # Get latest data
        X, y, full_data = self.prepare_data(symbol, period)

        # Align features with what the model expects
        if self.feature_columns is not None:
          # Check for missing features
          for col in self.feature_columns:
            if col not in X.columns:
                # Add missing column with zeros
                X[col] = 0
        
          # Keep only the features the model was trained on
          X = X[self.feature_columns]

        # Debug information
        # print("\n--- DEBUG: Feature Columns ---")
        # print(f"Model was trained on these features: {self.feature_columns}")
        # print(f"Current data has these features: {X.columns.tolist()}")
        missing_features = set(self.feature_columns) - set(X.columns.tolist())
        if missing_features:
            print(f"MISSING FEATURES: {missing_features}")
        
        # Use the most recent day for prediction
        latest_features = X.iloc[-1:]
        
        # Make prediction
        prediction = self.model.predict(latest_features)[0]
        probability = self.model.predict_proba(latest_features)[0]
        
        current_price = full_data['Close'].iloc[-1]
        
        direction = "📈 UP" if prediction == 1 else "📉 DOWN"
        confidence = max(probability) * 100
        
        print(f"\n🔮 PREDICTION FOR TOMORROW:")
        print(f"Stock: {symbol}")
        print(f"Current Price: ${current_price:.2f}")
        print(f"Prediction: {direction}")
        print(f"Confidence: {confidence:.1f}%")
        
        return {
            'prediction': prediction,
            'direction': direction,
            'confidence': confidence,
            'current_price': current_price
        }

    def save_model(self, filepath):
      """Saves the trained model to a file."""
      if self.model is None:
          raise ValueError("No model to save. Train the model first.")
      print(f"\n💾 Saving model to {filepath}...")
      os.makedirs(os.path.dirname(filepath), exist_ok=True)

      # Save both the model and feature columns
      model_data = {
          'model': self.model,
          'feature_columns': self.feature_columns
      }
      joblib.dump(model_data, filepath)
      print("Model saved successfully.")

    def load_model(self, filepath):
        """Loads a trained model from a file."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"No model file found at {filepath}")
        print(f"\n📂 Loading model from {filepath}...")
        
        # Load both model and feature columns
        model_data = joblib.load(filepath)
        
        # Check if it's the old format (just the model) or new format (dictionary)
        if isinstance(model_data, dict):
            self.model = model_data['model']
            self.feature_columns = model_data['feature_columns']
        else:
            # For backward compatibility with old saved models
            self.model = model_data
        
        print("Model loaded successfully.")

# Test the predictor
if __name__ == "__main__":
    # --- 1. Train and Save the Model ---
    predictor = StockPredictor(model_type='random_forest')
    
    print("--- Starting Model Training ---")
    results = predictor.train("AAPL", "5y")
    
    model_path = "trained_models/random_forest_AAPL.joblib"
    predictor.save_model(model_path) #put in trained_models
    
    # --- 2. Test Loading and Predicting ---
    print("\n--- Simulating a New App Session ---")
    # Create a new, blank predictor instance
    loaded_predictor = StockPredictor()
    
    # Load the model in trained_models
    loaded_predictor.load_model(model_path)
    
    # Use the LOADED model to make a prediction
    # This proves our save/load cycle works correctly
    print("\n--- Making Prediction with the Loaded Model ---")
    prediction = loaded_predictor.predict_tomorrow("AAPL", "1y")