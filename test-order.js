const Order = require('./models/order');

async function testOrderRetrieval() {
  try {
    // Test retrieval of order 1
    console.log('Attempting to retrieve order #1...');
    const order1 = await Order.getOrderById(1);
    console.log('Order #1 found:', order1 ? 'Yes' : 'No');
    if (order1) {
      console.log('Order #1 items count:', order1.items ? order1.items.length : 0);
      console.log('Order #1 tracking count:', order1.tracking ? order1.tracking.length : 0);
    }
    
    // Test retrieval of order 2
    console.log('\nAttempting to retrieve order #2...');
    const order2 = await Order.getOrderById(2);
    console.log('Order #2 found:', order2 ? 'Yes' : 'No');
    if (order2) {
      console.log('Order #2 items count:', order2.items ? order2.items.length : 0);
      console.log('Order #2 tracking count:', order2.tracking ? order2.tracking.length : 0);
    }
    
    // Test retrieval of non-existent order
    console.log('\nAttempting to retrieve non-existent order #999...');
    const orderNonExistent = await Order.getOrderById(999);
    console.log('Non-existent order found:', orderNonExistent ? 'Yes' : 'No');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testOrderRetrieval(); 