import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Get PostgreSQL database connection"""
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', 5432),
        database=os.getenv('DB_NAME', 'grocery_app'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )

def fetch_data(query, params=None):
    """Fetch data from database"""
    conn = get_db_connection()
    try:
        import pandas as pd
        if params:
            df = pd.read_sql(query, conn, params=params)
        else:
            df = pd.read_sql(query, conn)
        return df
    finally:
        conn.close()



