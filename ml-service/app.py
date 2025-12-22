from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import psycopg2
from psycopg2 import OperationalError
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.recommendation import HomePageRecommendations
from models.similarity import ProductSimilarity
from models.cart_suggestions import CartSuggestions
from models.shop_ranking import ShopRanking
from models.search_ranking import SearchRanking
from utils.database import get_db_connection

app = Flask(__name__)
CORS(app)

# Initialize ML models
home_recommender = HomePageRecommendations()
product_similarity = ProductSimilarity()
cart_suggestions = CartSuggestions()
shop_ranking = ShopRanking()
search_ranking = SearchRanking()

def wait_for_db(max_retries=30, delay=2):
    """Wait for database to be ready"""
    for i in range(max_retries):
        try:
            conn = get_db_connection()
            conn.close()
            print("Database connection successful!")
            return True
        except OperationalError as e:
            print(f"Waiting for database... ({i+1}/{max_retries}) - {e}")
            time.sleep(delay)
    return False

@app.route('/api/recommend/home', methods=['POST'])
def recommend_home():
    """1. Home page recommendations"""
    try:
        data = request.json or {}
        user_id = data.get('user_id')
        limit = data.get('limit', 8)
        
        if not user_id:
            # Return popular products for non-logged-in users
            recommendations = home_recommender.get_popular_products(limit)
        else:
            recommendations = home_recommender.recommend_for_user(user_id, limit)
        
        return jsonify(recommendations)
    except Exception as e:
        print(f"Error in recommend_home: {e}")
        return jsonify([]), 500

@app.route('/api/product/similar', methods=['POST'])
def get_similar_products():
    """2. Product detail page - Similar products"""
    try:
        data = request.json or {}
        product_id = data.get('product_id')
        limit = data.get('limit', 5)
        
        if not product_id:
            return jsonify([]), 400
        
        similar = product_similarity.get_similar_products(product_id, limit)
        return jsonify(similar)
    except Exception as e:
        print(f"Error in get_similar_products: {e}")
        return jsonify([]), 500

@app.route('/api/product/also-bought', methods=['POST'])
def get_also_bought():
    """2. Product detail page - Customers also bought"""
    try:
        data = request.json or {}
        product_id = data.get('product_id')
        limit = data.get('limit', 5)
        
        if not product_id:
            return jsonify([]), 400
        
        also_bought = product_similarity.get_customers_also_bought(product_id, limit)
        return jsonify(also_bought)
    except Exception as e:
        print(f"Error in get_also_bought: {e}")
        return jsonify([]), 500

@app.route('/api/cart/complementary', methods=['POST'])
def get_complementary_items():
    """3. Cart page - Complementary items"""
    try:
        data = request.json or {}
        cart_product_ids = data.get('product_ids', [])
        limit = data.get('limit', 5)
        
        if not cart_product_ids:
            return jsonify([])
        
        complementary = cart_suggestions.get_complementary_items(cart_product_ids, limit)
        return jsonify(complementary)
    except Exception as e:
        print(f"Error in get_complementary_items: {e}")
        return jsonify([]), 500

@app.route('/api/cart/best-deals', methods=['POST'])
def get_best_deals():
    """3. Cart page - Best deals"""
    try:
        data = request.json or {}
        cart_product_ids = data.get('product_ids', [])
        limit = data.get('limit', 3)
        
        if not cart_product_ids:
            return jsonify([])
        
        deals = cart_suggestions.get_best_deals(cart_product_ids, limit)
        return jsonify(deals)
    except Exception as e:
        print(f"Error in get_best_deals: {e}")
        return jsonify([]), 500

@app.route('/api/shops/ranked', methods=['POST'])
def get_ranked_shops():
    """4. Shop listing page - Personalized ranking"""
    try:
        data = request.json or {}
        user_id = data.get('user_id')
        
        shops = shop_ranking.get_all_shops_ranked(user_id)
        return jsonify(shops)
    except Exception as e:
        print(f"Error in get_ranked_shops: {e}")
        return jsonify([]), 500

@app.route('/api/search', methods=['POST'])
def search_products():
    """5. Search functionality - ML-ranked results"""
    try:
        data = request.json or {}
        query_text = data.get('query', '')
        limit = data.get('limit', 20)
        user_id = data.get('user_id')
        
        if not query_text:
            return jsonify([])
        
        results = search_ranking.search_products(query_text, limit, user_id)
        return jsonify(results)
    except Exception as e:
        print(f"Error in search_products: {e}")
        return jsonify([]), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'ml-service'})

if __name__ == '__main__':
    # Wait for database before starting
    wait_for_db()
    app.run(host='0.0.0.0', port=5000, debug=False)

