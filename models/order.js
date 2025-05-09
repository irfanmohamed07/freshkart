// Mock database for development
const mockDb = {
  // Sample orders data
  orders: [
    {
      id: 1,
      user_id: 1,
      total_amount: 1250.00,
      shipping_address: '123 Main St, Bangalore, Karnataka - 560001',
      phone: '9876543210',
      payment_status: 'paid',
      created_at: new Date('2023-05-01T10:30:00'),
      updated_at: new Date('2023-05-01T10:35:00'),
      user_name: 'John Doe',
      user_email: 'john@example.com',
      items: [
        {
          id: 1,
          product_id: 101,
          shop_id: 201,
          quantity: 2,
          price: 350.00,
          product_name: 'Organic Apples',
          shop_name: 'Fresh Fruits Market',
          image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'
        },
        {
          id: 2,
          product_id: 102,
          shop_id: 201,
          quantity: 1,
          price: 550.00,
          product_name: 'Premium Mangoes',
          shop_name: 'Fresh Fruits Market',
          image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'
        }
      ],
      tracking: [
        {
          id: 1,
          order_id: 1,
          status: 'confirmed',
          updated_at: new Date('2023-05-01T10:35:00')
        }
      ]
    },
    // Add a sample order for ID 2
    {
      id: 2,
      user_id: 1,
      total_amount: 850.00,
      shipping_address: '123 Main St, Bangalore, Karnataka - 560001',
      phone: '9876543210',
      payment_status: 'paid',
      created_at: new Date('2023-05-02T11:30:00'),
      updated_at: new Date('2023-05-02T11:35:00'),
      user_name: 'John Doe',
      user_email: 'john@example.com',
      items: [
        {
          id: 3,
          product_id: 103,
          shop_id: 202,
          quantity: 1,
          price: 450.00,
          product_name: 'Fresh Vegetables',
          shop_name: 'Veggie Market',
          image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'
        },
        {
          id: 4,
          product_id: 104,
          shop_id: 202,
          quantity: 2,
          price: 200.00,
          product_name: 'Milk',
          shop_name: 'Veggie Market',
          image_url: 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'
        }
      ],
      tracking: [
        {
          id: 2,
          order_id: 2,
          status: 'confirmed',
          updated_at: new Date('2023-05-02T11:35:00')
        }
      ]
    }
  ],
  
  // Sample order items data
  orderItems: [
    {
      id: 1,
      order_id: 1,
      product_id: 101,
      shop_id: 201,
      quantity: 2,
      price: 350.00
    },
    {
      id: 2,
      order_id: 1,
      product_id: 102,
      shop_id: 201,
      quantity: 1,
      price: 550.00
    },
    {
      id: 3,
      order_id: 2,
      product_id: 103,
      shop_id: 202,
      quantity: 1,
      price: 450.00
    },
    {
      id: 4,
      order_id: 2,
      product_id: 104,
      shop_id: 202,
      quantity: 2,
      price: 200.00
    }
  ],
  
  // Sample order tracking data
  orderTracking: [
    {
      id: 1,
      order_id: 1,
      status: 'confirmed',
      updated_at: new Date('2023-05-01T10:35:00')
    },
    {
      id: 2,
      order_id: 2,
      status: 'confirmed',
      updated_at: new Date('2023-05-02T11:35:00')
    }
  ],
  
  // Sample products data (for reference in order items)
  products: [
    {
      id: 101,
      shop_id: 201,
      name: 'Organic Apples',
      price: 350.00,
      image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500'
    },
    {
      id: 102,
      shop_id: 201,
      name: 'Premium Mangoes',
      price: 550.00,
      image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500'
    },
    {
      id: 103,
      shop_id: 202,
      name: 'Fresh Vegetables',
      price: 450.00,
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'
    },
    {
      id: 104,
      shop_id: 202,
      name: 'Milk',
      price: 200.00,
      image_url: 'https://images.unsplash.com/photo-1588710277537-126980e8d44e?w=500'
    }
  ],
  
  // Sample shops data
  shops: [
    {
      id: 201,
      name: 'Fresh Fruits Market',
      address: '123 Fruit St, Bangalore'
    },
    {
      id: 202,
      name: 'Veggie Market',
      address: '456 Veggie St, Bangalore'
    }
  ]
};

