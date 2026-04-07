const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { addressesDB } = require('../db');
const { authMiddleware } = require('./auth');

// 获取地址列表
router.get('/', authMiddleware, (req, res) => {
  try {
    const addresses = addressesDB.find({ userId: req.userId });
    
    // 按默认地址排序
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      data: addresses
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 添加地址
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, phone, country, province, city, district, street, postalCode, isDefault } = req.body;

    if (!name || !phone || !country || !city || !street) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请填写完整的收货信息' }
      });
    }

    // 如果设为默认，先取消其他默认
    if (isDefault) {
      const addresses = addressesDB.find({ userId: req.userId });
      addresses.forEach(addr => {
        if (addr.isDefault) {
          addressesDB.update(addr.id, { isDefault: false });
        }
      });
    }

    const address = {
      id: `addr-${uuidv4()}`,
      userId: req.userId,
      name,
      phone,
      country,
      province: province || '',
      city,
      district: district || '',
      street,
      postalCode: postalCode || '',
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addressesDB.create(address);

    res.json({
      success: true,
      data: address
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 更新地址
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const address = addressesDB.findById(req.params.id);

    if (!address || address.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '收货地址不存在' }
      });
    }

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    
    // 如果设为默认，先取消其他默认
    if (updates.isDefault) {
      const addresses = addressesDB.find({ userId: req.userId });
      addresses.forEach(addr => {
        if (addr.isDefault && addr.id !== req.params.id) {
          addressesDB.update(addr.id, { isDefault: false });
        }
      });
    }

    addressesDB.update(req.params.id, updates);

    res.json({
      success: true,
      data: addressesDB.findById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 删除地址
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const address = addressesDB.findById(req.params.id);

    if (!address || address.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '收货地址不存在' }
      });
    }

    addressesDB.delete(req.params.id);

    res.json({
      success: true,
      data: { message: '地址已删除' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 设为默认地址
router.put('/:id/default', authMiddleware, (req, res) => {
  try {
    const address = addressesDB.findById(req.params.id);

    if (!address || address.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '收货地址不存在' }
      });
    }

    // 取消其他默认
    const addresses = addressesDB.find({ userId: req.userId });
    addresses.forEach(addr => {
      if (addr.isDefault && addr.id !== req.params.id) {
        addressesDB.update(addr.id, { isDefault: false });
      }
    });

    addressesDB.update(req.params.id, { isDefault: true, updatedAt: new Date().toISOString() });

    res.json({
      success: true,
      data: addressesDB.findById(req.params.id)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
