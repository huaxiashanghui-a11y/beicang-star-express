const express = require('express');
const router = express.Router();
const RechargeOrder = require('../models/rechargeOrders');
const User = require('../models/user');

// Middleware to check auth
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beicang-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '登录已过期' });
  }
};

// Get supported currencies for recharge
router.get('/currencies', (req, res) => {
  const currencies = [
    { code: 'CNY', name: '人民币', symbol: '¥', icon: '🇨🇳' },
    { code: 'MMK', name: '缅币', symbol: 'K', icon: '🇲🇲' },
    { code: 'USD', name: '美元', symbol: '$', icon: '🇺🇸' },
    { code: 'THB', name: '泰铢', symbol: '฿', icon: '🇹🇭' },
    { code: 'SGD', name: '新加坡元', symbol: 'S$', icon: '🇸🇬' },
  ];
  res.json({ currencies });
});

// Get payment methods
router.get('/payment-methods', requireAuth, (req, res) => {
  const paymentMethods = [
    { id: 'bank_transfer', name: '银行卡转账', description: '转账到指定银行账户' },
    { id: 'alipay', name: '支付宝', description: '支付宝转账' },
    { id: 'wechat', name: '微信支付', description: '微信转账' },
    { id: 'kbz', name: 'KBZ银行', description: '缅甸KBZ银行转账' },
    { id: 'aya', name: 'AYA银行', description: '缅甸AYA银行转账' },
    { id: 'cbb', name: 'CBB银行', description: '缅甸CBB银行转账' },
  ];
  res.json({ paymentMethods });
});

// Create recharge order
router.post('/create', requireAuth, (req, res) => {
  try {
    const { amount, currency, paymentMethod, paymentAccount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '请输入有效的充值金额' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: '请选择支付方式' });
    }

    const order = RechargeOrder.create({
      userId: req.user.id,
      username: req.user.username,
      amount: parseFloat(amount),
      currency: currency || 'CNY',
      paymentMethod,
      paymentAccount: paymentAccount || ''
    });

    res.json({
      success: true,
      message: '充值订单已创建，等待管理员审核',
      order
    });
  } catch (error) {
    console.error('Create recharge order error:', error);
    res.status(500).json({ error: '创建充值订单失败' });
  }
});

// Get user's recharge orders
router.get('/orders', requireAuth, (req, res) => {
  try {
    const orders = RechargeOrder.findByUser(req.user.id);
    res.json({ orders });
  } catch (error) {
    console.error('Get recharge orders error:', error);
    res.status(500).json({ error: '获取充值记录失败' });
  }
});

// Cancel recharge order
router.post('/cancel/:orderId', requireAuth, (req, res) => {
  try {
    const order = RechargeOrder.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此订单' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: '只能取消待处理的订单' });
    }

    const updated = RechargeOrder.update(order.id, { status: 'cancelled' });
    res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Cancel recharge order error:', error);
    res.status(500).json({ error: '取消订单失败' });
  }
});

// ============ Admin Routes ============
const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beicang-secret-key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: '需要管理员权限' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '登录已过期' });
  }
};

// Admin: Get all recharge orders
router.get('/admin/orders', requireAdmin, (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let orders = RechargeOrder.findAll();

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    // Sort by date
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const start = (page - 1) * limit;
    const paginatedOrders = orders.slice(start, start + parseInt(limit));

    res.json({
      orders: paginatedOrders,
      total: orders.length,
      page: parseInt(page),
      totalPages: Math.ceil(orders.length / limit)
    });
  } catch (error) {
    console.error('Admin get recharge orders error:', error);
    res.status(500).json({ error: '获取充值订单失败' });
  }
});

// Admin: Approve recharge order
router.post('/admin/approve/:orderId', requireAdmin, (req, res) => {
  try {
    const { adminNote } = req.body;
    const order = RechargeOrder.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: '只能处理待处理的订单' });
    }

    // Update user balance
    const user = User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // Add balance based on currency
    const currentBalance = user.balance || {};
    currentBalance[order.currency] = (currentBalance[order.currency] || 0) + order.amount;
    User.update(order.userId, { balance: currentBalance });

    // Update order status
    const updated = RechargeOrder.update(order.id, {
      status: 'approved',
      adminNote: adminNote || '充值成功',
      processedBy: req.user.id
    });

    res.json({
      success: true,
      message: '充值审核通过，余额已添加',
      order: updated
    });
  } catch (error) {
    console.error('Admin approve recharge error:', error);
    res.status(500).json({ error: '审核充值失败' });
  }
});

// Admin: Reject recharge order
router.post('/admin/reject/:orderId', requireAdmin, (req, res) => {
  try {
    const { adminNote } = req.body;
    const order = RechargeOrder.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: '只能处理待处理的订单' });
    }

    const updated = RechargeOrder.update(order.id, {
      status: 'rejected',
      adminNote: adminNote || '充值申请被拒绝',
      processedBy: req.user.id
    });

    res.json({
      success: true,
      message: '充值申请已拒绝',
      order: updated
    });
  } catch (error) {
    console.error('Admin reject recharge error:', error);
    res.status(500).json({ error: '拒绝充值失败' });
  }
});

module.exports = router;
