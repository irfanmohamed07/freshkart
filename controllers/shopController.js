const Shop = require('../models/shop');
const Product = require('../models/product');

/**
 * Shop controller
 */
const shopController = {
  /**
   * Get all shops
   */
  getAllShops: async (req, res) => {
    try {
      // Calculate pagination
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      
      // Get shops with pagination
      const shops = await Shop.findAll(limit, offset);
      const totalShops = await Shop.getCount();
      const totalPages = Math.ceil(totalShops / limit);
      
      res.render('shops/index', {
        title: 'All Shops',
        shops,
        pagination: {
          page,
          limit,
          totalShops,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error fetching shops:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load shops. Please try again later.'
      });
    }
  },
  
  /**
   * Get a single shop by ID with its products
   */
  getShopById: async (req, res) => {
    try {
      const shopId = req.params.id;
      
      // Get shop details
      const shop = await Shop.findById(shopId);
      
      if (!shop) {
        return res.status(404).render('404', {
          title: 'Shop Not Found'
        });
      }
      
      // Calculate pagination for products
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      
      // Get products for this shop with pagination
      const products = await Product.findByShopId(shopId, limit, offset);
      const totalProducts = await Product.getCountByShopId(shopId);
      const totalPages = Math.ceil(totalProducts / limit);
      
      res.render('shops/show', {
        title: shop.name,
        shop,
        products,
        pagination: {
          page,
          limit,
          totalProducts,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error fetching shop details:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load shop details. Please try again later.'
      });
    }
  },
  
  /**
   * Get a single product by ID
   */
  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Get product details
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).render('404', {
          title: 'Product Not Found'
        });
      }
      
      // Find similar products from other shops
      const similarProducts = await Product.findSimilarProducts(product.name);
      
      // Filter out the current product from similar products
      const otherShopProducts = similarProducts.filter(p => p.id !== product.id);
      
      res.render('products/show', {
        title: product.name,
        product,
        otherShopProducts
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load product details. Please try again later.'
      });
    }
  }
};

module.exports = shopController; 