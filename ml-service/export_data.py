import pandas as pd
import os
import sys
from dotenv import load_dotenv

# Add the current directory to the search path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.database import get_db_connection

def export_to_csv():
    """Fetches data from the database and saves it to CSV files for training."""
    print("Starting data export...")
    
    # Ensure data directory exists
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    conn = get_db_connection()
    
    try:
        # 1. Export Products
        print("Exporting products...")
        products_query = """
            SELECT p.id, p.name, p.description, p.price, p.shop_id, 
                   s.name as shop_name, p.image_url
            FROM products p
            JOIN shops s ON p.shop_id = s.id
        """
        products_df = pd.read_sql(products_query, conn)
        products_df.to_csv(os.path.join(data_dir, 'products.csv'), index=False)
        print(f"Saved {len(products_df)} products to products.csv")

        # 2. Export Order Items (for recommendation history and co-purchase)
        print("Exporting order history...")
        orders_query = """
            SELECT o.user_id, oi.product_id, o.payment_status, o.id as order_id
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.payment_status = 'paid'
        """
        orders_df = pd.read_sql(orders_query, conn)
        orders_df.to_csv(os.path.join(data_dir, 'order_history.csv'), index=False)
        print(f"Saved {len(orders_df)} order records to order_history.csv")

        # 3. Export Shops
        print("Exporting shops...")
        shops_query = "SELECT id, name, category, rating FROM shops"
        shops_df = pd.read_sql(shops_query, conn)
        shops_df.to_csv(os.path.join(data_dir, 'shops.csv'), index=False)
        print(f"Saved {len(shops_df)} shops to shops.csv")

        print("\nExport completed successfully!")
        
    except Exception as e:
        print(f"Error during export: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    export_to_csv()