/**
 * Order model
 */
const Order = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Object} Created order
   */
  createOrder: async ({ user_id, items, total_amount, shipping_address, phone, payment_status }) => {
    // Create a new order
    const newOrder = {
      id: mockDb.orders.length + 1,
      user_id,
      total_amount,
      shipping_address,
      phone,
      payment_status,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockDb.orders.push(newOrder);
    
    // Add order items
    for (const item of items) {
      const orderItem = {
        id: mockDb.orderItems.length + 1,
        order_id: newOrder.id,
        product_id: item.product_id,
        shop_id: item.shop_id,
        quantity: item.quantity,
        price: item.price
      };
      
      mockDb.orderItems.push(orderItem);
    }
    
    // Add order tracking
    const tracking = {
      id: mockDb.orderTracking.length + 1,
      order_id: newOrder.id,
      status: 'pending',
      updated_at: new Date()
    };
    
    mockDb.orderTracking.push(tracking);
    
    return newOrder;
  },
  
  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Object} Order with items
   */
  getOrderById: async (orderId) => {
    // Find order
    const order = mockDb.orders.find(o => o.id == orderId);
    
    if (!order) {
      return null;
    }
    
    // Get tracking data
    const tracking = mockDb.orderTracking
      .filter(t => t.order_id == orderId)
      .sort((a, b) => b.updated_at - a.updated_at);
    
    // If order already has items array, use it, otherwise construct it
    let items = order.items || [];
    
    if (!items || items.length === 0) {
      // Get order items
      items = mockDb.orderItems
        .filter(item => item.order_id == orderId)
        .map(item => {
          // Find product details
          const product = mockDb.products.find(p => p.id === item.product_id);
          const shop = mockDb.shops.find(s => s.id === item.shop_id);
          
          return {
            ...item,
            product_name: product ? product.name : `Product ${item.product_id}`,
            shop_name: shop ? shop.name : `Shop ${item.shop_id}`,
            image_url: product ? product.image_url : `https://source.unsplash.com/random/300x200/?grocery`
          };
        });
    }
    
    return {
      ...order,
      items: items,
      tracking
    };
  },
  
  /**
   * Get orders by user ID
   * @param {number} userId - User ID
   * @returns {Array} User orders
   */
  getUserOrders: async (userId) => {
    // Find orders for user
    const orders = mockDb.orders
      .filter(o => o.user_id == userId)
      .map(order => {
        // Find current status
        const latestTracking = mockDb.orderTracking
          .filter(t => t.order_id === order.id)
          .sort((a, b) => b.updated_at - a.updated_at)[0];
        
        return {
          ...order,
          current_status: latestTracking ? latestTracking.status : 'pending'
        };
      })
      .sort((a, b) => b.created_at - a.created_at);
    
    return orders;
  },
  
  /**
   * Update order payment status
   * @param {number} orderId - Order ID
   * @param {string} status - Payment status ('pending', 'paid', 'failed')
   * @returns {Object} Updated order
   */
  updateOrderStatus: async (orderId, status) => {
    // Find order
    const orderIndex = mockDb.orders.findIndex(o => o.id == orderId);
    
    if (orderIndex === -1) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    // Update order status
    mockDb.orders[orderIndex].payment_status = status;
    mockDb.orders[orderIndex].updated_at = new Date();
    
    // Add tracking status
    const tracking = {
      id: mockDb.orderTracking.length + 1,
      order_id: orderId,
      status: status === 'paid' ? 'confirmed' : status,
      updated_at: new Date()
    };
    
    mockDb.orderTracking.push(tracking);
    
    return mockDb.orders[orderIndex];
  }
};

module.exports = Order; 