-- INSERT queries for adding shops to the database
-- Use these queries to add shops manually or in bulk

-- Single shop INSERT query (basic)
INSERT INTO shops (name, address, contact, logo) 
VALUES ('Shop Name', 'Shop Address', 'Contact Number', 'Logo URL');

-- Single shop INSERT query (with all fields)
INSERT INTO shops (name, address, contact, logo, created_at) 
VALUES ('Fresh Market', '123 Main Street, City, State 12345', '+91 98765 43210', 'https://example.com/logo.png', CURRENT_TIMESTAMP);

-- Multiple shops INSERT query (recommended)
INSERT INTO shops (name, address, contact, logo) VALUES 
('Fresh Fruits Market', '123 Main Street, City Center, Mumbai 400001', '+91 98765 43210', 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500'),
('Organic Store', '456 Elm Avenue, Sector 15, Delhi 110015', '+91 98765 43211', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'),
('Super Grocery', '789 Oak Road, MG Road, Bangalore 560001', '+91 98765 43212', 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=500'),
('Green Valley Mart', '321 Pine Street, HSR Layout, Bangalore 560102', '+91 98765 43213', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'),
('Daily Needs Store', '654 Maple Drive, Koramangala, Bangalore 560095', '+91 98765 43214', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=500'),
('Fresh & Local', '987 Cedar Lane, Indiranagar, Bangalore 560038', '+91 98765 43215', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500');

-- INSERT with only required fields (contact and logo are optional)
INSERT INTO shops (name, address) 
VALUES ('Minimal Shop', 'Address without contact or logo');

-- INSERT with NULL for optional fields
INSERT INTO shops (name, address, contact, logo) 
VALUES ('Shop Without Logo', '123 Street, City', '+91 98765 43210', NULL);

-- INSERT query template (copy and modify as needed)
-- INSERT INTO shops (name, address, contact, logo) 
-- VALUES 
-- ('Your Shop Name', 'Your Shop Address', 'Your Contact Number', 'Your Logo URL');

