-- INSERT queries for adding products to the database
-- IMPORTANT: Make sure shops are inserted first, as products require shop_id (foreign key)
-- Products reference shop_id from the shops table

-- Single product INSERT query (basic)
INSERT INTO products (name, description, price, shop_id, image_url) 
VALUES ('Product Name', 'Product Description', 100.00, 1, 'https://example.com/image.jpg');

-- Single product INSERT query (with all fields)
INSERT INTO products (name, description, price, shop_id, image_url, created_at) 
VALUES ('Fresh Apples', 'Fresh red apples, 1kg pack', 350.00, 1, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500', CURRENT_TIMESTAMP);

-- Multiple products INSERT query (recommended)
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Fresh organic red apples, 1kg pack', 350.00, 1, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 599.00, 1, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 150.00, 1, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500');

-- INSERT with only required fields (description and image_url are optional)
INSERT INTO products (name, price, shop_id) 
VALUES ('Minimal Product', 100.00, 1);

-- INSERT with NULL for optional fields
INSERT INTO products (name, description, price, shop_id, image_url) 
VALUES ('Product Without Image', 'Product description', 100.00, 1, NULL);

-- Fruits & Vegetables Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Fresh organic red apples, 1kg pack', 350.00, 1, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 599.00, 1, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Fresh Bananas', 'Ripe yellow bananas, 1 dozen', 150.00, 1, 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500'),
('Tomatoes', 'Fresh red tomatoes, 1kg', 80.00, 1, 'https://images.unsplash.com/photo-1546098333-9c091142db9a?w=500'),
('Onions', 'Fresh white onions, 1kg', 60.00, 1, 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500'),
('Potatoes', 'Fresh potatoes, 1kg', 50.00, 1, 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500'),
('Fresh Oranges', 'Sweet oranges, 1kg', 180.00, 1, 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500'),
('Grapes', 'Fresh green grapes, 500g', 250.00, 1, 'https://images.unsplash.com/photo-1537640538966-79f369143a8f?w=500'),
('Strawberries', 'Fresh strawberries, 250g', 200.00, 1, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500'),
('Carrots', 'Fresh carrots, 1kg', 70.00, 1, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500');

-- Dairy Products Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Milk', 'Fresh organic whole milk, 1 liter', 95.00, 2, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 65.00, 2, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Organic Eggs', 'Farm fresh organic eggs, 12 pieces', 180.00, 2, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'),
('Paneer', 'Fresh cottage cheese, 250g', 120.00, 2, 'https://images.unsplash.com/photo-1618164436269-4f50e0e8949e?w=500'),
('Yogurt', 'Fresh curd, 500g', 60.00, 2, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500'),
('Butter', 'Fresh butter, 200g', 90.00, 2, 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=500'),
('Cheese', 'Processed cheese, 200g', 150.00, 2, 'https://images.unsplash.com/photo-1486297678162-e2c09e78f0c4?w=500');

-- Bakery Items Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Whole Wheat Bread', 'Freshly baked whole wheat bread, 500g', 45.00, 3, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('White Bread', 'Fresh white bread, 500g', 35.00, 3, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Brown Bread', 'Fresh brown bread, 500g', 40.00, 3, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'),
('Croissant', 'Fresh butter croissant, 4 pieces', 120.00, 3, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500'),
('Donuts', 'Fresh glazed donuts, 6 pieces', 150.00, 3, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500');

-- Beverages Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Orange Juice', 'Fresh orange juice, 1 liter', 120.00, 4, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'),
('Apple Juice', 'Fresh apple juice, 1 liter', 110.00, 4, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'),
('Coca Cola', 'Cold drink, 750ml', 50.00, 4, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500'),
('Mineral Water', 'Packaged drinking water, 1 liter', 20.00, 4, 'https://images.unsplash.com/photo-1548839140-5a6d0c0b9c0a?w=500'),
('Coffee', 'Instant coffee, 200g', 250.00, 4, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'),
('Tea', 'Premium tea leaves, 250g', 180.00, 4, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500');

-- Snacks & Confectionery Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Potato Chips', 'Crispy potato chips, 150g', 45.00, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500'),
('Biscuits', 'Sweet biscuits, 200g', 35.00, 5, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500'),
('Chocolate', 'Milk chocolate bar, 100g', 60.00, 5, 'https://images.unsplash.com/photo-1606312619070-d48b4e001c59?w=500'),
('Namkeen', 'Spicy namkeen mix, 250g', 80.00, 5, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500'),
('Cookies', 'Butter cookies, 200g', 50.00, 5, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500');

-- Meat & Seafood Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Chicken', 'Fresh chicken, 1kg', 250.00, 6, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Fish', 'Fresh fish, 1kg', 300.00, 6, 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500'),
('Mutton', 'Fresh mutton, 1kg', 600.00, 6, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'),
('Prawns', 'Fresh prawns, 500g', 400.00, 6, 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500'),
('Eggs', 'Farm fresh eggs, 12 pieces', 80.00, 6, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500');

-- Staples & Spices Category
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Rice', 'Basmati rice, 1kg', 120.00, 1, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
('Wheat Flour', 'Whole wheat flour, 1kg', 55.00, 1, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Sugar', 'White sugar, 1kg', 50.00, 1, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500'),
('Salt', 'Iodized salt, 1kg', 25.00, 1, 'https://images.unsplash.com/photo-1608039829573-803fb48872d6?w=500'),
('Cooking Oil', 'Sunflower oil, 1 liter', 150.00, 1, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Turmeric Powder', 'Pure turmeric powder, 200g', 80.00, 1, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'),
('Red Chili Powder', 'Spicy red chili powder, 200g', 70.00, 1, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'),
('Coriander Powder', 'Aromatic coriander powder, 200g', 75.00, 1, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500');

-- INSERT query template (copy and modify as needed)
-- IMPORTANT: Replace shop_id with an actual shop ID from your shops table
-- INSERT INTO products (name, description, price, shop_id, image_url) 
-- VALUES 
-- ('Your Product Name', 'Your Product Description', 100.00, 1, 'Your Image URL');

-- To find shop_id, use:
-- SELECT id, name FROM shops;

-- ============================================
-- SAME PRODUCTS WITH DIFFERENT PRICES
-- ============================================
-- Add the same product to multiple shops with different prices for price comparison
-- This allows customers to compare prices across different shops

-- Example: Adding "Organic Apples" to multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Organic Apples', 'Fresh organic red apples, 1kg pack', 350.00, 1, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Premium organic red apples, 1kg', 420.00, 2, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 380.00, 3, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 365.00, 4, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 340.00, 5, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'),
('Organic Apples', 'Fresh organic red apples, 1kg pack', 360.00, 6, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500');

-- Example: Adding "Milk" to multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Milk', 'Fresh whole milk, 1 liter', 70.00, 1, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 68.00, 2, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 65.00, 3, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 72.00, 4, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 67.00, 5, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'),
('Milk', 'Fresh whole milk, 1 liter', 69.00, 6, 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500');

-- Example: Adding "Premium Mangoes" to multiple shops with different prices
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 599.00, 1, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Organic Alphonso mangoes, 1kg', 650.00, 2, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 580.00, 3, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 610.00, 4, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 570.00, 5, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'),
('Premium Mangoes', 'Sweet Alphonso mangoes, 1kg pack', 590.00, 6, 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500');

-- Benefits of adding same products with different prices:
-- 1. Customers can compare prices across different shops
-- 2. Better shopping experience with price transparency
-- 3. Encourages competitive pricing
-- 4. Helps customers find the best deals

