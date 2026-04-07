const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ordersDB, notificationsDB } = require('../db');
const { authMiddleware } = require('./auth');

// 支付方式
const paymentMethods = [
  { id: 'kbz', name: 'KBZ Pay', description: '缅甸KBZ银行支付', icon: '💳' },
  { id: 'wave', name: 'Wave Pay', description: '缅甸Wave移动支付', icon: '📱' },
  { id: 'visa', name: 'Visa', description: '国际信用卡支付', icon: '💳' },
  { id: 'mastercard', name: 'Mastercard', description: '万事达卡支付', icon: '💳' },
  { id: 'paypal', name: 'PayPal', description: '国际在线支付', icon: '🌐' }
];

// 获取支付方式
router.get('/methods', (req, res) => {
  res.json({
    success: true,
    data: paymentMethods
  });
});

// 创建支付
router.post('/create', authMiddleware, (req, res) => {
  try {
    const { orderId, method } = req.body;

    const order = ordersDB.findById(orderId);
    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '订单状态不正确' }
      });
    }

    // 模拟支付链接（实际项目中应该调用第三方支付API）
    const payment = {
      id: `pay-${uuidv4()}`,
      orderId,
      method,
      amount: order.totalAmount,
      status: 'pending',
      paymentUrl: `https://payment.example.com/pay/${uuidv4()}`,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 支付回调
router.post('/callback', (req, res) => {
  try {
    const { orderId, status, transactionId } = req.body;

    const order = ordersDB.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    if (status === 'success') {
      // 更新订单状态
      ordersDB.update(orderId, {
        status: 'paid',
        paymentStatus: 'paid',
        paymentTransactionId: transactionId,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 发送通知
      notificationsDB.create({
        id: `notif-${uuidv4()}`,
        userId: order.userId,
        type: 'order',
        title: '支付成功',
        content: `您的订单 ${order.orderNumber} 已支付成功`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.json({ success: true, message: '支付成功' });
    } else {
      res.json({ success: false, message: '支付失败' });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 查询支付状态
router.get('/:orderId', authMiddleware, (req, res) => {
  try {
    const order = ordersDB.findById(req.params.orderId);

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.paymentStatus,
        amount: order.totalAmount
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
