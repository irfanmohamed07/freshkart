/**
 * Script to initialize the database with schema and sample data
 */
const db = require('./models/db');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Read schema.sql
    const fs = require('fs');
    const path = require('path');
    const schema = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf8');

    // Execute schema to create tables
    await db.query(schema);
    console.log('Database schema created successfully');

    // Add sample shops
    const shops = [
      { name: 'Fresh Fruits Market', address: '123 Main St', contact: '123-456-7890', logo: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500' },
      { name: 'Organic Store', address: '456 Elm St', contact: '234-567-8901', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' },
      { name: 'Super Grocery', address: '789 Oak St', contact: '345-678-9012', logo: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=500' }
    ];

    for (const shop of shops) {
      await db.query(
        'INSERT INTO shops (name, address, contact, logo) VALUES ($1, $2, $3, $4)',
        [shop.name, shop.address, shop.contact, shop.logo]
      );
    }
    console.log('Sample shops added successfully');

    // Add sample products with different prices across shops
    const products = [
      // Same products at different prices across shops
      { name: 'Organic Apples', description: 'Fresh organic apples', price: 350.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500' },
      { name: 'Organic Apples', description: 'Fresh organic apples', price: 320.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500' },
      { name: 'Organic Apples', description: 'Fresh organic apples', price: 380.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500' },
      
      { name: 'Premium Mangoes', description: 'Delicious mangoes', price: 599.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500' },
      { name: 'Premium Mangoes', description: 'Delicious mangoes', price: 580.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500' },
      { name: 'Premium Mangoes', description: 'Delicious mangoes', price: 620.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500' },
      
      { name: 'Whole Wheat Bread', description: 'Freshly baked bread', price: 45.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
      { name: 'Whole Wheat Bread', description: 'Freshly baked bread', price: 40.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
      { name: 'Whole Wheat Bread', description: 'Freshly baked bread', price: 50.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },

      { name: 'Bananas', description: 'Fresh bananas', price: 150.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500' },
      { name: 'Bananas', description: 'Fresh bananas', price: 140.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500' },
      { name: 'Bananas', description: 'Fresh bananas', price: 160.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=500' },

      { name: 'Carrots', description: 'Organic carrots', price: 200.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500' },
      { name: 'Carrots', description: 'Organic carrots', price: 190.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500' },
      { name: 'Carrots', description: 'Organic carrots', price: 210.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500' },

      { name: 'Tomatoes', description: 'Fresh tomatoes', price: 180.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Tomatoes', description: 'Fresh tomatoes', price: 170.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Tomatoes', description: 'Fresh tomatoes', price: 190.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Spinach', description: 'Fresh spinach leaves', price: 120.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Spinach', description: 'Fresh spinach leaves', price: 110.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Spinach', description: 'Fresh spinach leaves', price: 130.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Potatoes', description: 'Organic potatoes', price: 90.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Potatoes', description: 'Organic potatoes', price: 85.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Potatoes', description: 'Organic potatoes', price: 95.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Oranges', description: 'Juicy oranges', price: 250.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Oranges', description: 'Juicy oranges', price: 240.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Oranges', description: 'Juicy oranges', price: 260.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Shampoo', description: 'A bottle of shampoo', price: 300.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Shampoo', description: 'A bottle of shampoo', price: 290.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Shampoo', description: 'A bottle of shampoo', price: 310.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Juice', description: 'A pack of fruit juice', price: 150.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Juice', description: 'A pack of fruit juice', price: 140.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Juice', description: 'A pack of fruit juice', price: 160.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Lays', description: 'A packet of Lays chips', price: 50.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Lays', description: 'A packet of Lays chips', price: 45.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Lays', description: 'A packet of Lays chips', price: 55.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },

      { name: 'Rice', description: 'A bag of rice', price: 500.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Rice', description: 'A bag of rice', price: 480.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
      { name: 'Rice', description: 'A bag of rice', price: 520.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1582515073490-dc7b1e7e8f9e?w=500' },
    ];

    for (const product of products) {
      await db.query(
        'INSERT INTO products (name, description, price, shop_id, image_url) VALUES ($1, $2, $3, $4, $5)',
        [product.name, product.description, product.price, product.shop_id, product.image_url]
      );
    }
    console.log('Sample products added successfully');

    // Add sample users
    const password = await bcrypt.hash('password123', 10);
    await db.query(
      'INSERT INTO users (name, email, password_hash, is_admin) VALUES ($1, $2, $3, $4)',
      ['Admin User', 'admin@example.com', password, true]
    );
    await db.query(
      'INSERT INTO users (name, email, password_hash, is_admin) VALUES ($1, $2, $3, $4)',
      ['John Doe', 'john@example.com', password, false]
    );
    console.log('Sample users added successfully');

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 