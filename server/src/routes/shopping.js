const express = require('express');
const router = express.Router();
const ShoppingOrder = require('../models/shoppingOrders');

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

// Get service info
router.get('/info', (req, res) => {
  const info = {
    serviceFee: 0.05, // 5% service fee
    minBudget: 10,
    maxBudget: 50000,
    categories: [
      { id: 'food', name: '美食外卖', icon: '🍔' },
      { id: 'shopping', name: '商超购物', icon: '🛒' },
      { id: 'medicine', name: '药品代买', icon: '💊' },
      { id: 'document', name: '文件打印', icon: '📄' },
      { id: 'other', name: '其他代购', icon: '📦' }
    ]
  };
  res.json({ success: true, data: info });
});

// Create shopping order
router.post('/create', requireAuth, (req, res) => {
  try {
    const { description, budget, items, category } = req.body;

    if (!description && (!items || items.length === 0)) {
      return res.status(400).json({ error: '请填写代购需求' });
    }

    if (!budget || budget < 10) {
      return res.status(400).json({ error: '预算至少10元' });
    }

    const serviceFee = Math.round(budget * 0.05 * 100) / 100; // 5% fee

    const order = ShoppingOrder.create({
      userId: req.user.id,
      username: req.user.username,
      description,
      budget: parseFloat(budget),
      items: items || [],
      category,
      serviceFee,
      totalAmount: parseFloat(budget) + serviceFee
    });

    res.json({ success: true, message: '代购订单已创建', order });
  } catch (error) {
    console.error('Create shopping order error:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

// Get user's shopping orders
router.get('/orders', requireAuth, (req, res) => {
  try {
    const orders = ShoppingOrder.findByUser(req.user.id);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get shopping orders error:', error);
    res.status(500).json({ error: '获取订单失败' });
  }
});

// Get order detail
router.get('/:orderId', requireAuth, (req, res) => {
  try {
    const order = ShoppingOrder.findById(req.params.orderId);
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
    const order = ShoppingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: '无权操作' });
    if (order.status !== 'pending') return res.status(400).json({ error: '只能取消待处理订单' });

    const updated = ShoppingOrder.update(order.id, { status: 'cancelled' });
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
    let orders = ShoppingOrder.findAll();

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

// Admin: Process order
router.post('/admin/:orderId/process', requireAdmin, (req, res) => {
  try {
    const { adminNote } = req.body;
    const order = ShoppingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });

    const updated = ShoppingOrder.update(order.id, {
      status: 'processing',
      adminNote
    });
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: '处理订单失败' });
  }
});

// Admin: Complete order
router.post('/admin/:orderId/complete', requireAdmin, (req, res) => {
  try {
    const { adminNote } = req.body;
    const order = ShoppingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });

    const updated = ShoppingOrder.update(order.id, {
      status: 'completed',
      adminNote,
      completedAt: new Date().toISOString()
    });
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: '完成订单失败' });
  }
});

// Admin: Reject order
router.post('/admin/:orderId/reject', requireAdmin, (req, res) => {
  try {
    const { adminNote } = req.body;
    const order = ShoppingOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: '订单不存在' });

    const updated = ShoppingOrder.update(order.id, {
      status: 'cancelled',
      adminNote
    });
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: '拒绝订单失败' });
  }
});

module.exports = router;
