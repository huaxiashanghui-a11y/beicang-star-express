const express = require('express');
const router = express.Router();
const { notificationsDB } = require('../db');
const { authMiddleware } = require('./auth');

// 获取通知列表
router.get('/', authMiddleware, (req, res) => {
  try {
    const notifications = notificationsDB.find({ userId: req.userId });
    
    // 按时间倒序
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取未读数量
router.get('/unread-count', authMiddleware, (req, res) => {
  try {
    const notifications = notificationsDB.find({ userId: req.userId, isRead: false });
    
    res.json({
      success: true,
      data: { count: notifications.length }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 标记已读
router.put('/:id/read', authMiddleware, (req, res) => {
  try {
    const notification = notificationsDB.findById(req.params.id);

    if (!notification || notification.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '通知不存在' }
      });
    }

    notificationsDB.update(req.params.id, { isRead: true });

    res.json({
      success: true,
      data: { message: '已标记为已读' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 全部标记为已读
router.put('/read-all', authMiddleware, (req, res) => {
  try {
    const notifications = notificationsDB.find({ userId: req.userId, isRead: false });
    
    notifications.forEach(notif => {
      notificationsDB.update(notif.id, { isRead: true });
    });

    res.json({
      success: true,
      data: { message: '全部已读' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除通知
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const notification = notificationsDB.findById(req.params.id);

    if (!notification || notification.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '通知不存在' }
      });
    }

    notificationsDB.delete(req.params.id);

    res.json({
      success: true,
      data: { message: '通知已删除' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
