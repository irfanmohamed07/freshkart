import pandas as pd
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.database import fetch_data

class ShopRanking:
    def get_personalized_shop_ranking(self, user_id):
        """Rank shops based on user preferences"""
        # Get user's purchase history by shop
        query = """
            SELECT s.id, s.name, s.address, s.contact, s.logo,
                   COUNT(DISTINCT o.id) as order_count,
                   SUM(o.total_amount) as total_spent,
                   AVG(o.total_amount) as avg_order_value
            FROM shops s
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id AND o.user_id = %s
            GROUP BY s.id, s.name, s.address, s.contact, s.logo
            ORDER BY order_count DESC, total_spent DESC, s.name
        """
        
        shops = fetch_data(query, params=[user_id])
        
        # Calculate preference score
        if len(shops) > 0:
            max_orders = shops['order_count'].max() if shops['order_count'].max() > 0 else 1
            max_spent = shops['total_spent'].max() if shops['total_spent'].max() > 0 else 1
            
            shops['preference_score'] = (
                (shops['order_count'] / max_orders) * 0.5 +
                (shops['total_spent'] / max_spent) * 0.5
            )
            shops = shops.sort_values('preference_score', ascending=False)
        
        return shops.to_dict('records')
    
    def get_all_shops_ranked(self, user_id=None):
        """Get all shops with ranking"""
        if user_id:
            return self.get_personalized_shop_ranking(user_id)
        
        # Default ranking by popularity
        query = """
            SELECT s.id, s.name, s.address, s.contact, s.logo,
                   COUNT(DISTINCT o.id) as order_count,
                   COUNT(DISTINCT p.id) as product_count
            FROM shops s
            LEFT JOIN products p ON s.id = p.shop_id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
            GROUP BY s.id, s.name, s.address, s.contact, s.logo
            ORDER BY order_count DESC, product_count DESC, s.name
        """
        
        shops = fetch_data(query)
        return shops.to_dict('records')



