const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { cartDB, productsDB } = require('../db');
const { authMiddleware } = require('./auth');

// 获取购物车
router.get('/', authMiddleware, (req, res) => {
  try {
    const cartItems = cartDB.find({ userId: req.userId });
    
    // 获取商品详情
    const items = cartItems.map(item => {
      const product = productsDB.findById(item.productId);
      return {
        ...item,
        product
      };
    }).filter(item => item.product);

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 添加到购物车
router.post('/', authMiddleware, (req, res) => {
  try {
    const { productId, quantity = 1, specifications = {} } = req.body;

    // 检查商品是否存在
    const product = productsDB.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: { code: 'INSUFFICIENT_STOCK', message: '库存不足' }
      });
    }

    // 检查是否已在购物车
    const existingItem = cartDB.findOne({ 
      userId: req.userId, 
      productId,
      specifications: JSON.stringify(specifications)
    });

    if (existingItem) {
      // 更新数量
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: '库存不足' }
        });
      }
      cartDB.update(existingItem.id, { quantity: newQuantity });
    } else {
      // 添加新商品
      cartDB.create({
        id: `cart-${uuidv4()}`,
        userId: req.userId,
        productId,
        quantity,
        specifications,
        selected: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // 返回更新后的购物车
    const cartItems = cartDB.find({ userId: req.userId });
    const items = cartItems.map(item => ({
      ...item,
      product: productsDB.findById(item.productId)
    })).filter(item => item.product);

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新购物车商品数量
router.put('/:itemId', authMiddleware, (req, res) => {
  try {
    const { quantity } = req.body;
    const item = cartDB.findById(req.params.itemId);

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '购物车商品不存在' }
      });
    }

    const product = productsDB.findById(item.productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: { code: 'INSUFFICIENT_STOCK', message: '库存不足' }
      });
    }

    cartDB.update(req.params.itemId, { quantity });

    const cartItems = cartDB.find({ userId: req.userId });
    const items = cartItems.map(item => ({
      ...item,
      product: productsDB.findById(item.productId)
    })).filter(item => item.product);

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除购物车商品
router.delete('/:itemId', authMiddleware, (req, res) => {
  try {
    const item = cartDB.findById(req.params.itemId);

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '购物车商品不存在' }
      });
    }

    cartDB.delete(req.params.itemId);

    const cartItems = cartDB.find({ userId: req.userId });
    const items = cartItems.map(item => ({
      ...item,
      product: productsDB.findById(item.productId)
    })).filter(item => item.product);

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 清空购物车
router.delete('/', authMiddleware, (req, res) => {
  try {
    const cartItems = cartDB.find({ userId: req.userId });
    cartItems.forEach(item => cartDB.delete(item.id));

    res.json({
      success: true,
      data: []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 选择/取消选择商品
router.put('/:itemId/select', authMiddleware, (req, res) => {
  try {
    const { selected } = req.body;
    const item = cartDB.findById(req.params.itemId);

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '购物车商品不存在' }
      });
    }

    cartDB.update(req.params.itemId, { selected });

    res.json({
      success: true,
      data: { selected }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 全选/取消全选
router.put('/select-all', authMiddleware, (req, res) => {
  try {
    const { selected } = req.body;
    const cartItems = cartDB.find({ userId: req.userId });
    
    cartItems.forEach(item => {
      cartDB.update(item.id, { selected });
    });

    res.json({
      success: true,
      data: { selected }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
