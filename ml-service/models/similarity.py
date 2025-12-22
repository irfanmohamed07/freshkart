import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.database import fetch_data

class ProductSimilarity:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.product_vectors = None
        self.products_df = None
        
    def load_products(self):
        """Load all products"""
        query = """
            SELECT p.id, p.name, p.description, p.price, p.shop_id, 
                   s.name as shop_name, p.image_url
            FROM products p
            JOIN shops s ON p.shop_id = s.id
        """
        self.products_df = fetch_data(query)
        self.products_df['content'] = (
            self.products_df['name'].fillna('') + ' ' + 
            self.products_df['description'].fillna('')
        )
        self.product_vectors = self.vectorizer.fit_transform(
            self.products_df['content']
        )
    
    def get_customers_also_bought(self, product_id, limit=5):
        """Get products frequently bought together"""
        query = """
            SELECT oi2.product_id, COUNT(*) as co_purchase_count,
                   p.name, p.price, p.shop_id, s.name as shop_name, p.image_url
            FROM order_items oi1
            JOIN orders o1 ON oi1.order_id = o1.id
            JOIN order_items oi2 ON o1.id = oi2.order_id
            JOIN products p ON oi2.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            WHERE oi1.product_id = %s 
              AND oi2.product_id != %s
              AND o1.payment_status = 'paid'
            GROUP BY oi2.product_id, p.name, p.price, p.shop_id, s.name, p.image_url
            ORDER BY co_purchase_count DESC
            LIMIT %s
        """
        result = fetch_data(query, params=[product_id, product_id, limit])
        return result.to_dict('records')
    
    def get_similar_products(self, product_id, limit=5):
        """Get similar products based on content similarity"""
        if self.products_df is None:
            self.load_products()
        
        # Find product index
        product_idx = self.products_df[self.products_df['id'] == product_id].index
        
        if len(product_idx) == 0:
            return []
        
        product_idx = product_idx[0]
        
        # Get similarity scores
        similarities = cosine_similarity(
            self.product_vectors[product_idx:product_idx+1],
            self.product_vectors
        ).flatten()
        
        # Create results
        similar = self.products_df.copy()
        similar['similarity_score'] = similarities
        
        # Filter out the current product and get top N
        similar = similar[similar['id'] != product_id]
        similar = similar.nlargest(limit, 'similarity_score')
        
        return similar[['id', 'name', 'price', 'shop_name', 'image_url', 'similarity_score']].to_dict('records')

