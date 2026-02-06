/**
 * Script to add car products to the existing database
 * This script only inserts car products without modifying the schema or existing data
 */
const db = require('./models/db');
const fs = require('fs');
const path = require('path');

async function addCarProducts() {
    try {
        console.log('Adding car products to database...');

        // Read the car products SQL file
        const carProductsSQL = fs.readFileSync(
            path.join(__dirname, 'models', 'insert_car_products.sql'),
            'utf8'
        );

        // Execute the SQL to insert car products
        await db.query(carProductsSQL);

        console.log('✅ Car products added successfully!');

        // Get count of products to verify
        const result = await db.query('SELECT COUNT(*) FROM products');
        console.log(`Total products in database: ${result.rows[0].count}`);

        // Show some sample car products
        const carProducts = await db.query(
            "SELECT name, price, shop_id FROM products WHERE name LIKE '%Car%' OR name LIKE '%Engine%' OR name LIKE '%Tire%' LIMIT 5"
        );

        console.log('\nSample car products added:');
        carProducts.rows.forEach(product => {
            console.log(`- ${product.name} (₹${product.price}) - Shop ID: ${product.shop_id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding car products:', error.message);
        console.error('\nMake sure:');
        console.log('1. Your database is running');
        console.log('2. The shops table has data (shop_id 1-6 should exist)');
        console.log('3. The .env file has correct database credentials');
        process.exit(1);
    }
}

addCarProducts();
