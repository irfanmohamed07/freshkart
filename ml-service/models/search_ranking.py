import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.database import fetch_data

class SearchRanking:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.product_vectors = None
        self.products_df = None
        
    def load_products(self):
        """Load all products for search"""
        query = """
            SELECT p.id, p.name, p.description, p.price, p.shop_id, 
                   s.name as shop_name, p.image_url
            FROM products p
            JOIN shops s ON p.shop_id = s.id
        """
        self.products_df = fetch_data(query)
        self.products_df['search_content'] = (
            self.products_df['name'].fillna('') + ' ' + 
            self.products_df['description'].fillna('')
        )
        self.product_vectors = self.vectorizer.fit_transform(
            self.products_df['search_content']
        )
    
    def search_products(self, query_text, limit=20, user_id=None):
        """Search products with ML-based ranking"""
        if self.products_df is None:
            self.load_products()
        
        # Vectorize search query
        query_vector = self.vectorizer.transform([query_text])
        
        # Calculate similarity
        similarities = cosine_similarity(query_vector, self.product_vectors).flatten()
        
        # Create results
        results = self.products_df.copy()
        results['relevance_score'] = similarities
        
        # Boost score for exact name matches
        results['name_match'] = results['name'].str.contains(
            query_text, case=False, na=False
        )
        results['relevance_score'] = np.where(
            results['name_match'],
            results['relevance_score'] + 0.3,
            results['relevance_score']
        )
        
        # If user_id provided, boost products from shops user prefers
        if user_id:
            user_shops_query = """
                SELECT DISTINCT p.shop_id
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                JOIN products p ON oi.product_id = p.id
                WHERE o.user_id = %s AND o.payment_status = 'paid'
            """
            user_shops = fetch_data(user_shops_query, params=[user_id])
            if len(user_shops) > 0:
                preferred_shops = set(user_shops['shop_id'].tolist())
                results['preferred_shop'] = results['shop_id'].isin(preferred_shops)
                results['relevance_score'] = np.where(
                    results['preferred_shop'],
                    results['relevance_score'] + 0.1,
                    results['relevance_score']
                )
        
        # Sort by relevance
        results = results.nlargest(limit, 'relevance_score')
        
        # Filter out zero relevance
        results = results[results['relevance_score'] > 0]
        
        return results[['id', 'name', 'price', 'shop_name', 'image_url', 'relevance_score']].to_dict('records')

