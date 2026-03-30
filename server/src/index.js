const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const addressRoutes = require('./routes/addresses');
const couponRoutes = require('./routes/coupons');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 分类路由（直接使用products路由）
app.get('/api/categories', (req, res) => {
  const { categoriesDB } = require('./db');
  res.json({
    success: true,
    data: categoriesDB.data
  });
});

// 支付方式路由
app.get('/api/payment-methods', (req, res) => {
  const methods = [
    { id: 'kbz', name: 'KBZ Pay', description: '缅甸KBZ银行支付', icon: '💳' },
    { id: 'wave', name: 'Wave Pay', description: '缅甸Wave移动支付', icon: '📱' },
    { id: 'visa', name: 'Visa', description: '国际信用卡支付', icon: '💳' },
    { id: 'mastercard', name: 'Mastercard', description: '万事达卡支付', icon: '💳' },
    { id: 'paypal', name: 'PayPal', description: '国际在线支付', icon: '🌐' }
  ];
  res.json({
    success: true,
    data: methods
  });
});

// 首页横幅
app.get('/api/banners', (req, res) => {
  const banners = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
      title: '春季新品大促',
      subtitle: '全场低至5折起',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      title: '数码产品专场',
      subtitle: '苹果华为限时优惠',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
      title: '美妆护肤节',
      subtitle: '大牌护肤超值套装',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];
  res.json({
    success: true,
    data: banners
  });
});

// 评价相关
app.get('/api/products/:id/reviews', (req, res) => {
  // 模拟评价数据
  const reviews = [
    {
      id: 'rev-1',
      userId: 'user-1',
      user: {
        name: '张三',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
      },
      rating: 5,
      content: '商品质量非常好，包装也很精美。物流很快，客服态度也很好。强烈推荐！',
      images: [],
      createdAt: '2024-03-20',
      helpful: 42
    },
    {
      id: 'rev-2',
      userId: 'user-2',
      user: {
        name: '李四',
        avatar: ''
      },
      rating: 4,
      content: '整体不错，就是发货稍微慢了点。商品本身很好用，会回购的。',
      images: [],
      createdAt: '2024-03-18',
      helpful: 28
    }
  ];
  res.json({
    success: true,
    data: reviews
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: '服务器内部错误'
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '接口不存在'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🛒 北苍星际速充 API Server                          ║
║                                                       ║
║   Server running on: http://localhost:${PORT}            ║
║   API Base URL:      http://localhost:${PORT}/api         ║
║                                                       ║
║   Test Account:                                    ║
║   Phone:    +95 9 123 4567                          ║
║   Password: 123456                                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
