# 北苍星际速充 - API Server

## 基础信息

- **端口**: 3000
- **基础URL**: `http://localhost:3000/api`

## 认证

使用JWT Token认证，在请求头中添加：
```
Authorization: Bearer <token>
```

## API 端点

### 认证相关 `/api/auth`

| 方法 | 路径 | 描述 | 需要的body |
|------|------|------|-----------|
| POST | `/auth/register` | 用户注册 | `{ phone, password, name? }` |
| POST | `/auth/login` | 用户登录 | `{ phone, password }` |
| POST | `/auth/logout` | 用户登出 | - |
| GET | `/auth/profile` | 获取用户信息 | - |
| PUT | `/auth/profile` | 更新用户信息 | `{ name?, email?, avatar? }` |
| POST | `/auth/send-code` | 发送验证码 | `{ phone }` |
| POST | `/auth/reset-password` | 重置密码 | `{ phone, code, newPassword }` |

### 商品相关 `/api/products`

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/products` | 获取商品列表 | `?category=&search=&sort=&page=&limit=` |
| GET | `/products/:id` | 获取商品详情 | - |
| GET | `/products/recommend` | 获取推荐商品 | `?limit=` |
| GET | `/products/hot` | 获取热门商品 | `?limit=` |
| GET | `/products/new` | 获取新品 | `?limit=` |

### 分类相关 `/api/categories`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/categories` | 获取所有分类 |
| GET | `/categories/:id` | 获取分类详情 |

### 购物车 `/api/cart`

| 方法 | 路径 | 描述 | body |
|------|------|------|------|
| GET | `/cart` | 获取购物车 | - |
| POST | `/cart` | 添加商品 | `{ productId, quantity, specifications? }` |
| PUT | `/cart/:itemId` | 更新数量 | `{ quantity }` |
| DELETE | `/cart/:itemId` | 删除商品 | - |
| DELETE | `/cart` | 清空购物车 | - |

### 订单 `/api/orders`

| 方法 | 路径 | 描述 | body/参数 |
|------|------|------|-----------|
| GET | `/orders` | 获取订单列表 | `?status=` |
| GET | `/orders/:id` | 获取订单详情 | - |
| POST | `/orders` | 创建订单 | `{ addressId, paymentMethod, items? }` |
| PUT | `/orders/:id/cancel` | 取消订单 | - |
| PUT | `/orders/:id/confirm` | 确认收货 | - |

### 收货地址 `/api/addresses`

| 方法 | 路径 | 描述 | body |
|------|------|------|------|
| GET | `/addresses` | 获取地址列表 | - |
| POST | `/addresses` | 添加地址 | `{ name, phone, country, province, city, district, street, postalCode }` |
| PUT | `/addresses/:id` | 更新地址 | `{ ...address }` |
| DELETE | `/addresses/:id` | 删除地址 | - |
| PUT | `/addresses/:id/default` | 设为默认 | - |

### 优惠券 `/api/coupons`

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/coupons` | 获取优惠券列表 | `?status=` |
| POST | `/coupons/claim` | 领取优惠券 | `{ couponId }` |
| POST | `/coupons/verify` | 验证优惠券 | `{ couponId, amount }` |

### 消息通知 `/api/notifications`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/notifications` | 获取通知列表 |
| PUT | `/notifications/:id/read` | 标记已读 |
| PUT | `/notifications/read-all` | 全部已读 |

### 支付 `/api/payments`

| 方法 | 路径 | 描述 | body |
|------|------|------|------|
| POST | `/payments/create` | 创建支付 | `{ orderId, method }` |
| POST | `/payments/callback` | 支付回调 | - |

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息"
  }
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| `UNAUTHORIZED` | 未登录或登录已过期 |
| `FORBIDDEN` | 没有权限 |
| `NOT_FOUND` | 资源不存在 |
| `VALIDATION_ERROR` | 参数验证失败 |
| `INSUFFICIENT_STOCK` | 库存不足 |
| `COUPON_EXPIRED` | 优惠券已过期 |
| `ORDER_CANNOT_CANCEL` | 订单无法取消 |

## 测试账号

```json
{
  "phone": "+95 9 123 4567",
  "password": "123456"
}
```
