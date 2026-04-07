const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/rechargeOrders.json');

// Helper to read data
const readData = () => {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify({ orders: [] }, null, 2));
    }
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading recharge orders:', error);
    return { orders: [] };
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing recharge orders:', error);
    return false;
  }
};

const RechargeOrder = {
  // Create new recharge order
  create: (orderData) => {
    const data = readData();
    const order = {
      id: `RC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      userId: orderData.userId,
      username: orderData.username,
      amount: orderData.amount,
      currency: orderData.currency || 'CNY',
      paymentMethod: orderData.paymentMethod,
      paymentAccount: orderData.paymentAccount || '',
      status: 'pending', // pending, approved, rejected
      adminNote: '',
      createdAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null
    };
    data.orders.unshift(order);
    writeData(data);
    return order;
  },

  // Update recharge order
  update: (orderId, updates) => {
    const data = readData();
    const index = data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    data.orders[index] = {
      ...data.orders[index],
      ...updates,
      processedAt: updates.status !== 'pending' ? new Date().toISOString() : null
    };
    writeData(data);
    return data.orders[index];
  },

  // Find by user ID
  findByUser: (userId) => {
    const data = readData();
    return data.orders.filter(o => o.userId === userId);
  },

  // Find by ID
  findById: (orderId) => {
    const data = readData();
    return data.orders.find(o => o.id === orderId);
  },

  // Find all (admin)
  findAll: () => {
    const data = readData();
    return data.orders;
  },

  // Delete order
  delete: (orderId) => {
    const data = readData();
    const index = data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return false;
    data.orders.splice(index, 1);
    writeData(data);
    return true;
  }
};

module.exports = RechargeOrder;
