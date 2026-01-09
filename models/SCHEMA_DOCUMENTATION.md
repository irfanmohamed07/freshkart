# FreshKart Database Schema Documentation

## Overview
This document describes the complete database schema for the FreshKart grocery e-commerce platform.

## Database Tables

### 1. `users`
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| is_admin | BOOLEAN | DEFAULT FALSE | Admin flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |

**Indexes:** None (email has UNIQUE constraint)

---

### 2. `shops`
Stores shop/vendor information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique shop identifier |
| name | VARCHAR(100) | NOT NULL | Shop name |
| address | TEXT | NOT NULL | Shop address |
| contact | VARCHAR(50) | NULL | Contact number |
| logo | VARCHAR(255) | NULL | Logo image URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Shop creation time |

**Indexes:** None

---

### 3. `products`
Stores product information with shop association.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique product identifier |
| name | VARCHAR(100) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10, 2) | NOT NULL | Product price |
| shop_id | INT | NOT NULL, FK → shops(id) | Associated shop |
| image_url | VARCHAR(255) | NULL | Product image URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Product creation time |

**Foreign Keys:**
- `shop_id` → `shops(id)` ON DELETE CASCADE

**Indexes:**
- `idx_products_shop_id` on `shop_id`
- `idx_products_name` on `name` (for ML search)

**Note:** Products with the same name across different shops enable price comparison feature.

---

### 4. `cart_items`
Stores items in user's shopping cart.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique cart item identifier |
| user_id | INT | NOT NULL, FK → users(id) | User who owns the cart |
| product_id | INT | NOT NULL, FK → products(id) | Product in cart |
| shop_id | INT | NOT NULL, FK → shops(id) | Shop selling the product |
| quantity | INT | NOT NULL, DEFAULT 1 | Quantity of product |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Item added time |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `product_id` → `products(id)` ON DELETE CASCADE
- `shop_id` → `shops(id)` ON DELETE CASCADE

**Indexes:**
- `idx_cart_items_user_id` on `user_id`
- `idx_cart_items_product_id` on `product_id`

---

### 5. `orders`
Stores order information including payment and shipping details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique order identifier |
| user_id | INT | NOT NULL, FK → users(id) | User who placed order |
| total_amount | DECIMAL(10, 2) | NOT NULL | Total order amount |
| payment_status | VARCHAR(50) | DEFAULT 'pending' | Payment status: pending, paid, failed |
| shipping_address | TEXT | NULL | Delivery address |
| phone | VARCHAR(50) | NULL | Contact phone for delivery |
| razorpay_order_id | VARCHAR(100) | NULL | Razorpay order ID |
| razorpay_payment_id | VARCHAR(100) | NULL | Razorpay payment ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation time |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Indexes:**
- `idx_orders_user_id` on `user_id`
- `idx_orders_payment_status` on `payment_status`
- `idx_orders_created_at` on `created_at DESC` (for ML recommendations)

**Payment Status Values:**
- `pending` - Payment not yet completed
- `paid` - Payment successful
- `failed` - Payment failed

---

### 6. `order_items`
Stores individual items in each order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique order item identifier |
| order_id | INT | NOT NULL, FK → orders(id) | Associated order |
| product_id | INT | NOT NULL, FK → products(id) | Product ordered |
| shop_id | INT | NOT NULL, FK → shops(id) | Shop selling the product |
| quantity | INT | NOT NULL | Quantity ordered |
| price | DECIMAL(10, 2) | NOT NULL | Price at time of order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Item creation time |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE
- `product_id` → `products(id)` ON DELETE SET NULL
- `shop_id` → `shops(id)` ON DELETE SET NULL

**Indexes:**
- `idx_order_items_order_id` on `order_id`
- `idx_order_items_product_id` on `product_id` (for ML "also bought")

**Note:** Price is stored at time of order to preserve historical pricing.

---

### 7. `order_tracking`
Stores order status history for tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique tracking entry identifier |
| order_id | INT | NOT NULL, FK → orders(id) | Associated order |
| status | VARCHAR(50) | NOT NULL | Order status |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Status update time |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE

**Indexes:**
- `idx_order_tracking_order_id` on `order_id`
- `idx_order_tracking_status` on `status`

**Status Values:**
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by shop
- `preparing` - Order being prepared
- `out_for_delivery` - Order dispatched for delivery
- `delivered` - Order delivered successfully
- `cancelled` - Order cancelled

---

## Relationships

```
users
  ├── cart_items (1:N)
  └── orders (1:N)

shops
  ├── products (1:N)
  ├── cart_items (1:N)
  └── order_items (1:N)

products
  ├── cart_items (1:N)
  └── order_items (1:N)

orders
  ├── order_items (1:N)
  └── order_tracking (1:N)
```

## ML Features Supported

### 1. Home Page Recommendations
- Uses: `orders`, `order_items`, `products`
- Analyzes user purchase history to recommend products

### 2. Product Similarity
- Uses: `products` (name, description)
- Content-based filtering using TF-IDF

### 3. Customers Also Bought
- Uses: `order_items`, `orders`
- Collaborative filtering based on co-purchase patterns

### 4. Cart Suggestions
- Uses: `cart_items`, `order_items`, `orders`
- Finds complementary items and better deals

### 5. Shop Ranking
- Uses: `orders`, `order_items`, `shops`
- Personalizes shop order based on user preferences

### 6. Search Ranking
- Uses: `products` (name, description)
- ML-powered relevance ranking

## Indexes Summary

| Index | Table | Column(s) | Purpose |
|-------|-------|-----------|---------|
| idx_products_shop_id | products | shop_id | Fast shop product lookup |
| idx_products_name | products | name | ML search and similarity |
| idx_cart_items_user_id | cart_items | user_id | Fast cart retrieval |
| idx_cart_items_product_id | cart_items | product_id | Product cart analysis |
| idx_orders_user_id | orders | user_id | User order history |
| idx_orders_payment_status | orders | payment_status | Filter by payment status |
| idx_orders_created_at | orders | created_at DESC | ML recommendation queries |
| idx_order_items_order_id | order_items | order_id | Order details lookup |
| idx_order_items_product_id | order_items | product_id | ML "also bought" analysis |
| idx_order_tracking_order_id | order_tracking | order_id | Order status history |
| idx_order_tracking_status | order_tracking | status | Status filtering |

## Data Types Notes

- **DECIMAL(10, 2)**: Used for prices and amounts. Stores up to 10 digits with 2 decimal places (max: 99,999,999.99)
- **SERIAL**: Auto-incrementing integer (PostgreSQL)
- **TIMESTAMP**: Stores date and time
- **TEXT**: Variable-length text (unlimited length)
- **VARCHAR(n)**: Variable-length string with max length n

## Migration Notes

If you have an existing database, use `alter_orders.sql` to add:
- `shipping_address` column to `orders` table
- `phone` column to `orders` table

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
```

## Sample Data

Sample data is included in:
- `schema.sql` - Basic sample data
- `insert_shops.sql` - Shop data
- `insert_products.sql` - Product data with price variations

---

**Last Updated:** Finalized schema with ML support
**Version:** 1.0.0



