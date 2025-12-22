-- ============================================================================
-- FreshKart Database Schema - Finalized Version
-- ============================================================================
-- This schema includes all tables, indexes, and relationships for the
-- FreshKart grocery e-commerce platform with ML recommendations support.
-- ============================================================================

-- Drop tables if they exist (useful for resetting the database)
-- Note: Drop in reverse order of dependencies
DROP TABLE IF EXISTS order_tracking CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
-- Stores user account information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shops table
-- Stores shop/vendor information
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact VARCHAR(50),
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
-- Stores product information with shop association
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    shop_id INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- ============================================================================
-- SHOPPING CART TABLES
-- ============================================================================

-- Cart items table
-- Stores items in user's shopping cart
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    shop_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- ============================================================================
-- ORDER MANAGEMENT TABLES
-- ============================================================================

-- Orders table
-- Stores order information including payment and shipping details
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    phone VARCHAR(50),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
-- Stores individual items in each order
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    shop_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE SET NULL
);

-- Order tracking table
-- Stores order status history for tracking
CREATE TABLE order_tracking (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Product indexes
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_name ON products(name); -- For ML search and similarity

-- Cart indexes
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Order indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC); -- For ML recommendations

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id); -- For ML "also bought"

-- Order tracking indexes
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_status ON order_tracking(status);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE shops IS 'Stores shop/vendor information';
COMMENT ON TABLE products IS 'Stores product information with shop association';
COMMENT ON TABLE cart_items IS 'Stores items in user shopping cart';
COMMENT ON TABLE orders IS 'Stores order information including payment and shipping';
COMMENT ON TABLE order_items IS 'Stores individual items in each order';
COMMENT ON TABLE order_tracking IS 'Stores order status history for tracking';

COMMENT ON COLUMN orders.payment_status IS 'Status: pending, paid, failed';
COMMENT ON COLUMN orders.shipping_address IS 'Delivery address for the order';
COMMENT ON COLUMN orders.phone IS 'Contact phone number for delivery';
COMMENT ON COLUMN order_tracking.status IS 'Status: pending, confirmed, preparing, out_for_delivery, delivered, cancelled';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample users
-- Password hash is for 'password123'
INSERT INTO users (name, email, password_hash, is_admin) VALUES 
('Admin User', 'admin@example.com', '$2b$10$5hLYWbGUEZZV8Zy5qz9yO.0w6DdGTajtgLJXYg5wvDV7XiD6dG1bW', TRUE),
('John Doe', 'john@example.com', '$2b$10$5hLYWbGUEZZV8Zy5qz9yO.0w6DdGTajtgLJXYg5wvDV7XiD6dG1bW', FALSE);

