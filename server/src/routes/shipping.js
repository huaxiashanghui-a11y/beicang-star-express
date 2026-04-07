const express = require('express');
const router = express.Router();
const ShippingOrder = require('../models/shippingOrders');

// Middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '请先登录' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beicang-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '登录已过期' });
  }
};

// Get shipping services info
router.get('/info', (req, res) => {
  const info = {
    services: [
      { id: 'domestic', name: '国内快递', description: '国内包裹运输', baseFee: 12, perKg: 2 },
      { id: 'international', name: '国际快递', description: '跨境包裹运输', baseFee: 88, perKg: 25 },
      { id: 'express', name: '当日达', description: '同城极速配送', baseFee: 28, perKg: 0 }
    ],
    countries: ['中国', '缅甸', '泰国', '新加坡', '马来西亚']
  };
  res.json({ success: true, data: info });
});

// Calculate shipping fee
router.post('/calculate', requireAuth, (req, res) => {
  try {
    const { type, weight, distance } = req.body;

    let baseFee = 12;
    let perKg = 2;

    if (type === 'international') { baseFee = 88; perKg = 25; }
    if (type === 'express') { baseFee = 28; perKg = 0; }

    const shippingFee = baseFee + (weight || 1) * perKg;
    const serviceFee = Math.round(shippingFee * 0.03 * 100) / 100;
    const totalFee = shippingFee + serviceFee;

    res.json({
      success: true,
      data: {
        shippingFee,
        serviceFee,
        totalFee,
        estimatedDays: type === 'express' ? 1 : type === 'domestic' ? 3 : 7
      }
    });
  } catch (error) {
    res.status(500).json({ error: '计算运费失败' });
  }
});

// Create shipping order
router.post('/create', requireAuth, (req, res) => {
  try {
    const { type, sender, receiver, package: pkg, weight } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({ error: '请填写收发货信息' });
    }

    let baseFee = 12;
    let perKg = 2;
    let estimatedDays = 3;

    if (type === 'international') { baseFee = 88; perKg = 25; estimatedDays = 7; }
    if (type === 'express') { baseFee = 28; perKg = 0; estimatedDays = 1; }

    const shippingFee = baseFee + (weight || 1) * perKg;
    const serviceFee = Math.round(shippingFee * 0.03 * 100) / 100;

    const order = ShippingOrder.create({
      userId: req.user.id,
      username: req.user.username,
      type: type || 'domestic',
      sender,
      receiver,
      package: pkg,
      estimatedDays,
      shippingFee,
      serviceFee,
      totalAmount: shippingFee + serviceFee
    });

    res.json({ success: true, message: '物流订单已创建', order });
  } catch (error) {
    console.error('Create shipping order error:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

// Get user's shipping orders
router.get('/orders', requireAuth, (req, res) => {
  try {
    const orders = ShippingOrder.findByUser(req.user.id);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: '获取订单失败' });
  }
});

// Get order detail
router.get('/:orderId', requireAuth, (req, res) => {
  try {
    const order = ShippingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: '无权查看' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: '获取订单失败' });
  }
});

// Cancel order
router.post('/:orderId/cancel', requireAuth, (req, res) => {
  try {
    const order = ShippingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: '无权操作' });
    if (order.status !== 'pending') return res.status(400).json({ error: '只能取消待处理订单' });

    const updated = ShippingOrder.update(order.id, { status: 'cancelled' });
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: '取消订单失败' });
  }
});

// ============ Admin Routes ============
const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '请先登录' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beicang-secret-key');
    if (decoded.role !== 'admin') return res.status(403).json({ error: '需要管理员权限' });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '登录已过期' });
  }
};

// Admin: Get all orders
router.get('/admin/orders', requireAdmin, (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let orders = ShippingOrder.findAll();

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * limit;
    const paginatedOrders = orders.slice(start, start + parseInt(limit));

    res.json({
      orders: paginatedOrders,
      total: orders.length,
      page: parseInt(page),
      totalPages: Math.ceil(orders.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: '获取订单失败' });
  }
});

// Admin: Update status
router.post('/admin/:orderId/status', requireAdmin, (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const order = ShippingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });

    const updates = { status, adminNote };
    if (status === 'picked_up') updates.pickedUpAt = new Date().toISOString();
    if (status === 'delivered') updates.deliveredAt = new Date().toISOString();

    const updated = ShippingOrder.update(order.id, updates);
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: '更新状态失败' });
  }
});

module.exports = router;
