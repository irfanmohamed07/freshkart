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
      { name: 'AutoParts Zone', address: '123 Motor Way', contact: '123-456-7890', logo: 'https://images.unsplash.com/photo-1486262715619-01b80258e0a2?w=500' },
      { name: 'Mechanic Shop Pro', address: '456 Gear St', contact: '234-567-8901', logo: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?w=500' },
      { name: 'Sparkle Car Wash', address: '789 Bubble Ave', contact: '345-678-9012', logo: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500' },
      { name: 'Detailing Experts', address: '101 Shine Rd', contact: '456-789-0123', logo: 'https://images.unsplash.com/photo-1619642751034-765451fb2d66?w=500' }
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
      // Spare Parts
      { name: 'Synthetic Engine Oil 5W-40', description: 'High performance synthetic oil for gasoline engines. Improves fuel economy.', price: 3500.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?w=500' },
      { name: 'Oil Filter', description: 'Premium oil filter removing 99.9% of contaminants.', price: 450.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1626127027588-444b0f92b3a1?w=500' },
      { name: 'Ceramic Brake Pads (Front)', description: 'Low noise and low dust ceramic brake pads for sedans.', price: 2800.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1562916124-672e850b7b05?w=500' },
      { name: 'Brake Rotors (Pair)', description: 'High carbon steel brake rotors for better heat dissipation.', price: 4200.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1486262715619-01b80258e0a2?w=500' },
      { name: 'Car Battery 12V 60Ah', description: 'Maintenance-free long life battery with 3 year warranty.', price: 5500.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500' },
      { name: 'Spark Plug Set (4 pcs)', description: 'Iridium spark plugs for efficient combustion and longer life.', price: 1200.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=500' },
      { name: 'Air Filter', description: 'High flow air filter to improve engine performance.', price: 350.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1486262715619-01b80258e0a2?w=500' },
      { name: 'Cabin Air Filter', description: 'Activated carbon filter to keep car interior air fresh.', price: 600.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1486262715619-01b80258e0a2?w=500' },
      { name: 'Wiper Blades (Pair)', description: 'All-weather silicone wiper blades 24 inch + 18 inch.', price: 800.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500' },
      { name: 'Headlight Bulb LED H4', description: 'Bright white LED headlight bulbs 6000K.', price: 1500.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=500' },

      // Services
      { name: 'Basic Car Wash', description: 'Exterior foam wash and tyre dressing for sedans and hatchbacks.', price: 499.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500' },
      { name: 'Premium Interior Detailing', description: 'Deep cleaning of seats, carpets, dashboard and roof.', price: 1499.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1507138451611-31ff74cfc470?w=500' },
      { name: 'Full Car Spa Package', description: 'Exterior wash, interior detailing, and wax polishing.', price: 2499.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1520340356584-7e3f43e69007?w=500' },
      { name: 'Ceramic Coating (1 Year)', description: 'Protective ceramic coating for paint gloss and hydrophobicity.', price: 9999.00, shop_id: 4, image_url: 'https://images.unsplash.com/photo-1619642751034-765451fb2d66?w=500' },
      { name: 'Tyre Polish & Rim Cleaning', description: 'Special treatment for deep black tyres and shiny rims.', price: 299.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500' },
      { name: 'Windshield Water Repellent', description: 'Treatment to improve visibility during rain.', price: 399.00, shop_id: 4, image_url: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500' },
      { name: 'A/C Vent Cleaning', description: 'Steam cleaning of air conditioning vents to remove bacteria.', price: 699.00, shop_id: 3, image_url: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=500' },
      { name: 'Engine Bay Cleaning', description: 'Professional degreasing and dressing of engine bay.', price: 899.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1486262715619-01b80258e0a2?w=500' },
      { name: 'Coolant Top-up (1L)', description: 'Premixed coolant refill to prevent overheating.', price: 300.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?w=500' },
      { name: 'Brake Fluid (500ml)', description: 'DOT 4 brake fluid for reliable braking performance.', price: 250.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1562916124-672e850b7b05?w=500' },

      // Comparison Products (Same items, different shops & prices)
      { name: 'Synthetic Engine Oil 5W-40', description: 'High performance synthetic oil for gasoline engines. Improves fuel economy.', price: 3200.00, shop_id: 2, image_url: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?w=500' },
      { name: 'Synthetic Engine Oil 5W-40', description: 'High performance synthetic oil for gasoline engines. Improves fuel economy.', price: 3800.00, shop_id: 4, image_url: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?w=500' },
      { name: 'Basic Car Wash', description: 'Exterior foam wash and tyre dressing for sedans and hatchbacks.', price: 550.00, shop_id: 4, image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500' },
      { name: 'Car Battery 12V 60Ah', description: 'Maintenance-free long life battery with 3 year warranty.', price: 5200.00, shop_id: 1, image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500' }
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