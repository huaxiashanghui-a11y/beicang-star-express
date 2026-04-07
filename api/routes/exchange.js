const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { exchangeOrdersDB } = require('../models/exchangeOrders');
const { getRates, calculateExchange, getSupportedCurrencies } = require('../services/exchangeRateService');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'beicang-star-express-secret-key-2024';

// 统一响应格式
const response = (res, success, data = null, message = '') => {
  res.json({ success, data, message });
};

// 验证Token中间件
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '未登录' });
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token已过期' });
  }
};

// 获取支持的货币列表
router.get('/currencies', (req, res) => {
  const currencies = getSupportedCurrencies();
  response(res, true, currencies);
});

// 获取实时汇率
router.get('/rates', (req, res) => {
  const rates = getRates();
  response(res, true, {
    USD: rates.USD || 1,
    CNY: rates.CNY || 7.24,
    MMK: rates.MMK || 2100,
    THB: rates.THB || 35.5,
    SGD: rates.SGD || 1.34,
    MYR: rates.MYR || 4.72,
    EUR: rates.EUR || 0.92,
    VND: rates.VND || 24500,
    updateTime: new Date().toISOString()
  });
});

// 获取指定货币对汇率
router.get('/rate/:pair', (req, res) => {
  const { pair } = req.params;
  const [from, to] = pair.toUpperCase().split('_');

  if (!from || !to) {
    return response(res, false, null, '无效的货币对格式');
  }

  const rates = getRates();
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const baseRate = toRate / fromRate;
  const markupRate = 0.02;
  const exchangeRate = baseRate * (1 + markupRate);

  response(res, true, {
    pair: `${from}_${to}`,
    from,
    to,
    exchangeRate,
    baseRate,
    markupRate: markupRate * 100,
    updateTime: new Date().toISOString()
  });
});

// 计算换汇金额
router.post('/calculate', (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;

  if (!fromCurrency || !toCurrency || !amount) {
    return response(res, false, null, '请填写完整信息');
  }

  if (amount <= 0) {
    return response(res, false, null, '金额必须大于0');
  }

  const currencies = getSupportedCurrencies();
  const fromInfo = currencies.find(c => c.code === fromCurrency);
  const toInfo = currencies.find(c => c.code === toCurrency);

  const result = calculateExchange(fromCurrency, toCurrency, parseFloat(amount));

  response(res, true, {
    fromCurrency,
    fromCurrencyName: fromInfo?.name || fromCurrency,
    toCurrency,
    toCurrencyName: toInfo?.name || toCurrency,
    ...result
  });
});

// 创建换汇订单
router.post('/create', verifyToken, (req, res) => {
  try {
    const { fromCurrency, toCurrency, fromAmount, toAmount, exchangeRate, fee, remark } = req.body;

    if (!fromCurrency || !toCurrency || !fromAmount || !toAmount) {
      return response(res, false, null, '请填写完整信息');
    }

    const order = exchangeOrdersDB.create({
      userId: req.user.id,
      fromCurrency,
      toCurrency,
      fromAmount: parseFloat(fromAmount),
      toAmount: parseFloat(toAmount),
      exchangeRate: parseFloat(exchangeRate),
      fee: parseFloat(fee) || 0,
      remark: remark || '',
      status: 'pending', // pending, processing, completed, cancelled, rejected
      adminNote: '',
      createdAt: new Date().toISOString()
    });

    response(res, true, order, '换汇申请已提交，请等待管理员审核');
  } catch (error) {
    console.error('创建换汇订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 获取用户换汇订单列表
router.get('/orders', verifyToken, (req, res) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    let orders = exchangeOrdersDB.findByUser(req.user.id);

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    const total = orders.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const list = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(startIndex, startIndex + parseInt(pageSize));

    response(res, true, {
      list,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / parseInt(pageSize))
    });
  } catch (error) {
    console.error('获取换汇订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 获取换汇订单详情
router.get('/order/:orderId', verifyToken, (req, res) => {
  try {
    const order = exchangeOrdersDB.findOne({ id: req.params.orderId, userId: req.user.id });

    if (!order) {
      return response(res, false, null, '订单不存在');
    }

    response(res, true, order);
  } catch (error) {
    console.error('获取换汇订单详情失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 取消换汇订单
router.put('/cancel/:orderId', verifyToken, (req, res) => {
  try {
    const order = exchangeOrdersDB.findOne({ id: req.params.orderId, userId: req.user.id });

    if (!order) {
      return response(res, false, null, '订单不存在');
    }

    if (order.status !== 'pending') {
      return response(res, false, null, '只能取消待处理的订单');
    }

    exchangeOrdersDB.update(order.id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });

    response(res, true, null, '订单已取消');
  } catch (error) {
    console.error('取消订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// ==================== 管理员接口 ====================

// 获取所有换汇订单
router.get('/admin/orders', (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, fromCurrency, toCurrency } = req.query;
    let orders = [...exchangeOrdersDB.data];

    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    if (fromCurrency) {
      orders = orders.filter(o => o.fromCurrency === fromCurrency);
    }
    if (toCurrency) {
      orders = orders.filter(o => o.toCurrency === toCurrency);
    }

    const total = orders.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const list = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(startIndex, startIndex + parseInt(pageSize));

    response(res, true, { list, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('获取订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 处理换汇订单
router.put('/admin/process/:orderId', (req, res) => {
  try {
    const order = exchangeOrdersDB.findById(req.params.orderId);

    if (!order) {
      return response(res, false, null, '订单不存在');
    }

    if (order.status !== 'pending') {
      return response(res, false, null, '只能处理待处理的订单');
    }

    exchangeOrdersDB.update(order.id, {
      status: 'processing',
      processedAt: new Date().toISOString(),
      processedBy: req.body.adminId || 'admin'
    });

    response(res, true, null, '订单已标记为处理中');
  } catch (error) {
    console.error('处理订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 完成换汇订单
router.put('/admin/complete/:orderId', (req, res) => {
  try {
    const order = exchangeOrdersDB.findById(req.params.orderId);

    if (!order) {
      return response(res, false, null, '订单不存在');
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return response(res, false, null, '订单状态不允许完成');
    }

    exchangeOrdersDB.update(order.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy: req.body.adminId || 'admin',
      adminNote: req.body.adminNote || ''
    });

    response(res, true, null, '订单已完成');
  } catch (error) {
    console.error('完成订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 拒绝换汇订单
router.put('/admin/reject/:orderId', (req, res) => {
  try {
    const { reason } = req.body;
    const order = exchangeOrdersDB.findById(req.params.orderId);

    if (!order) {
      return response(res, false, null, '订单不存在');
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return response(res, false, null, '订单状态不允许拒绝');
    }

    exchangeOrdersDB.update(order.id, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.body.adminId || 'admin',
      rejectReason: reason || ''
    });

    response(res, true, null, '订单已拒绝');
  } catch (error) {
    console.error('拒绝订单失败:', error);
    response(res, false, null, '服务器错误');
  }
});

// 获取换汇统计
router.get('/admin/stats', (req, res) => {
  try {
    const orders = exchangeOrdersDB.data;
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
      todayCount: orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length,
      todayCompleted: orders.filter(o => {
        if (o.status !== 'completed' || !o.completedAt) return false;
        const today = new Date().toDateString();
        return new Date(o.completedAt).toDateString() === today;
      }).length
    };

    response(res, true, stats);
  } catch (error) {
    console.error('获取统计失败:', error);
    response(res, false, null, '服务器错误');
  }
});

module.exports = router;
