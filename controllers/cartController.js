const Cart = require('../models/cart');
const Product = require('../models/product');
const Shop = require('../models/shop');
const mlService = require('../utils/mlService');

/**
 * Cart controller
 */
const CartController = {
  /**
   * View cart
   */
  viewCart: async (req, res) => {
    try {
      const userId = req.session.userId;
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      
      // Get price comparisons for each item
      const cartItemsWithComparisons = await Promise.all(
        cartItems.map(async (item) => {
          // Find similar products from other shops
          const similarProducts = await Product.findSimilarProducts(item.product_name);
          
          // Filter out the current product and organize by shop
          const otherShopProducts = similarProducts
            .filter(p => p.id !== item.product_id)
            .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          
          // Find cheapest alternative if any
          const cheapestAlternative = otherShopProducts.length > 0 ? otherShopProducts[0] : null;
          
          // Calculate potential savings
          const potentialSavings = cheapestAlternative && parseFloat(cheapestAlternative.price) < parseFloat(item.price) 
            ? (parseFloat(item.price) - parseFloat(cheapestAlternative.price)) * item.quantity 
            : 0;
          
          return {
            ...item,
            alternatives: otherShopProducts,
            cheapestAlternative,
            potentialSavings
          };
        })
      );
      
      // Calculate total potential savings
      const totalPotentialSavings = cartItemsWithComparisons.reduce(
        (total, item) => total + item.potentialSavings, 
        0
      );
      
      // Get ML recommendations
      let mlComplementaryItems = [];
      let mlBestDeals = [];
      
      try {
        const cartProductIds = cartItems.map(item => item.product_id);
        mlComplementaryItems = await mlService.getComplementaryItems(cartProductIds, 5);
        mlBestDeals = await mlService.getBestDeals(cartProductIds, 3);
      } catch (error) {
        console.error('Error fetching ML cart recommendations:', error);
        // Continue without ML recommendations if they fail
      }
      
      res.render('cart/index', {
        title: 'Your Cart',
        cartItems: cartItemsWithComparisons,
        cartTotal,
        totalPotentialSavings,
        mlComplementaryItems: mlComplementaryItems.length > 0 ? mlComplementaryItems : null,
        mlBestDeals: mlBestDeals.length > 0 ? mlBestDeals : null
      });
    } catch (error) {
      console.error('Error in CartController.viewCart:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load cart'
      });
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (req, res) => {
    try {
      console.log('Cart addition request received:', req.body);
      
      // Check if the request is AJAX and parse the body accordingly
      const isAjax = req.xhr || (req.headers && req.headers['x-requested-with'] === 'XMLHttpRequest');
      
      // Get the product_id, shop_id, quantity from the request
      const { product_id, shop_id, quantity = 1 } = req.body;
      
      // Check required fields
      if (!product_id || !shop_id) {
        console.error('Missing required fields:', { product_id, shop_id });
        
        if (isAjax) {
          return res.status(400).json({ success: false, message: 'Product and shop are required' });
        } else {
          return res.status(400).render('error', { title: 'Error', message: 'Product and shop are required' });
        }
      }
      
      const user_id = req.session.userId;
      if (!user_id) {
        console.error('User not logged in');
        
        if (isAjax) {
          return res.status(401).json({ success: false, message: 'Please log in to add items to cart' });
        } else {
          return res.redirect('/login');
        }
      }

      // Add to cart - ensure ID parsing
      const result = await Cart.addItem({
        user_id: parseInt(user_id),
        product_id: parseInt(product_id),
        shop_id: parseInt(shop_id),
        quantity: parseInt(quantity)
      });
      
      console.log('Item added to cart:', result);

      // Get price comparison information
      let priceComparisonData = null;
      
      try {
        // Find similar products from other shops
        const similarProducts = await Product.findSimilarProducts(result.product_name);
        
        // Filter out the current product
        const otherShopProducts = similarProducts
          .filter(p => p.id !== result.product_id || p.shop_id !== result.shop_id)
          .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        
        // Find cheapest alternative if any
        const cheapestAlternative = otherShopProducts.length > 0 ? otherShopProducts[0] : null;
        
        // Calculate potential savings
        const potentialSavings = cheapestAlternative && parseFloat(cheapestAlternative.price) < parseFloat(result.price) 
          ? (parseFloat(result.price) - parseFloat(cheapestAlternative.price)) * result.quantity 
          : 0;
        
        priceComparisonData = {
          alternatives: otherShopProducts,
          cheapestAlternative,
          potentialSavings
        };
      } catch (error) {
        console.error('Error getting price comparison data:', error);
        // Continue without price comparison data
      }

      // Respond based on request type
      if (isAjax) {
        return res.json({ 
          success: true, 
          message: 'Product added to cart',
          item: result,
          priceComparison: priceComparisonData
        });
      } else {
        return res.redirect('/cart');
      }
    } catch (error) {
      console.error('Error in CartController.addToCart:', error);
      
      if (req.xhr || (req.headers && req.headers['x-requested-with'] === 'XMLHttpRequest')) {
        return res.status(500).json({ success: false, message: 'Failed to add to cart: ' + error.message });
      } else {
        res.status(500).render('error', {
          title: 'Error',
          message: 'Failed to add to cart: ' + error.message
        });
      }
    }
  },

  /**
   * Update cart item quantity
   */
  updateQuantity: async (req, res) => {
    try {
      const { item_id, quantity } = req.body;
      
      // Validate inputs
      if (!item_id || !quantity) {
        return res.status(400).json({ success: false, message: 'Item ID and quantity are required' });
      }

      // Update quantity
      await Cart.updateQuantity(item_id, parseInt(quantity));
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Error in CartController.updateQuantity:', error);
      return res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
  },

  /**
   * Update cart item shop
   */
  updateShop: async (req, res) => {
    try {
      const { item_id, shop_id } = req.body;
      
      // Validate inputs
      if (!item_id || !shop_id) {
        return res.status(400).json({ success: false, message: 'Item ID and shop ID are required' });
      }

      // Update shop
      await Cart.updateShop(item_id, parseInt(shop_id));
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Error in CartController.updateShop:', error);
      return res.status(500).json({ success: false, message: 'Failed to update shop' });
    }
  },

  /**
   * Remove item from cart
   */
  removeItem: async (req, res) => {
    try {
      const { item_id } = req.body;
      
      // Validate inputs
      if (!item_id) {
        return res.status(400).json({ success: false, message: 'Item ID is required' });
      }

      // Remove item
      await Cart.removeItem(item_id);
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Error in CartController.removeItem:', error);
      return res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
  },

  /**
   * Clear cart
   */
  clearCart: async (req, res) => {
    try {
      const userId = req.session.userId;
      await Cart.clearCart(userId);
      
      if (req.xhr) {
        return res.json({ success: true });
      } else {
        return res.redirect('/cart');
      }
    } catch (error) {
      console.error('Error in CartController.clearCart:', error);
      if (req.xhr) {
        return res.status(500).json({ success: false, message: 'Failed to clear cart' });
      } else {
        res.status(500).render('error', {
          title: 'Error',
          message: 'Failed to clear cart'
        });
      }
    }
  }
};

module.exports = CartController; 