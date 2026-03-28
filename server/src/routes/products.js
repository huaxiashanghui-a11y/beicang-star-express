const express = require('express');
const router = express.Router();
const { productsDB, categoriesDB } = require('../db');

// 获取商品列表
router.get('/', (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    let products = [...productsDB.data];

    // 分类筛选
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // 搜索
    if (search) {
      const keyword = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // 排序
    switch (sort) {
      case 'sales':
        products.sort((a, b) => b.sales - a.sales);
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 默认排序
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 分页
    const total = products.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    products = products.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取热门商品
router.get('/hot', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = productsDB.data
      .filter(p => p.isHot)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取新品
router.get('/new', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = productsDB.data
      .filter(p => p.isNew)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取推荐商品
router.get('/recommend', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    // 模拟推荐算法：综合评分和销量
    const products = [...productsDB.data]
      .map(p => ({
        ...p,
        score: p.rating * 0.3 + (p.sales / 1000) * 0.3 + (p.reviewCount / 1000) * 0.2 + (p.isHot ? 0.1 : 0) + (p.isNew ? 0.1 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取商品详情
router.get('/:id', (req, res) => {
  try {
    const product = productsDB.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取分类
router.get('/categories', (req, res) => {
  try {
    const categories = categoriesDB.data;
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
