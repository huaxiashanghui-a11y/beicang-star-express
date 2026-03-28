const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ordersDB, cartDB, productsDB, addressesDB, notificationsDB } = require('../db');
const { authMiddleware } = require('./auth');

// 获取订单列表
router.get('/', authMiddleware, (req, res) => {
  try {
    const { status } = req.query;
    let orders = ordersDB.find({ userId: req.userId });

    // 状态筛选
    if (status) {
      if (status === 'pending') {
        orders = orders.filter(o => ['pending', 'paid', 'processing'].includes(o.status));
      } else if (status === 'shipped') {
        orders = orders.filter(o => ['shipped', 'delivered'].includes(o.status));
      } else if (status === 'completed') {
        orders = orders.filter(o => ['completed'].includes(o.status));
      }
    }

    // 按时间倒序
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取订单详情
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const order = ordersDB.findById(req.params.id);

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建订单
router.post('/', authMiddleware, (req, res) => {
  try {
    const { addressId, paymentMethod, items: orderItems } = req.body;

    // 获取收货地址
    const address = addressesDB.findById(addressId);
    if (!address || address.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '收货地址不存在' }
      });
    }

    let orderItemsList = [];
    let totalAmount = 0;
    let originalAmount = 0;

    if (orderItems && orderItems.length > 0) {
      // 直接从请求创建订单
      orderItems.forEach(item => {
        const product = productsDB.findById(item.productId);
        if (product) {
          const price = product.price;
          const origPrice = product.originalPrice;
          totalAmount += price * item.quantity;
          originalAmount += origPrice * item.quantity;
          orderItemsList.push({
            id: `item-${uuidv4()}`,
            productId: product.id,
            product,
            quantity: item.quantity,
            price,
            specifications: item.specifications || {}
          });
        }
      });
    } else {
      // 从购物车创建订单
      const cartItems = cartDB.find({ userId: req.userId, selected: true });
      
      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: '请选择商品' }
        });
      }

      cartItems.forEach(cartItem => {
        const product = productsDB.findById(cartItem.productId);
        if (product) {
          if (product.stock < cartItem.quantity) {
            return res.status(400).json({
              success: false,
              error: { code: 'INSUFFICIENT_STOCK', message: `${product.name}库存不足` }
            });
          }
          
          const price = product.price;
          const origPrice = product.originalPrice;
          totalAmount += price * cartItem.quantity;
          originalAmount += origPrice * cartItem.quantity;
          orderItemsList.push({
            id: `item-${uuidv4()}`,
            productId: product.id,
            product,
            quantity: cartItem.quantity,
            price,
            specifications: cartItem.specifications
          });

          // 更新商品销量和库存
          productsDB.update(product.id, {
            sales: product.sales + cartItem.quantity,
            stock: product.stock - cartItem.quantity
          });
        }
      });
    }

    if (orderItemsList.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '订单商品不能为空' }
      });
    }

    // 计算运费
    const shippingFee = totalAmount >= 100000 ? 0 : 5000;

    // 创建订单
    const order = {
      id: `order-${uuidv4()}`,
      orderNumber: `BC${Date.now()}`,
      userId: req.userId,
      items: orderItemsList,
      totalAmount: totalAmount + shippingFee,
      originalAmount: originalAmount + shippingFee,
      discount: originalAmount - totalAmount,
      shippingFee,
      status: 'pending',
      shippingAddress: address,
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: getEstimatedDelivery()
    };

    ordersDB.create(order);

    // 清空已选中的购物车商品
    if (!orderItems) {
      const cartItems = cartDB.find({ userId: req.userId, selected: true });
      cartItems.forEach(item => cartDB.delete(item.id));
    }

    // 发送通知
    notificationsDB.create({
      id: `notif-${uuidv4()}`,
      userId: req.userId,
      type: 'order',
      title: '订单创建成功',
      content: `您的订单 ${order.orderNumber} 已创建，请尽快完成支付`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 取消订单
router.put('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const order = ordersDB.findById(req.params.id);

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'ORDER_CANNOT_CANCEL', message: '当前状态无法取消订单' }
      });
    }

    // 恢复库存
    order.items.forEach(item => {
      const product = productsDB.findById(item.productId);
      if (product) {
        productsDB.update(product.id, {
          stock: product.stock + item.quantity,
          sales: Math.max(0, product.sales - item.quantity)
        });
      }
    });

    ordersDB.update(req.params.id, { 
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    });

    // 发送通知
    notificationsDB.create({
      id: `notif-${uuidv4()}`,
      userId: req.userId,
      type: 'order',
      title: '订单已取消',
      content: `您的订单 ${order.orderNumber} 已取消`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: ordersDB.findById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 确认收货
router.put('/:id/confirm', authMiddleware, (req, res) => {
  try {
    const order = ordersDB.findById(req.params.id);

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    if (!['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '当前状态无法确认收货' }
      });
    }

    ordersDB.update(req.params.id, { 
      status: 'completed',
      paymentStatus: 'paid',
      updatedAt: new Date().toISOString()
    });

    // 发送通知
    notificationsDB.create({
      id: `notif-${uuidv4()}`,
      userId: req.userId,
      type: 'order',
      title: '订单已完成',
      content: `感谢您的购买！订单 ${order.orderNumber} 已完成，欢迎评价`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: ordersDB.findById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 支付订单
router.post('/:id/pay', authMiddleware, (req, res) => {
  try {
    const { method } = req.body;
    const order = ordersDB.findById(req.params.id);

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '订单已支付或已取消' }
      });
    }

    // 模拟支付处理
    ordersDB.update(req.params.id, { 
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: method,
      updatedAt: new Date().toISOString()
    });

    // 发送通知
    notificationsDB.create({
      id: `notif-${uuidv4()}`,
      userId: req.userId,
      type: 'order',
      title: '支付成功',
      content: `您的订单 ${order.orderNumber} 已支付成功，商家正在准备发货`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: ordersDB.findById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 计算预计送达时间
function getEstimatedDelivery() {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + 7);
  return delivery.toISOString().split('T')[0];
}

module.exports = router;
