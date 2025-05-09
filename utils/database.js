const fs = require('fs');
const path = require('path');
const { pool } = require('../models/db');

/**
 * Function to initialize the database with schema
 */
async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to the database and run the schema
    const client = await pool.connect();
    
    try {
      await client.query(schema);
      console.log('Database schema initialized successfully');
    } finally {
      client.release();
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Add sample data for development
 */
async function addSampleData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Add sample shops
    const shops = [
      {
        name: 'Fresh Market',
        address: '123 Main St, Anytown, USA',
        contact: '555-123-4567',
        logo: '/images/shops/fresh-market.jpg'
      },
      {
        name: 'Organic Grocery',
        address: '456 Oak Ave, Somewhere, USA',
        contact: '555-987-6543',
        logo: '/images/shops/organic-grocery.jpg'
      },
      {
        name: 'Super Mart',
        address: '789 Pine Rd, Nowhere, USA',
        contact: '555-567-8901',
        logo: '/images/shops/super-mart.jpg'
      }
    ];
    
    for (const shop of shops) {
      await client.query(
        'INSERT INTO shops (name, address, contact, logo, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [shop.name, shop.address, shop.contact, shop.logo]
      );
    }
    
    // Get shop IDs
    const shopsResult = await client.query('SELECT id, name FROM shops');
    const shopMap = {};
    
    shopsResult.rows.forEach(shop => {
      shopMap[shop.name] = shop.id;
    });
    
    // Add sample products
    const products = [
      {
        name: 'Apples',
        description: 'Fresh red apples, 1kg pack',
        price: 2.99,
        shop_id: shopMap['Fresh Market'],
        image_url: '/images/products/apples.jpg'
      },
      {
        name: 'Bananas',
        description: 'Ripe yellow bananas, 1kg pack',
        price: 1.99,
        shop_id: shopMap['Fresh Market'],
        image_url: '/images/products/bananas.jpg'
      },
      {
        name: 'Milk',
        description: 'Fresh whole milk, 1 liter',
        price: 1.49,
        shop_id: shopMap['Fresh Market'],
        image_url: '/images/products/milk.jpg'
      },
      {
        name: 'Bread',
        description: 'Whole wheat bread, 500g loaf',
        price: 2.49,
        shop_id: shopMap['Fresh Market'],
        image_url: '/images/products/bread.jpg'
      },
      {
        name: 'Organic Apples',
        description: 'Organic red apples, 1kg pack',
        price: 3.99,
        shop_id: shopMap['Organic Grocery'],
        image_url: '/images/products/organic-apples.jpg'
      },
      {
        name: 'Organic Bananas',
        description: 'Organic ripe yellow bananas, 1kg pack',
        price: 2.99,
        shop_id: shopMap['Organic Grocery'],
        image_url: '/images/products/organic-bananas.jpg'
      },
      {
        name: 'Organic Milk',
        description: 'Organic whole milk, 1 liter',
        price: 2.49,
        shop_id: shopMap['Organic Grocery'],
        image_url: '/images/products/organic-milk.jpg'
      },
      {
        name: 'Organic Bread',
        description: 'Organic whole wheat bread, 500g loaf',
        price: 3.49,
        shop_id: shopMap['Organic Grocery'],
        image_url: '/images/products/organic-bread.jpg'
      },
      {
        name: 'Apples',
        description: 'Red apples, 1kg pack',
        price: 2.29,
        shop_id: shopMap['Super Mart'],
        image_url: '/images/products/apples-supermart.jpg'
      },
      {
        name: 'Bananas',
        description: 'Yellow bananas, 1kg pack',
        price: 1.79,
        shop_id: shopMap['Super Mart'],
        image_url: '/images/products/bananas-supermart.jpg'
      },
      {
        name: 'Milk',
        description: 'Whole milk, 1 liter',
        price: 1.29,
        shop_id: shopMap['Super Mart'],
        image_url: '/images/products/milk-supermart.jpg'
      },
      {
        name: 'Bread',
        description: 'White bread, 500g loaf',
        price: 1.99,
        shop_id: shopMap['Super Mart'],
        image_url: '/images/products/bread-supermart.jpg'
      }
    ];
    
    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, description, price, shop_id, image_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
        [product.name, product.description, product.price, product.shop_id, product.image_url]
      );
    }
    
    await client.query('COMMIT');
    console.log('Sample data added successfully');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding sample data:', error);
    return false;
  } finally {
    client.release();
  }
}

module.exports = {
  initializeDatabase,
  addSampleData
}; 