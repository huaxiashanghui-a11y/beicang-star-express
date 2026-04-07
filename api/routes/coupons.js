const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { couponsDB } = require('../db');
const { authMiddleware } = require('./auth');

// 默认优惠券数据
const defaultCoupons = [
  {
    id: 'coupon-1',
    name: '新人专享券',
    description: '新用户首单满100减20',
    discountType: 'fixed',
    discountValue: 2000,
    minPurchase: 10000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    category: null
  },
  {
    id: 'coupon-2',
    name: '数码专属券',
    description: '数码产品满500减50',
    discountType: 'fixed',
    discountValue: 5000,
    minPurchase: 50000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    category: '电子产品'
  },
  {
    id: 'coupon-3',
    name: '限时9折券',
    description: '指定商品9折优惠',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 0,
    maxDiscount: 10000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    category: null
  },
  {
    id: 'coupon-4',
    name: '美妆满减券',
    description: '美妆产品满200减30',
    discountType: 'fixed',
    discountValue: 3000,
    minPurchase: 20000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    category: '美妆'
  },
  {
    id: 'coupon-5',
    name: '家居专属券',
    description: '家居用品满300减40',
    discountType: 'fixed',
    discountValue: 4000,
    minPurchase: 30000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    category: '家居'
  }
];

// 初始化优惠券
function initCoupons() {
  if (couponsDB.data.length === 0) {
    defaultCoupons.forEach(coupon => couponsDB.create(coupon));
  }
}
initCoupons();

// 获取优惠券列表
router.get('/', authMiddleware, (req, res) => {
  try {
    const { status } = req.query;
    const userCoupons = couponsDB.find({ userId: req.userId });
    const now = new Date().toISOString().split('T')[0];

    // 获取所有可用优惠券（系统优惠券）
    let coupons = [...couponsDB.data.filter(c => !c.userId)];

    // 添加用户已领取的优惠券
    const claimedCoupons = couponsDB.find({ userId: req.userId, isClaimed: true });
    claimedCoupons.forEach(uc => {
      const originalCoupon = defaultCoupons.find(c => c.id === uc.originalId);
      if (originalCoupon) {
        coupons.push({
          ...originalCoupon,
          ...uc,
          isUsed: uc.isUsed
        });
      }
    });

    // 筛选状态
    if (status === 'available') {
      coupons = coupons.filter(c => !c.isUsed && c.validTo >= now);
    } else if (status === 'used') {
      coupons = coupons.filter(c => c.isUsed);
    } else if (status === 'expired') {
      coupons = coupons.filter(c => c.validTo < now);
    }

    res.json({
      success: true,
      data: coupons
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 领取优惠券
router.post('/claim', authMiddleware, (req, res) => {
  try {
    const { couponId } = req.body;
    const coupon = defaultCoupons.find(c => c.id === couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '优惠券不存在' }
      });
    }

    // 检查是否已领取
    const existing = couponsDB.findOne({ 
      userId: req.userId, 
      originalId: couponId,
      isClaimed: true
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '该优惠券已领取' }
      });
    }

    // 创建用户优惠券
    const userCoupon = {
      id: `ucoupon-${uuidv4()}`,
      userId: req.userId,
      originalId: couponId,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      category: coupon.category,
      isClaimed: true,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    couponsDB.create(userCoupon);

    res.json({
      success: true,
      data: userCoupon
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 验证优惠券
router.post('/verify', authMiddleware, (req, res) => {
  try {
    const { couponId, amount, category } = req.body;
    const now = new Date().toISOString().split('T')[0];

    // 查找用户已领取的优惠券
    let coupon = couponsDB.findOne({ 
      id: couponId,
      userId: req.userId,
      isClaimed: true
    });

    if (!coupon) {
      // 尝试查找系统优惠券
      coupon = defaultCoupons.find(c => c.id === couponId);
      if (!coupon) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: '优惠券不存在' }
        });
      }
    }

    // 检查是否过期
    if (coupon.validTo < now) {
      return res.status(400).json({
        success: false,
        error: { code: 'COUPON_EXPIRED', message: '优惠券已过期' }
      });
    }

    // 检查是否已使用
    if (coupon.isUsed) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '优惠券已使用' }
      });
    }

    // 检查最低消费
    if (amount < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: `满${coupon.minPurchase / 100}元可用` }
      });
    }

    // 检查分类限制
    if (coupon.category && category && coupon.category !== category) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '该优惠券不适用于此商品分类' }
      });
    }

    // 计算折扣
    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else {
      discount = Math.floor(amount * coupon.discountValue / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    res.json({
      success: true,
      data: {
        valid: true,
        discount,
        coupon: {
          id: coupon.id,
          name: coupon.name,
          discountValue: coupon.discountValue,
          discountType: coupon.discountType
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

// 使用优惠券
router.post('/use', authMiddleware, (req, res) => {
  try {
    const { couponId } = req.body;

    const coupon = couponsDB.findOne({ 
      id: couponId,
      userId: req.userId,
      isClaimed: true
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '优惠券不存在' }
      });
    }

    couponsDB.update(couponId, { isUsed: true });

    res.json({
      success: true,
      data: { message: '优惠券已使用' }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

// 获取可用优惠券
router.get('/available', authMiddleware, (req, res) => {
  try {
    const now = new Date().toISOString().split('T')[0];
    const availableCoupons = couponsDB.data.filter(c => 
      !c.userId || (c.userId === req.userId && c.isClaimed && !c.isUsed && c.validTo >= now)
    );

    res.json({
      success: true,
      data: availableCoupons
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误' }
    });
  }
});

module.exports = router;
