const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');

// Import models
const Cart = require('./models/cart');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'grocery-app-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    name: req.session.name,
    email: req.session.email,
    isAdmin: req.session.isAdmin || false
  } : null;
  next();
});

// Add cart count to all pages for logged-in users
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const cartItems = await Cart.getCartItems(req.session.userId);
      res.locals.cartCount = cartItems.length;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      res.locals.cartCount = 0;
    }
  }
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', protectedRoutes);
app.use('/shops', shopRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);

// Root route
app.get('/', (req, res) => {
  res.render('home', { title: 'Welcome to Grocery App' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 