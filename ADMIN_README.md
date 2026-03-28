# 北苍星际速充 - Admin 管理后台

## 📋 概述

这是北苍星际速充电商应用的**管理员后台系统**，用于商家/管理员管理商品、订单、用户、优惠券等。

---

## 🚀 快速启动

### 步骤 1：确保后端服务器正在运行

```bash
cd /d d:\beicang.js\server
npm run dev
```

### 步骤 2：启动前端开发服务器

```bash
cd /d d:\beicang.js
npm run dev
```

### 步骤 3：访问 Admin 后台

在浏览器中打开：

```
http://localhost:5173/admin/login
```

---

## 🔐 管理员账号

### 超级管理员
- **用户名**: `admin`
- **密码**: `admin123`

### 运营管理员
- **用户名**: `manager`
- **密码**: `manager123`

---

## 📊 功能模块

### 1. 仪表盘 `/admin`
- 查看总销售额、今日订单、商品数量、用户总数
- 销售趋势图表
- 商品分类分布
- 最近订单列表
- 热销商品排行

### 2. 商品管理 `/admin/products`
- 查看所有商品列表
- 添加新商品
- 编辑商品信息
- 删除商品
- 上下架商品
- 搜索和筛选商品
- 库存管理

### 3. 订单管理 `/admin/orders`
- 查看所有订单
- 按状态筛选（待支付、处理中、已发货、已完成、已取消）
- 订单发货操作
- 查看订单详情
- 导出订单数据

### 4. 用户管理 `/admin/users`
- 查看所有注册用户
- 搜索用户
- 查看用户信息
- 禁用/启用用户
- 查看用户消费记录

### 5. 优惠券管理 `/admin/coupons`
- 创建新优惠券
- 编辑优惠券
- 删除优惠券
- 查看优惠券领取情况
- 复制优惠券代码

### 6. 分类管理 `/admin/categories`
- 查看所有商品分类
- 添加新分类
- 编辑分类
- 启用/禁用分类
- 查看子分类
- 分类结构图

---

## 🎨 技术栈

- **前端框架**: React 18 + TypeScript
- **路由**: React Router v6
- **UI组件**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Context

---

## 📁 项目结构

```
d:\beicang.js\
├── src\
│   ├── pages\admin\
│   │   ├── AdminLoginPage.tsx          # 登录页
│   │   ├── AdminDashboardPage.tsx       # 仪表盘
│   │   ├── AdminProductsPage.tsx       # 商品管理
│   │   ├── AdminOrdersPage.tsx          # 订单管理
│   │   ├── AdminUsersPage.tsx          # 用户管理
│   │   ├── AdminCouponsPage.tsx        # 优惠券管理
│   │   └── AdminCategoriesPage.tsx      # 分类管理
│   ├── layouts\
│   │   └── AdminLayout.tsx              # Admin布局组件
│   └── config\
│       └── adminApi.ts                  # Admin API配置
└── server\                              # 后端API服务
    └── src\
        └── index.js                    # Express服务器
```

---

## 🔌 API 接口

### 健康检查
```bash
GET http://localhost:3000/api/health
```

### 测试账号
```bash
POST http://localhost:3000/api/auth/login
Body: {
  "phone": "+95 9 123 4567",
  "password": "123456"
}
```

---

## 🛠️ 常见问题

### Q: 无法访问 Admin 页面？
A: 确保：
1. 后端服务器运行在 `localhost:3000`
2. 前端服务器运行在 `localhost:5173`
3. 使用正确的 Admin 账号登录

### Q: 登录失败？
A: 检查是否使用了正确的管理员账号：
- `admin` / `admin123`
- `manager` / `manager123`

### Q: 数据不显示？
A: 这是模拟数据，如需真实数据需要连接真实数据库。

---

## 📱 返回前台

在 Admin 侧边栏底部点击"返回前台"即可回到用户商城。

---

## 🔒 安全说明

⚠️ 当前为演示版本，生产环境需要：
- 真实的用户认证系统
- JWT Token 验证
- 权限控制
- 数据加密
- HTTPS 加密传输

---

## 📞 技术支持

如有问题，请检查：
1. Node.js 和 npm 版本
2. 端口占用情况
3. 控制台错误信息
