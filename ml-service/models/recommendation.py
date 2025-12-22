import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.database import fetch_data

class HomePageRecommendations:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.product_vectors = None
        self.products_df = None
        
    def load_products(self):
        """Load all products from database"""
        query = """
            SELECT p.id, p.name, p.description, p.price, p.shop_id, 
                   s.name as shop_name, p.image_url
            FROM products p
            JOIN shops s ON p.shop_id = s.id
        """
        self.products_df = fetch_data(query)
        
        # Create content for vectorization
        self.products_df['content'] = (
            self.products_df['name'].fillna('') + ' ' + 
            self.products_df['description'].fillna('')
        )
        
        # Vectorize products
        self.product_vectors = self.vectorizer.fit_transform(
            self.products_df['content']
        )
    
    def get_user_purchase_history(self, user_id):
        """Get user's purchase history"""
        query = """
            SELECT DISTINCT oi.product_id, COUNT(*) as purchase_count
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.user_id = %s AND o.payment_status = 'paid'
            GROUP BY oi.product_id
        """
        return fetch_data(query, params=[user_id])
    
    def get_user_cart_items(self, user_id):
        """Get user's current cart items"""
        query = """
            SELECT product_id
            FROM cart_items
            WHERE user_id = %s
        """
        return fetch_data(query, params=[user_id])
    
    def recommend_for_user(self, user_id, limit=8):
        """Get personalized recommendations for home page"""
        if self.products_df is None:
            self.load_products()
        
        # Get user purchase history
        purchase_history = self.get_user_purchase_history(user_id)
        
        if len(purchase_history) == 0:
            # No purchase history - return popular products
            return self.get_popular_products(limit)
        
        # Get user's purchased product IDs
        purchased_product_ids = set(purchase_history['product_id'].tolist())
        
        # Get user's cart items to exclude
        cart_items = self.get_user_cart_items(user_id)
        cart_product_ids = set(cart_items['product_id'].tolist()) if len(cart_items) > 0 else set()
        
        # Get vectors for purchased products
        purchased_indices = self.products_df[
            self.products_df['id'].isin(purchased_product_ids)
        ].index.tolist()
        
        if len(purchased_indices) == 0:
            return self.get_popular_products(limit)
        
        # Average vector of purchased products
        user_vector = self.product_vectors[purchased_indices].mean(axis=0)
        
        # Calculate similarity with all products
        similarities = cosine_similarity(user_vector, self.product_vectors).flatten()
        
        # Create recommendations dataframe
        recommendations = self.products_df.copy()
        recommendations['similarity_score'] = similarities
        
        # Filter out already purchased and cart items
        recommendations = recommendations[
            ~recommendations['id'].isin(purchased_product_ids | cart_product_ids)
        ]
        
        # Sort by similarity and get top N
        recommendations = recommendations.nlargest(limit, 'similarity_score')
        
        # Convert to list of dicts
        return recommendations[['id', 'name', 'price', 'shop_name', 'image_url', 'similarity_score']].to_dict('records')
    
    def get_popular_products(self, limit=8):
        """Get popular products based on purchase frequency"""
        query = """
            SELECT p.id, p.name, p.price, p.shop_id, 
                   s.name as shop_name, p.image_url,
                   COUNT(oi.id) as purchase_count
            FROM products p
            JOIN shops s ON p.shop_id = s.id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id, p.name, p.price, p.shop_id, s.name, p.image_url
            ORDER BY purchase_count DESC, p.created_at DESC
            LIMIT %s
        """
        popular = fetch_data(query, params=[limit])
        return popular.to_dict('records')

