const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 导入数据库
const { usersDB, productsDB, categoriesDB, ordersDB, addressesDB, couponsDB, notificationsDB } = require('../db');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'beicang-star-express-secret-key-2024';

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '未授权，请先登录' }
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: '无效的认证令牌' }
    });
  }
};

// ==================== 管理员认证 ====================

// 管理员登录
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // 默认管理员账号
    const adminAccount = {
      id: 'admin-1',
      username: 'admin',
      password: '$2a$10$FDn590dXFhk7h84Tsn.CaOtecK4FJVlbRdPEfZpo.1HuPQBKjL.PS', // 123456
      name: '超级管理员',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
    };

    if (username !== adminAccount.username) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '用户名或密码错误' }
      });
    }

    // 验证密码
    const isValidPassword = bcrypt.compareSync(password, adminAccount.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '用户名或密码错误' }
      });
    }

    // 生成token
    const token = jwt.sign(
      { id: adminAccount.id, username: adminAccount.username, role: adminAccount.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: adminAccount.id,
          username: adminAccount.username,
          name: adminAccount.name,
          role: adminAccount.role,
          avatar: adminAccount.avatar
        }
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取当前管理员信息
router.get('/profile', authMiddleware, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 仪表盘统计 ====================

// 获取仪表盘数据
router.get('/stats/dashboard', authMiddleware, (req, res) => {
  try {
    const orders = ordersDB.data;
    const users = usersDB.data;
    const products = productsDB.data;
    const coupons = couponsDB.data;

    // 计算今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);

    // 计算销售额
    const todaySales = todayOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // 待处理订单
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');

    // 库存不足商品
    const lowStockProducts = products.filter(p => p.stock < 50);

    // 最近7天订单趋势
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        sales: dayOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0)
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          todayOrders: todayOrders.length,
          todaySales,
          totalUsers: users.length,
          pendingOrders: pendingOrders.length,
          totalProducts: products.length,
          activeCoupons: coupons.filter(c => c.status === 'active').length
        },
        recentOrders: orders.slice(-10).reverse(),
        lowStockProducts: lowStockProducts.slice(0, 5),
        last7Days
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 商品管理 ====================

// 获取商品列表
router.get('/products', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    let products = [...productsDB.data];

    // 搜索筛选
    if (search) {
      const keyword = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword)
      );
    }

    // 分类筛选
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // 状态下架筛选
    if (status === 'active') {
      products = products.filter(p => p.status !== 'inactive');
    } else if (status === 'inactive') {
      products = products.filter(p => p.status === 'inactive');
    }

    // 排序
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 分页
    const total = products.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
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

// 获取商品详情
router.get('/products/:id', authMiddleware, (req, res) => {
  try {
    const product = productsDB.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建商品
router.post('/products', authMiddleware, (req, res) => {
  try {
    const product = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      ...req.body,
      status: req.body.status || 'active',
      sales: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    productsDB.create(product);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新商品
router.put('/products/:id', authMiddleware, (req, res) => {
  try {
    const product = productsDB.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除商品
router.delete('/products/:id', authMiddleware, (req, res) => {
  try {
    const deleted = productsDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }
    res.json({ success: true, message: '商品已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 批量更新商品状态
router.put('/products/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const product = productsDB.update(req.params.id, {
      status,
      updatedAt: new Date().toISOString()
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '商品不存在' }
      });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 订单管理 ====================

// 获取订单列表
router.get('/orders', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, dateRange } = req.query;
    let orders = [...ordersDB.data];

    // 状态筛选
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // 搜索筛选
    if (search) {
      const keyword = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(keyword) ||
        o.userName?.toLowerCase().includes(keyword) ||
        o.userPhone?.includes(keyword)
      );
    }

    // 日期筛选
    if (dateRange) {
      const [start, end] = dateRange.split(',');
      orders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= new Date(start) && date <= new Date(end);
      });
    }

    // 排序
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 分页
    const total = orders.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedOrders = orders.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        orders: paginatedOrders,
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

// 获取订单详情
router.get('/orders/:id', authMiddleware, (req, res) => {
  try {
    const order = ordersDB.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新订单状态
router.put('/orders/:id/status', authMiddleware, (req, res) => {
  try {
    const { status, note } = req.body;
    const order = ordersDB.update(req.params.id, {
      status,
      statusNote: note,
      updatedAt: new Date().toISOString()
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }

    // 创建通知
    notificationsDB.create({
      id: `notif-${uuidv4().slice(0, 8)}`,
      userId: order.userId,
      type: 'order_update',
      title: '订单状态更新',
      content: `您的订单 ${order.orderNumber} 状态已更新为: ${status}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 订单退款
router.post('/orders/:id/refund', authMiddleware, (req, res) => {
  try {
    const { reason } = req.body;
    const order = ordersDB.update(req.params.id, {
      status: 'refunded',
      paymentStatus: 'refunded',
      refundReason: reason,
      refundAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '订单不存在' }
      });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 用户管理 ====================

// 获取用户列表
router.get('/users', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, search, dateRange } = req.query;
    let users = usersDB.data.map(u => {
      const userOrders = ordersDB.data.filter(o => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return {
        ...u,
        orderCount: userOrders.length,
        totalSpent
      };
    });

    // 搜索筛选
    if (search) {
      const keyword = search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(keyword) ||
        u.phone?.includes(keyword) ||
        u.email?.toLowerCase().includes(keyword)
      );
    }

    // 日期筛选
    if (dateRange) {
      const [start, end] = dateRange.split(',');
      users = users.filter(u => {
        const date = new Date(u.createdAt);
        return date >= new Date(start) && date <= new Date(end);
      });
    }

    // 排序
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 分页
    const total = users.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = users.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
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

// 获取用户详情
router.get('/users/:id', authMiddleware, (req, res) => {
  try {
    const user = usersDB.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }

    // 获取用户的订单和地址
    const userOrders = ordersDB.data.filter(o => o.userId === user.id);
    const userAddresses = addressesDB.data.filter(a => a.userId === user.id);

    res.json({
      success: true,
      data: {
        ...user,
        orders: userOrders,
        addresses: userAddresses,
        stats: {
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
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

// 更新用户
router.put('/users/:id', authMiddleware, (req, res) => {
  try {
    const user = usersDB.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 禁用/启用用户
router.put('/users/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const user = usersDB.update(req.params.id, {
      status,
      updatedAt: new Date().toISOString()
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 优惠券管理 ====================

// 获取优惠券列表
router.get('/coupons', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    let coupons = [...couponsDB.data];

    // 状态筛选
    if (status) {
      coupons = coupons.filter(c => c.status === status);
    }

    // 类型筛选
    if (type) {
      coupons = coupons.filter(c => c.type === type);
    }

    // 排序
    coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 分页
    const total = coupons.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedCoupons = coupons.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        coupons: paginatedCoupons,
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

// 创建优惠券
router.post('/coupons', authMiddleware, (req, res) => {
  try {
    const coupon = {
      id: `coupon-${uuidv4().slice(0, 8)}`,
      ...req.body,
      usedCount: 0,
      status: req.body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    couponsDB.create(coupon);
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新优惠券
router.put('/coupons/:id', authMiddleware, (req, res) => {
  try {
    const coupon = couponsDB.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '优惠券不存在' }
      });
    }
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除优惠券
router.delete('/coupons/:id', authMiddleware, (req, res) => {
  try {
    const deleted = couponsDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '优惠券不存在' }
      });
    }
    res.json({ success: true, message: '优惠券已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 分类管理 ====================

// 获取分类列表
router.get('/categories', authMiddleware, (req, res) => {
  try {
    const categories = categoriesDB.data;
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建分类
router.post('/categories', authMiddleware, (req, res) => {
  try {
    const category = {
      id: `cat-${uuidv4().slice(0, 8)}`,
      ...req.body,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    categoriesDB.create(category);
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新分类
router.put('/categories/:id', authMiddleware, (req, res) => {
  try {
    const category = categoriesDB.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '分类不存在' }
      });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除分类
router.delete('/categories/:id', authMiddleware, (req, res) => {
  try {
    const deleted = categoriesDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '分类不存在' }
      });
    }
    res.json({ success: true, message: '分类已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 公告管理 ====================

// 获取公告列表
router.get('/announcements', authMiddleware, (req, res) => {
  try {
    const announcements = notificationsDB.data
      .filter(n => n.type === 'system')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建公告
router.post('/announcements', authMiddleware, (req, res) => {
  try {
    const announcement = {
      id: `announce-${uuidv4().slice(0, 8)}`,
      ...req.body,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notificationsDB.create(announcement);
    res.json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 发布/取消发布公告
router.put('/announcements/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const announcement = notificationsDB.update(req.params.id, {
      status,
      updatedAt: new Date().toISOString()
    });
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '公告不存在' }
      });
    }
    res.json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除公告
router.delete('/announcements/:id', authMiddleware, (req, res) => {
  try {
    const deleted = notificationsDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '公告不存在' }
      });
    }
    res.json({ success: true, message: '公告已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 客服工单管理 ====================

// 获取客服工单列表
router.get('/tickets', authMiddleware, (req, res) => {
  try {
    const tickets = notificationsDB.data
      .filter(n => ['inquiry', 'complaint', 'refund'].includes(n.type))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 回复工单
router.post('/tickets/:id/reply', authMiddleware, (req, res) => {
  try {
    const { content } = req.body;
    const ticket = notificationsDB.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '工单不存在' }
      });
    }

    // 更新工单状态
    const updated = notificationsDB.update(req.params.id, {
      status: 'replied',
      replyContent: content,
      repliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 创建回复通知给用户
    notificationsDB.create({
      id: `notif-${uuidv4().slice(0, 8)}`,
      userId: ticket.userId,
      type: 'ticket_reply',
      title: '客服回复',
      content: content,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== Banner管理 ====================

// Banner存储 (内存中)
const bannersDB = {
  data: [
    {
      id: 'banner-1',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
      title: '春季新品大促',
      subtitle: '全场低至5折起',
      gradient: 'from-orange-500 to-red-500',
      link: '/search?tag=new',
      linkType: 'page',
      sort: 1,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'banner-2',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      title: '数码产品专场',
      subtitle: '苹果华为限时优惠',
      gradient: 'from-blue-500 to-purple-500',
      link: '/category/electronics',
      linkType: 'category',
      sort: 2,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};

// 获取Banner列表
router.get('/banners', authMiddleware, (req, res) => {
  try {
    res.json({ success: true, data: bannersDB.data });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建Banner
router.post('/banners', authMiddleware, (req, res) => {
  try {
    const banner = {
      id: `banner-${uuidv4().slice(0, 8)}`,
      ...req.body,
      sort: bannersDB.data.length + 1,
      createdAt: new Date().toISOString()
    };
    bannersDB.data.push(banner);
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新Banner
router.put('/banners/:id', authMiddleware, (req, res) => {
  try {
    const index = bannersDB.data.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Banner不存在' }
      });
    }
    bannersDB.data[index] = {
      ...bannersDB.data[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, data: bannersDB.data[index] });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除Banner
router.delete('/banners/:id', authMiddleware, (req, res) => {
  try {
    const index = bannersDB.data.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Banner不存在' }
      });
    }
    bannersDB.data.splice(index, 1);
    res.json({ success: true, message: 'Banner已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 积分管理 ====================

// 积分规则存储
const pointsRulesDB = {
  data: [
    { id: 'rule-1', name: '注册赠送', points: 100, trigger: 'register', dailyLimit: 1, status: 'active', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'rule-2', name: '消费返积分', points: 1, trigger: 'consume', rule: '每消费1元返1积分', dailyLimit: 1000, status: 'active', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'rule-3', name: '每日签到', points: 10, trigger: 'signin', dailyLimit: 1, status: 'active', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'rule-4', name: '商品评价', points: 5, trigger: 'review', dailyLimit: 5, status: 'active', createdAt: '2024-01-01T00:00:00.000Z' }
  ]
};

// 获取积分规则列表
router.get('/points-rules', authMiddleware, (req, res) => {
  try {
    res.json({ success: true, data: pointsRulesDB.data });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 创建积分规则
router.post('/points-rules', authMiddleware, (req, res) => {
  try {
    const rule = {
      id: `rule-${uuidv4().slice(0, 8)}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    pointsRulesDB.data.push(rule);
    res.json({ success: true, data: rule });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新积分规则
router.put('/points-rules/:id', authMiddleware, (req, res) => {
  try {
    const index = pointsRulesDB.data.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '规则不存在' }
      });
    }
    pointsRulesDB.data[index] = {
      ...pointsRulesDB.data[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, data: pointsRulesDB.data[index] });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除积分规则
router.delete('/points-rules/:id', authMiddleware, (req, res) => {
  try {
    const index = pointsRulesDB.data.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '规则不存在' }
      });
    }
    pointsRulesDB.data.splice(index, 1);
    res.json({ success: true, message: '规则已删除' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
