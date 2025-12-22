# ML Service for FreshKart

Python Flask service providing ML-powered recommendations for the FreshKart grocery e-commerce platform.

## Features

1. **Home Page Recommendations** - Personalized product recommendations based on user purchase history
2. **Product Similarity** - Find similar products and "customers also bought" suggestions
3. **Cart Suggestions** - Complementary items and best deals for cart items
4. **Shop Ranking** - Personalized shop rankings based on user preferences
5. **Search Ranking** - ML-powered search relevance ranking

## Setup

### Prerequisites
- Python 3.11+
- PostgreSQL database (shared with Node.js app)

### Installation

```bash
cd ml-service
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grocery_app
DB_USER=postgres
DB_PASSWORD=postgres
```

### Running the Service

```bash
python app.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### 1. Home Page Recommendations
```
POST /api/recommend/home
Body: { "user_id": 1, "limit": 8 }
```

### 2. Similar Products
```
POST /api/product/similar
Body: { "product_id": 1, "limit": 5 }
```

### 3. Customers Also Bought
```
POST /api/product/also-bought
Body: { "product_id": 1, "limit": 5 }
```

### 4. Complementary Items
```
POST /api/cart/complementary
Body: { "product_ids": [1, 2, 3], "limit": 5 }
```

### 5. Best Deals
```
POST /api/cart/best-deals
Body: { "product_ids": [1, 2, 3], "limit": 3 }
```

### 6. Ranked Shops
```
POST /api/shops/ranked
Body: { "user_id": 1 }
```

### 7. Search Products
```
POST /api/search
Body: { "query": "apples", "user_id": 1, "limit": 20 }
```

### Health Check
```
GET /health
```

## ML Models Used

- **TF-IDF Vectorization** - For content-based product similarity
- **Cosine Similarity** - For finding similar products
- **Collaborative Filtering** - For "customers also bought" recommendations
- **Association Rules** - For complementary items
- **Preference Scoring** - For personalized shop rankings

## Integration with Node.js

The Node.js app calls this service via HTTP. Set the ML service URL in your `.env`:

```env
ML_SERVICE_URL=http://localhost:5000
```

## Notes

- The service gracefully handles errors and returns empty arrays if ML fails
- All endpoints have timeout protection (5 seconds)
- Database connection pooling is handled automatically
- Models are lazy-loaded on first request

