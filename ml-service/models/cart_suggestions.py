import pandas as pd
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.database import fetch_data

class CartSuggestions:
    def get_complementary_items(self, cart_product_ids, limit=5):
        """Get items frequently bought together with cart items"""
        if not cart_product_ids:
            return []
        
        # Create placeholders for SQL IN clause
        placeholders = ','.join(['%s'] * len(cart_product_ids))
        
        query = f"""
            SELECT oi2.product_id, COUNT(*) as frequency,
                   p.name, p.price, p.shop_id, s.name as shop_name, p.image_url
            FROM order_items oi1
            JOIN orders o1 ON oi1.order_id = o1.id
            JOIN order_items oi2 ON o1.id = oi2.order_id
            JOIN products p ON oi2.product_id = p.id
            JOIN shops s ON p.shop_id = s.id
            WHERE oi1.product_id IN ({placeholders})
              AND oi2.product_id NOT IN ({placeholders})
              AND o1.payment_status = 'paid'
            GROUP BY oi2.product_id, p.name, p.price, p.shop_id, s.name, p.image_url
            ORDER BY frequency DESC
            LIMIT %s
        """
        
        params = list(cart_product_ids) + list(cart_product_ids) + [limit]
        result = fetch_data(query, params=params)
        return result.to_dict('records')
    
    def get_best_deals(self, cart_product_ids, limit=3):
        """Find better deals for products in cart"""
        if not cart_product_ids:
            return []
        
        placeholders = ','.join(['%s'] * len(cart_product_ids))
        
        query = f"""
            WITH cart_products AS (
                SELECT p.id, p.name, p.price as cart_price
                FROM products p
                WHERE p.id IN ({placeholders})
            ),
            alternatives AS (
                SELECT cp.id as cart_product_id, cp.name, cp.cart_price,
                       p.id as alt_product_id, p.price as alt_price,
                       p.shop_id, s.name as shop_name, p.image_url,
                       (cp.cart_price - p.price) as savings
                FROM cart_products cp
                JOIN products p ON LOWER(TRIM(p.name)) = LOWER(TRIM(cp.name))
                JOIN shops s ON p.shop_id = s.id
                WHERE p.id NOT IN ({placeholders})
                  AND p.price < cp.cart_price
            )
            SELECT * FROM alternatives
            ORDER BY savings DESC
            LIMIT %s
        """
        
        params = list(cart_product_ids) + list(cart_product_ids) + [limit]
        result = fetch_data(query, params=params)
        return result.to_dict('records')



