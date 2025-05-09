# Grocery E-commerce App

A grocery e-commerce application where users can browse shops, add products to a cart, compare prices, pay with Razorpay, and track orders.

## Features

- User authentication (login, signup, logout)
- Browse shops and their products
- Add products to cart
- Compare product prices across different shops
- Checkout and payment with Razorpay
- Order history and tracking

## Tech Stack

- **Frontend**: EJS templates, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: express-session
- **Payment**: Razorpay

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd grocery-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your-secret-key
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=grocery_app
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   
   # Razorpay Configuration (for production)
   # RAZORPAY_KEY_ID=your-key-id
   # RAZORPAY_KEY_SECRET=your-key-secret
   ```

4. Initialize the database:
   ```
   npm run init-db
   ```

5. Build CSS:
   ```
   npm run build-css
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Visit `http://localhost:3000` in your browser

## Database Schema

The application uses the following database tables:

- `users`: User information (id, name, email, password_hash, etc.)
- `shops`: Shop details (id, name, address, contact, logo)
- `products`: Product information (id, name, description, price, shop_id, image_url)
- `cart_items`: Cart items (id, user_id, product_id, shop_id, quantity)
- `orders`: Order details (id, user_id, total_amount, payment_status, etc.)
- `order_items`: Items in an order (id, order_id, product_id, shop_id, quantity, price)
- `order_tracking`: Order status updates (id, order_id, status, updated_at)

## Development

### File Structure

```
grocery-app/
├── controllers/      # Controller logic
├── middlewares/      # Middleware functions
├── models/           # Database models
├── public/           # Static assets
│   ├── css/
│   ├── js/
│   └── images/
├── routes/           # Route definitions
├── utils/            # Utility functions
├── views/            # EJS templates
├── .env              # Environment variables
├── index.js          # Application entry point
├── init-db.js        # Database initialization script
└── package.json      # Project dependencies
```

### Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reloading
- `npm run init-db`: Initialize the database with schema and sample data
- `npm run build-css`: Build the Tailwind CSS file
- `npm run watch-css`: Watch for changes and rebuild CSS

## License

This project is licensed under the ISC License. 