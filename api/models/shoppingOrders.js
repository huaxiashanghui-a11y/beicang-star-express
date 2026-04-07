const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/shoppingOrders.json');

const readData = () => {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify({ orders: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch (error) {
    console.error('Error reading shopping orders:', error);
    return { orders: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing shopping orders:', error);
    return false;
  }
};

const ShoppingOrder = {
  create: (orderData) => {
    const data = readData();
    const order = {
      id: `SG${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      userId: orderData.userId,
      username: orderData.username,
      items: orderData.items || [],
      description: orderData.description || '',
      budget: orderData.budget,
      status: 'pending', // pending, processing, completed, cancelled
      totalAmount: orderData.totalAmount || 0,
      serviceFee: orderData.serviceFee || 0,
      createdAt: new Date().toISOString(),
      processedAt: null,
      completedAt: null,
      notes: '',
      adminNote: ''
    };
    data.orders.unshift(order);
    writeData(data);
    return order;
  },

  update: (orderId, updates) => {
    const data = readData();
    const index = data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    data.orders[index] = { ...data.orders[index], ...updates };
    writeData(data);
    return data.orders[index];
  },

  findByUser: (userId) => {
    return readData().orders.filter(o => o.userId === userId);
  },

  findById: (orderId) => {
    return readData().orders.find(o => o.id === orderId);
  },

  findAll: () => {
    return readData().orders;
  },

  delete: (orderId) => {
    const data = readData();
    const index = data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return false;
    data.orders.splice(index, 1);
    writeData(data);
    return true;
  }
};

module.exports = ShoppingOrder;
