import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import os

def train_models():
    """Reads CSV data and trains/saves ML models."""
    print("Starting training process...")
    
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'models')
    
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        
    # Check if CSV exists
    products_csv = os.path.join(data_dir, 'products.csv')
    if not os.path.exists(products_csv):
        print(f"Error: {products_csv} not found. Please run export_data.py first.")
        return

    # Load data
    print("Loading products data...")
    df = pd.read_csv(products_csv)
    
    # Prepare content for vectorization
    df['content'] = df['name'].fillna('') + ' ' + df['description'].fillna('')
    
    # --- 1. Train Vectorizer ---
    print("Training TfidfVectorizer...")
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    product_vectors = vectorizer.fit_transform(df['content'])
    
    # --- 2. Save Models ---
    print("Saving models...")
    # Save the vectorizer
    joblib.dump(vectorizer, os.path.join(models_dir, 'tfidf_vectorizer.pkl'))
    # Save the vectors
    joblib.dump(product_vectors, os.path.join(models_dir, 'product_vectors.pkl'))
    # Save the dataframe (useful for index mapping)
    df.to_pickle(os.path.join(models_dir, 'products_processed.pkl'))
    
    print("\nTraining completed! Models saved in 'data/models/' directory.")
    print("- tfidf_vectorizer.pkl")
    print("- product_vectors.pkl")
    print("- products_processed.pkl")

if __name__ == "__main__":
    train_models()
