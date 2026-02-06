-- INSERT queries for adding car products to the database
-- IMPORTANT: Make sure shops are inserted first, as products require shop_id (foreign key)
-- These car products use the existing products table schema without any modifications

-- ============================================
-- CAR ACCESSORIES & PARTS CATEGORY
-- ============================================

-- Car Care & Cleaning Products
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Shampoo', 'Premium car wash shampoo, 500ml', 299.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Car Wax Polish', 'Professional grade car wax polish, 300g', 499.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Microfiber Cloth Set', 'Premium microfiber cleaning cloths, 5 pack', 249.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Tire Shine Spray', 'Long-lasting tire shine, 400ml', 349.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Dashboard Cleaner', 'Dashboard polish and cleaner, 250ml', 199.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500');

-- Car Interior Accessories
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Floor Mats', 'Universal fit rubber floor mats, set of 4', 899.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Seat Covers', 'Premium leather seat covers, full set', 2499.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Steering Wheel Cover', 'Leather steering wheel cover, universal fit', 399.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Air Freshener', 'Long-lasting car air freshener, ocean breeze', 149.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Organizer', 'Trunk organizer with multiple compartments', 799.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Sunshade', 'Foldable windshield sunshade', 299.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500');

-- Car Electronics & Gadgets
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Phone Holder', 'Magnetic car phone mount', 399.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'),
('Car Charger', 'Dual USB fast car charger, 3.1A', 299.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'),
('Dash Cam', 'HD dash camera with night vision', 2999.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'),
('Car Bluetooth Speaker', 'Portable bluetooth speaker for car', 899.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'),
('GPS Navigation System', 'Touchscreen GPS navigator, 7 inch', 4999.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'),
('Car FM Transmitter', 'Bluetooth FM transmitter with USB charging', 599.00, 3, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500');

-- Car Safety & Emergency
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('First Aid Kit', 'Complete car first aid kit', 699.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'),
('Fire Extinguisher', 'Compact car fire extinguisher, 1kg', 899.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'),
('Emergency Triangle', 'Reflective warning triangle set', 399.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'),
('Jumper Cables', 'Heavy duty jumper cables, 3 meters', 799.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'),
('Tire Pressure Gauge', 'Digital tire pressure gauge', 349.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'),
('Car Jack', 'Hydraulic car jack, 2 ton capacity', 1999.00, 4, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500');

-- Car Maintenance & Tools
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Engine Oil', 'Synthetic engine oil, 5W-30, 4 liters', 1499.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Oil Filter', 'Premium oil filter, universal fit', 299.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Air Filter', 'High performance air filter', 499.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Brake Fluid', 'DOT 4 brake fluid, 500ml', 399.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Coolant', 'Engine coolant, 1 liter', 349.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Windshield Washer Fluid', 'Windshield washer fluid, 2 liters', 199.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Spark Plugs', 'Iridium spark plugs, set of 4', 899.00, 5, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500');

-- Car Exterior Accessories
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Cover', 'Waterproof car cover, universal fit', 1999.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Wiper Blades', 'Premium wiper blades, pair', 599.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Side Mirror Cover', 'Chrome side mirror covers, pair', 799.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Mud Flaps', 'Universal mud flaps, set of 4', 699.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Car Antenna', 'Short antenna for better reception', 299.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('License Plate Frame', 'Premium chrome license plate frame', 399.00, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500');

-- Car Lighting
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('LED Headlight Bulbs', 'Super bright LED headlight bulbs, H4', 1499.00, 1, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500'),
('Fog Light Bulbs', 'Halogen fog light bulbs, pair', 599.00, 1, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500'),
('Interior LED Lights', 'LED interior light kit, 8 pieces', 899.00, 1, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500'),
('Tail Light Bulbs', 'Red tail light bulbs, pair', 399.00, 1, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500');

-- Car Audio & Entertainment
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Speakers', '6.5 inch coaxial car speakers, pair', 2499.00, 2, 'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?w=500'),
('Car Subwoofer', '10 inch powered subwoofer', 4999.00, 2, 'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?w=500'),
('Car Amplifier', '4-channel car amplifier, 1000W', 5999.00, 2, 'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?w=500'),
('Car Stereo', 'Touchscreen car stereo with Bluetooth', 6999.00, 2, 'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?w=500');

-- Car Performance Parts
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Performance Air Filter', 'High-flow performance air filter', 1999.00, 3, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Exhaust Tip', 'Stainless steel exhaust tip', 899.00, 3, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Turbo Boost Gauge', 'Digital turbo boost gauge', 1499.00, 3, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'),
('Performance Spark Plugs', 'Racing spark plugs, set of 4', 1299.00, 3, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500');

-- ============================================
-- SAME CAR PRODUCTS WITH DIFFERENT PRICES
-- ============================================
-- Add popular car products to multiple shops for price comparison

-- Car Shampoo across multiple shops
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Shampoo', 'Premium car wash shampoo, 500ml', 299.00, 1, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Car Shampoo', 'Premium car wash shampoo, 500ml', 279.00, 2, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Car Shampoo', 'Premium car wash shampoo, 500ml', 289.00, 3, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'),
('Car Shampoo', 'Premium car wash shampoo, 500ml', 310.00, 4, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500');

-- Engine Oil across multiple shops
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Engine Oil', 'Synthetic engine oil, 5W-30, 4 liters', 1499.00, 1, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Engine Oil', 'Synthetic engine oil, 5W-30, 4 liters', 1450.00, 2, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Engine Oil', 'Synthetic engine oil, 5W-30, 4 liters', 1520.00, 3, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'),
('Engine Oil', 'Synthetic engine oil, 5W-30, 4 liters', 1480.00, 4, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500');

-- Car Floor Mats across multiple shops
INSERT INTO products (name, description, price, shop_id, image_url) VALUES 
('Car Floor Mats', 'Universal fit rubber floor mats, set of 4', 899.00, 1, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Floor Mats', 'Universal fit rubber floor mats, set of 4', 850.00, 2, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Floor Mats', 'Universal fit rubber floor mats, set of 4', 920.00, 3, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500'),
('Car Floor Mats', 'Universal fit rubber floor mats, set of 4', 880.00, 4, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500');

-- Benefits of this approach:
-- 1. No schema changes required - uses existing products table
-- 2. Car products work with existing cart, order, and shop systems
-- 3. Customers can compare car product prices across shops
-- 4. Easy to add more car products in the future
-- 5. All existing product features (search, filter, etc.) work automatically

-- To insert these products, run:
-- psql -U your_username -d your_database -f insert_car_products.sql
-- OR use the init-db.js script to execute this file