-- Sample shops
INSERT INTO shops (name, address, contact, logo) VALUES 
('Fresh Fruits Market', '123 Main Street, City Center, Mumbai 400001', '+91 98765 43210', 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500'),
('Organic Store', '456 Elm Avenue, Sector 15, Delhi 110015', '+91 98765 43211', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'),
('Super Grocery', '789 Oak Road, MG Road, Bangalore 560001', '+91 98765 43212', 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=500'),
('Green Valley Mart', '321 Pine Street, HSR Layout, Bangalore 560102', '+91 98765 43213', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'),
('Daily Needs Store', '654 Maple Drive, Koramangala, Bangalore 560095', '+91 98765 43214', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=500'),
('Fresh & Local', '987 Cedar Lane, Indiranagar, Bangalore 560038', '+91 98765 43215', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500');

-- Sample products
-- Note: Products with same names across different shops enable price comparison feature

-- Fruits & Vegetables - Shop 1 (Fresh Fruits Market)
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Fresh organic red apples, 1kg pack', 350.00, 1, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 599.00, 1, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 150.00, 1, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 80.00, 1, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Onions', 'Fresh white onions, 1kg', 60.00, 1, 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500'),
('Potatoes', 'Fresh potatoes, 1kg', 50.00, 1, 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500');

-- Organic Store Products - Shop 2
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Premium organic red apples, 1kg', 420.00, 2, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Mangoes', 'Organic Alphonso mangoes, 1kg', 650.00, 2, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Organic Bananas', 'Organic ripe bananas, 1 dozen', 180.00, 2, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Organic Tomatoes', 'Organic red tomatoes, 1kg', 120.00, 2, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Organic Milk', 'Fresh organic whole milk, 1 liter', 95.00, 2, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 180.00, 2, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500');

-- Super Grocery Products - Shop 3
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Red Apples', 'Fresh red apples, 1kg pack', 320.00, 3, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Mangoes', 'Sweet mangoes, 1kg pack', 550.00, 3, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Bananas', 'Fresh bananas, 1 dozen', 140.00, 3, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 45.00, 3, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('White Bread', 'Fresh white bread, 500g', 35.00, 3, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 65.00, 3, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500');

-- Green Valley Mart Products - Shop 4
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Fresh Oranges', 'Sweet oranges, 1kg', 180.00, 4, 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500'),
('Grapes', 'Fresh green grapes, 500g', 250.00, 4, 'https://images.unsplash.com/photo-1537640538966-79f369143a8f?w=500'),
('Strawberries', 'Fresh strawberries, 250g', 200.00, 4, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500'),
('Carrots', 'Fresh carrots, 1kg', 70.00, 4, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500'),
('Capsicum', 'Fresh green capsicum, 500g', 90.00, 4, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500'),
('Cucumber', 'Fresh cucumber, 1kg', 60.00, 4, 'https://images.unsplash.com/photo-1604977043462-896b8c2b2a7b?w=500');

-- Daily Needs Store Products - Shop 5
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Rice', 'Basmati rice, 1kg', 120.00, 5, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Wheat Flour', 'Whole wheat flour, 1kg', 55.00, 5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Sugar', 'White sugar, 1kg', 50.00, 5, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500'),
('Salt', 'Iodized salt, 1kg', 25.00, 5, 'https://images.unsplash.com/photo-1608039829573-803fb48872d6?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 150.00, 5, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Turmeric Powder', 'Pure turmeric powder, 200g', 80.00, 5, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500');

-- Fresh & Local Products - Shop 6
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Paneer', 'Fresh cottage cheese, 250g', 120.00, 6, 'https://images.unsplash.com/photo-1618164436269-4f50e0e8949e?w=500'),
('Yogurt', 'Fresh curd, 500g', 60.00, 6, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500'),
('Butter', 'Fresh butter, 200g', 90.00, 6, 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=500'),
('Cheese', 'Processed cheese, 200g', 150.00, 6, 'https://images.unsplash.com/photo-1486297678162-e2c09e78f0c4?w=500'),
('Chicken', 'Fresh chicken, 1kg', 250.00, 6, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Fish', 'Fresh fish, 1kg', 300.00, 6, 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500');

-- Additional products with same names but different prices across shops (for price comparison)
-- Organic Apples - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Fresh organic red apples, 1kg pack', 380.00, 3, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 365.00, 4, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 340.00, 5, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 360.00, 6, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500');

-- Premium Mangoes - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 620.00, 2, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 580.00, 3, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 610.00, 4, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 570.00, 5, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 590.00, 6, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500');

-- Fresh Bananas - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 160.00, 2, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 145.00, 3, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 155.00, 4, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 148.00, 5, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 152.00, 6, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500');

-- Tomatoes - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Tomatoes', 'Fresh red tomatoes, 1kg', 85.00, 2, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 75.00, 3, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 82.00, 4, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 78.00, 5, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 80.00, 6, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500');

-- Milk - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Milk', 'Fresh whole milk, 1 liter', 70.00, 1, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 68.00, 2, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 72.00, 4, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 67.00, 5, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 69.00, 6, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500');

-- Whole Wheat Bread - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 48.00, 1, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 50.00, 2, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 42.00, 4, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 46.00, 5, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 44.00, 6, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500');

-- Organic Eggs - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 190.00, 1, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 175.00, 3, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 185.00, 4, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 170.00, 5, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 178.00, 6, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500');

-- Rice - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Rice', 'Basmati rice, 1kg', 125.00, 1, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Rice', 'Basmati rice, 1kg', 130.00, 2, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Rice', 'Basmati rice, 1kg', 118.00, 3, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Rice', 'Basmati rice, 1kg', 122.00, 4, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Rice', 'Basmati rice, 1kg', 115.00, 6, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500');

-- Cooking Oil - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Cooking Oil', 'Sunflower oil, 1 liter', 155.00, 1, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 160.00, 2, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 148.00, 3, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 152.00, 4, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 145.00, 6, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500');

-- Chicken - available at multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Chicken', 'Fresh chicken, 1kg', 260.00, 1, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Chicken', 'Fresh chicken, 1kg', 270.00, 2, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Chicken', 'Fresh chicken, 1kg', 245.00, 3, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Chicken', 'Fresh chicken, 1kg', 255.00, 4, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Chicken', 'Fresh chicken, 1kg', 240.00, 5, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

