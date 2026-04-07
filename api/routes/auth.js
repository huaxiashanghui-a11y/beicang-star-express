const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { usersDB, notificationsDB } = require('../db');

const JWT_SECRET = 'beicang-star-secret-key-2024';
const JWT_EXPIRES = '7d';

// 生成Token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// 验证Token中间件
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '请先登录' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '登录已过期' }
    });
  }
}

// 注册
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, code } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '手机号和密码不能为空' }
      });
    }

    // 检查手机号是否已注册
    const existingUser = usersDB.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '该手机号已注册' }
      });
    }

    // 验证码验证（实际项目中应该验证短信验证码）
    // 这里简化处理

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `user-${uuidv4()}`,
      name: name || phone.slice(-4),
      email: '',
      phone,
      password: hashedPassword,
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    usersDB.create(user);

    const token = generateToken(user);
    const { password: _, ...userInfo } = user;

    res.json({
      success: true,
      data: { user: userInfo, token }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '手机号和密码不能为空' }
      });
    }

    const user = usersDB.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: '手机号或密码错误' }
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: '手机号或密码错误' }
      });
    }

    const token = generateToken(user);
    const { password: _, ...userInfo } = user;

    // 添加登录通知
    notificationsDB.create({
      id: `notif-${uuidv4()}`,
      userId: user.id,
      type: 'system',
      title: '登录提醒',
      content: '您的账户在新设备登录，如非本人操作请注意账户安全',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: { user: userInfo, token }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 登出
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: { message: '已退出登录' }
  });
});

// 获取用户信息
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const user = usersDB.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }

    const { password: _, ...userInfo } = user;
    res.json({
      success: true,
      data: userInfo
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新用户信息
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = usersDB.update(req.userId, { name, email, avatar });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }

    const { password: _, ...userInfo } = user;
    res.json({
      success: true,
      data: userInfo
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 发送验证码
router.post('/send-code', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: '手机号不能为空' }
    });
  }

  // 实际项目中应该调用短信服务发送验证码
  // 这里模拟发送成功
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  res.json({
    success: true,
    data: { 
      message: '验证码已发送',
      // 开发环境下返回验证码方便测试
      code: process.env.NODE_ENV === 'development' ? code : undefined
    }
  });
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body;

    if (!phone || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '参数不完整' }
      });
    }

    // 验证码验证（实际项目中应该验证）
    
    const user = usersDB.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户不存在' }
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usersDB.update(user.id, { password: hashedPassword });

    res.json({
      success: true,
      data: { message: '密码重置成功' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 社交登录
router.post('/social-login', async (req, res) => {
  try {
    const { provider, openId, name, avatar } = req.body;

    // 查找或创建用户
    let user = usersDB.findOne({ [`social_${provider}`]: openId });
    
    if (!user) {
      user = {
        id: `user-${uuidv4()}`,
        name: name || '用户',
        email: '',
        phone: '',
        [`social_${provider}`]: openId,
        avatar: avatar || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      usersDB.create(user);
    }

    const token = generateToken(user);
    const { password: _, ...userInfo } = user;

    res.json({
      success: true,
      data: { user: userInfo, token }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
