# 北苍星际速充 - 项目功能文档

> 跨境购物平台完整功能说明
> 更新时间: 2026-03-29

---

## 一、项目概述

### 1.1 项目名称
- **中文名**: 北苍星际速充
- **英文名**: Beicang Star Express
- **定位**: 跨境购物电商平台

### 1.2 技术栈
| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 3.4 |
| 路由管理 | React Router DOM 6 |
| 状态管理 | React Context |
| UI组件 | Lucide React Icons |
| 部署平台 | Vercel |

### 1.3 项目地址
- **GitHub**: https://github.com/huaxiashanghui-a11y/beicang-star-express
- **生产URL**: https://beicang-star-express-huaxiashanghui-a11ys-projects.vercel.app

---

## 二、用户端功能 (H5端)

### 2.1 页面路由

| 路由路径 | 页面名称 | 功能说明 |
|---------|---------|---------|
| `/` | 首页 | 首页展示 |
| `/login` | 登录页 | 用户登录 |
| `/register` | 注册页 | 用户注册 |
| `/category/:categoryId` | 商品列表页 | 分类商品展示 |
| `/search` | 搜索页 | 商品搜索 |
| `/product/:productId` | 商品详情页 | 商品详情与购买 |
| `/cart` | 购物车 | 购物车管理 |
| `/checkout` | 结算页 | 订单确认与支付 |
| `/orders` | 订单列表 | 用户订单 |
| `/order/:orderId` | 订单详情 | 订单详情查看 |
| `/profile` | 个人中心 | 用户信息 |
| `/settings` | 设置页 | 应用设置 |
| `/notifications` | 消息通知 | 通知列表 |
| `/addresses` | 地址管理 | 收货地址 |
| `/coupons` | 优惠券 | 优惠券领取使用 |
| `/activity` | 活动页 | 平台活动 |

### 2.2 首页功能

#### 顶部区域
- **搜索栏**: 固定在顶部，支持关键词搜索商品
- **滚动公告**: Marquee组件实现商品/系统公告滚动展示

#### 主体区域
- **Banner轮播**:
  - 自动轮播 (4秒间隔)
  - 手动切换
  - 渐变遮罩 + 标题文案
  - 底部指示点

- **热门分类网格**:
  - 8个分类图标网格布局
  - 点击跳转商品列表

- **限时秒杀区块**:
  - 精选热卖商品
  - 双列卡片展示

- **新品推荐区块**:
  - 最新上架商品
  - 卡片展示

- **为你推荐**:
  - 个性化商品推荐
  - 双列瀑布流布局

### 2.3 商品模块

#### 商品列表
- **筛选功能**: 分类筛选
- **搜索功能**:
  - 关键词搜索
  - 热门搜索标签
  - 搜索历史记录
- **商品展示**:
  - 双列瀑布流
  - 骨架屏加载
  - 下拉刷新

#### 商品详情
- **图片展示**:
  - 多图轮播
  - 大图预览
  - 图片缩略导航

- **商品信息**:
  - 商品名称
  - 价格展示 (划线原价 + 现价)
  - 评分 + 评价数
  - 销量显示
  - 标签 (热门/新品/折扣)

- **规格选择**:
  - 规格选项按钮
  - 数量选择器 (+/-按钮)

- **商品描述**:
  - 收起/展开切换
  - 富文本内容

- **评价展示**:
  - 用户头像 + 名称
  - 评分星级
  - 评价内容
  - 评价图片
  - 时间显示

- **店铺信息**:
  - 店铺名称 + 头像
  - 店铺评分
  - 商品数量

- **底部操作栏**:
  - 收藏按钮
  - 分享按钮
  - 加入购物车
  - 立即购买

- **支付流程**:
  - 支付方式选择 (微信/支付宝/银行卡)
  - 支付凭证上传
  - 支付状态模拟

### 2.4 购物车模块

- **商品列表**:
  - 商品图片 + 名称
  - 规格显示
  - 单价
  - 数量调整 (+/-)
  - 删除功能

- **结算功能**:
  - 全选/取消全选
  - 合计金额计算
  - 去结算按钮

- **状态管理**:
  - 添加购物车
  - 更新数量
  - 删除商品
  - 清空购物车
  - 选择状态切换

### 2.5 订单模块

#### 订单列表
- **状态筛选**:
  - 全部
  - 待支付
  - 待发货
  - 待收货
  - 已完成

- **订单卡片**:
  - 店铺名称
  - 商品缩略图
  - 订单金额
  - 订单状态
  - 操作按钮

#### 订单详情
- **订单信息**:
  - 订单编号
  - 下单时间
  - 订单状态

- **收货信息**:
  - 收货人
  - 联系电话
  - 收货地址

- **商品清单**:
  - 商品图片
  - 名称规格
  - 数量价格

- **支付信息**:
  - 支付方式
  - 支付金额
  - 优惠抵扣

### 2.6 用户模块

#### 个人中心
- **用户卡片**:
  - 头像
  - 用户名
  - 会员等级

- **数据统计**:
  - 订单数量 (待付款/待发货/待收货/待评价)
  - 优惠券数量
  - 收藏数量
  - 积分

- **功能入口**:
  - 我的订单
  - 优惠券
  - 收藏夹
  - 地址管理
  - 会员中心
  - 客服中心
  - 设置

#### 设置页
- **账号设置**:
  - 修改头像
  - 修改昵称
  - 修改手机号
  - 修改密码

- **偏好设置**:
  - 消息推送开关
  - 声音开关
  - 震动开关

- **其他设置**:
  - 清除缓存
  - 检查更新
  - 关于我们
  - 退出登录

### 2.7 认证模块

#### 登录功能
- **登录方式**:
  - 手机号+密码登录
  - 验证码登录
  - 社交登录 (微信/Google)

- **安全功能**:
  - 验证码发送
  - 密码显示/隐藏
  - 自动登录记住

#### 注册功能
- **注册流程**:
  - 手机号验证
  - 设置密码
  - 确认密码
  - 用户协议勾选

### 2.8 地址管理

- **地址列表**:
  - 收货人信息
  - 手机号
  - 详细地址
  - 默认地址标识

- **地址操作**:
  - 添加新地址
  - 编辑地址
  - 删除地址
  - 设置默认地址

### 2.9 优惠券模块

- **优惠券类型**:
  - 满减券
  - 折扣券
  - 新用户专享

- **优惠券状态**:
  - 待使用
  - 已使用
  - 已过期

- **优惠券操作**:
  - 领取优惠券
  - 使用优惠券
  - 查看适用商品

### 2.10 消息通知

- **通知类型**:
  - 系统通知
  - 订单通知
  - 活动通知
  - 物流通知

- **通知操作**:
  - 标记已读
  - 全部已读
  - 删除通知

---

## 三、管理后台功能

### 3.1 后台路由

| 路由路径 | 页面名称 | 功能说明 |
|---------|---------|---------|
| `/admin/login` | 管理员登录 | 管理员认证 |
| `/admin` | 管理首页 | 数据概览 |
| `/admin/products` | 商品管理 | 商品增删改查 |
| `/admin/orders` | 订单管理 | 订单处理 |
| `/admin/users` | 用户管理 | 用户管理 |
| `/admin/coupons` | 优惠券管理 | 优惠券CRUD |
| `/admin/categories` | 分类管理 | 商品分类管理 |
| `/admin/payments` | 支付管理 | 支付记录 |
| `/admin/customer-service` | 客服管理 | 客服工单 |
| `/admin/announcements` | 公告管理 | 系统公告 |
| `/admin/activities` | 活动管理 | 平台活动 |
| `/admin/banners` | Banner管理 | 首页轮播图 |
| `/admin/points` | 积分管理 | 积分规则 |

### 3.2 管理员登录

- **登录验证**:
  - 用户名 + 密码
  - Token存储
  - 路由守卫保护

### 3.3 管理首页 (Dashboard)

- **数据统计卡片**:
  - 今日订单数
  - 今日销售额
  - 用户总数
  - 待处理订单

- **数据可视化**:
  - 销售趋势图表
  - 订单状态分布
  - 商品销量排行

- **快捷操作**:
  - 待发货订单提醒
  - 库存不足提醒
  - 最新订单列表

### 3.4 商品管理

#### 商品列表
- **搜索筛选**:
  - 商品名称搜索
  - 分类筛选
  - 状态下拉筛选

- **数据表格**:
  - 商品图片
  - 商品名称
  - 分类
  - 价格 (现价/原价)
  - 库存
  - 销量
  - 状态 (上架/下架)
  - 操作按钮

- **操作功能**:
  - 查看详情 (Modal弹窗)
  - 编辑商品 (Modal表单)
  - 删除商品 (二次确认)
  - 切换状态 (上架/下架)

#### 添加/编辑商品表单
| 字段 | 类型 | 说明 |
|------|------|------|
| 商品名称 | 文本输入 | 必填 |
| 商品分类 | 下拉选择 | 必填 |
| 售价 | 数字输入 | 必填 |
| 原价 | 数字输入 | 选填 |
| 库存 | 数字输入 | 必填 |
| 销量 | 数字输入 | 选填 |
| 商品图片 | URL输入 | 选填 |
| 商品描述 | 文本域 | 选填 |
| 状态 | 开关选择 | 上架/下架 |

### 3.5 订单管理

#### 订单列表
- **筛选条件**:
  - 订单号搜索
  - 订单状态筛选
  - 时间范围筛选

- **订单状态**:
  - 待支付
  - 待发货
  - 已发货
  - 已完成
  - 已取消
  - 已退款

- **数据展示**:
  - 订单编号
  - 用户信息
  - 商品信息
  - 订单金额
  - 支付方式
  - 订单状态
  - 下单时间

- **操作功能**:
  - 查看详情
  - 修改订单状态
  - 取消订单
  - 退款处理

#### 订单详情
- 订单基本信息
- 用户收货信息
- 商品明细
- 支付信息
- 物流信息
- 操作日志

### 3.6 用户管理

#### 用户列表
- **搜索筛选**:
  - 用户名搜索
  - 手机号搜索
  - 注册时间筛选

- **数据展示**:
  - 用户头像
  - 用户名
  - 手机号
  - 邮箱
  - 注册时间
  - 订单数
  - 消费金额
  - 状态

- **操作功能**:
  - 查看详情
  - 编辑用户
  - 禁用/启用
  - 重置密码

#### 用户详情
- 基本信息 (头像/昵称/手机/邮箱/注册时间)
- 订单统计 (订单数/消费金额/优惠券数)
- 收货地址列表
- 订单记录

### 3.7 优惠券管理

#### 优惠券列表
- **优惠券类型**:
  - 满减券 (满X减Y)
  - 折扣券 (X折)
  - 新人券

- **数据字段**:
  - 优惠券名称
  - 类型
  - 面值/折扣
  - 使用门槛
  - 发放数量
  - 已使用数量
  - 有效期
  - 状态

- **操作功能**:
  - 添加优惠券
  - 编辑优惠券
  - 删除优惠券
  - 启用/禁用
  - 查看领取记录

#### 添加优惠券表单
| 字段 | 说明 |
|------|------|
| 优惠券名称 | 文本输入 |
| 类型 | 满减/折扣/新人 |
| 面值 | 满减金额或折扣率 |
| 使用门槛 | 满X元可用 |
| 有效期 | 开始时间 - 结束时间 |
| 发放总量 | 数量限制 |
| 每人限领 | 数量限制 |
| 适用商品 | 全部/指定分类/指定商品 |
| 状态 | 启用/禁用 |

### 3.8 分类管理

#### 分类列表
- **功能**:
  - 查看所有分类
  - 添加一级分类
  - 添加二级分类
  - 编辑分类
  - 删除分类
  - 排序调整

- **分类字段**:
  - 分类图标 (emoji)
  - 分类名称
  - 分类图片
  - 排序
  - 商品数量
  - 状态

### 3.9 支付管理

#### 支付记录
- **筛选条件**:
  - 订单号
  - 支付状态
  - 支付方式
  - 时间范围

- **支付状态**:
  - 待支付
  - 支付中
  - 已支付
  - 已退款
  - 支付失败

- **数据展示**:
  - 支付流水号
  - 订单号
  - 用户信息
  - 支付金额
  - 支付方式
  - 支付时间
  - 状态

- **操作功能**:
  - 查看详情
  - 退款处理
  - 导出记录

### 3.10 客服管理

#### 工单列表
- **工单状态**:
  - 待处理
  - 处理中
  - 已完成
  - 已关闭

- **工单类型**:
  - 售前咨询
  - 售后问题
  - 退款申请
  - 投诉建议

- **数据展示**:
  - 工单编号
  - 用户信息
  - 问题类型
  - 问题描述
  - 状态
  - 创建时间

- **操作功能**:
  - 回复工单
  - 标记处理中
  - 标记已完成
  - 查看历史记录

### 3.11 公告管理

#### 公告列表
- **公告类型**:
  - 系统公告
  - 活动公告
  - 版本更新

- **数据字段**:
  - 标题
  - 内容
  - 类型
  - 发布时间
  - 状态

- **操作功能**:
  - 发布公告
  - 编辑公告
  - 删除公告
  - 置顶/取消置顶

### 3.12 活动管理

#### 活动列表
- **活动类型**:
  - 限时秒杀
  - 满减活动
  - 折扣活动
  - 拼团活动
  - 抽奖活动

- **数据字段**:
  - 活动名称
  - 类型
  - 开始时间
  - 结束时间
  - 参与人数
  - 状态

- **操作功能**:
  - 创建活动
  - 编辑活动
  - 删除活动
  - 启用/禁用
  - 查看参与记录

### 3.13 Banner管理

#### Banner列表
- **数据字段**:
  - Banner图片
  - 标题
  - 副标题
  - 链接地址
  - 链接类型
  - 开始时间
  - 结束时间
  - 排序
  - 状态

- **操作功能**:
  - 添加Banner
  - 编辑Banner
  - 删除Banner
  - 排序调整
  - 启用/禁用

### 3.14 积分管理

#### 积分规则
- **积分类型**:
  - 注册赠送
  - 消费返积分
  - 签到积分
  - 评价返积分

- **数据字段**:
  - 规则名称
  - 积分数量
  - 触发条件
  - 每日上限
  - 状态

- **操作功能**:
  - 添加规则
  - 编辑规则
  - 删除规则
  - 启用/禁用

---

## 四、通用组件

### 4.1 UI组件库
| 组件 | 说明 |
|------|------|
| Button | 按钮组件 (多种变体和尺寸) |
| Input | 输入框组件 |
| Card | 卡片容器 |
| Badge | 徽章标签 |

### 4.2 业务组件
| 组件 | 说明 |
|------|------|
| Header | 页面头部导航 |
| Layout | 主布局组件 |
| TabBar | 底部标签栏 |
| Carousel | 轮播组件 |
| ProductCard | 商品卡片 |
| MarqueeNotice | 滚动公告 |
| FloatingSidebar | 悬浮侧边栏 |
| ReviewSection | 评价区域 |
| Skeleton | 骨架屏 |
| StickyBottom | 底部固定栏 |
| Toast | 提示消息 |
| PageTransition | 页面过渡动画 |

### 4.3 表单组件
- **表单验证**
- **输入状态** (默认/聚焦/错误/禁用)
- **错误提示**

---

## 五、API接口设计

### 5.1 用户端API

#### 认证模块 `/api/auth`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/login` | POST | 用户登录 |
| `/auth/register` | POST | 用户注册 |
| `/auth/profile` | GET | 获取用户信息 |
| `/auth/profile` | PUT | 更新用户信息 |
| `/auth/send-code` | POST | 发送验证码 |
| `/auth/social-login` | POST | 社交登录 |

#### 商品模块 `/api/products`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/products` | GET | 商品列表 |
| `/products/:id` | GET | 商品详情 |
| `/products/hot` | GET | 热门商品 |
| `/products/new` | GET | 新品商品 |
| `/products/recommend` | GET | 推荐商品 |
| `/products/:id/reviews` | GET | 商品评价 |

#### 购物车模块 `/api/cart`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/cart` | GET | 获取购物车 |
| `/cart` | POST | 添加商品 |
| `/cart/:id` | PUT | 更新数量 |
| `/cart/:id` | DELETE | 删除商品 |
| `/cart` | DELETE | 清空购物车 |
| `/cart/:id/select` | PUT | 选择状态 |

#### 订单模块 `/api/orders`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/orders` | GET | 订单列表 |
| `/orders/:id` | GET | 订单详情 |
| `/orders` | POST | 创建订单 |
| `/orders/:id/cancel` | PUT | 取消订单 |
| `/orders/:id/confirm` | PUT | 确认收货 |
| `/orders/:id/pay` | POST | 订单支付 |

#### 地址模块 `/api/addresses`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/addresses` | GET | 地址列表 |
| `/addresses` | POST | 添加地址 |
| `/addresses/:id` | PUT | 更新地址 |
| `/addresses/:id` | DELETE | 删除地址 |
| `/addresses/:id/default` | PUT | 设置默认 |

#### 优惠券模块 `/api/coupons`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/coupons` | GET | 优惠券列表 |
| `/coupons/claim` | POST | 领取优惠券 |
| `/coupons/verify` | POST | 验证优惠券 |
| `/coupons/available` | GET | 可用优惠券 |

#### 通知模块 `/api/notifications`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/notifications` | GET | 通知列表 |
| `/notifications/unread-count` | GET | 未读数量 |
| `/notifications/:id/read` | PUT | 标记已读 |
| `/notifications/read-all` | PUT | 全部已读 |
| `/notifications/:id` | DELETE | 删除通知 |

### 5.2 管理后台API

#### 管理员认证 `/api/admin`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/login` | POST | 管理员登录 |
| `/admin/profile` | GET | 获取管理员信息 |

#### 数据统计 `/api/admin/stats`
| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/stats/dashboard` | GET | 仪表盘数据 |
| `/admin/stats/sales` | GET | 销售统计 |
| `/admin/stats/products` | GET | 商品统计 |

---

## 六、数据模型

### 6.1 用户数据
```typescript
interface User {
  id: string
  name: string
  email?: string
  phone: string
  avatar?: string
  level?: number
  points?: number
  createdAt: string
}
```

### 6.2 商品数据
```typescript
interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  category: string
  subcategory?: string
  rating: number
  reviewCount: number
  sales: number
  stock: number
  specifications?: { name: string; value: string }[]
  seller?: Seller
  tags?: string[]
  isHot?: boolean
  isNew?: boolean
  discount?: number
}
```

### 6.3 订单数据
```typescript
interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  originalAmount?: number
  discount?: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}
```

### 6.4 优惠券数据
```typescript
interface Coupon {
  id: string
  name: string
  type: 'fixed' | 'percent'
  value: number
  minAmount?: number
  validFrom: string
  validUntil: string
  totalCount: number
  usedCount: number
  perUserLimit: number
  status: 'active' | 'inactive'
}
```

---

## 七、项目目录结构

```
beicang-star-express/
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 项目资源
│   ├── components/           # 公共组件
│   │   ├── ui/              # UI基础组件
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── Carousel.tsx
│   │   ├── FloatingSidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── MarqueeNotice.tsx
│   │   ├── PageTransition.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ReviewSection.tsx
│   │   ├── Skeleton.tsx
│   │   ├── StickyBottom.tsx
│   │   ├── TabBar.tsx
│   │   └── Toast.tsx
│   ├── config/              # 配置文件
│   │   ├── api.ts           # 用户端API
│   │   └── adminApi.ts      # 管理端API
│   ├── context/             # 状态管理
│   │   └── AppContext.tsx
│   ├── data/                # 模拟数据
│   │   └── mockData.ts
│   ├── hooks/               # 自定义Hooks
│   │   └── usePullRefresh.ts
│   ├── layouts/             # 布局组件
│   │   └── AdminLayout.tsx
│   ├── lib/                 # 工具函数
│   │   └── utils.ts
│   ├── pages/               # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── AddressPage.tsx
│   │   ├── CouponPage.tsx
│   │   ├── ActivityPage.tsx
│   │   └── admin/           # 管理后台页面
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminProductsPage.tsx
│   │       ├── AdminOrdersPage.tsx
│   │       ├── AdminUsersPage.tsx
│   │       ├── AdminCouponsPage.tsx
│   │       ├── AdminCategoriesPage.tsx
│   │       ├── AdminPaymentsPage.tsx
│   │       ├── AdminCustomerServicePage.tsx
│   │       ├── AdminAnnouncementsPage.tsx
│   │       ├── AdminActivitiesPage.tsx
│   │       ├── AdminBannersPage.tsx
│   │       └── AdminPointsPage.tsx
│   ├── types/               # TypeScript类型
│   │   └── index.ts
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── .github/                 # GitHub配置
│   └── workflows/           # Actions工作流
│       └── deploy.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

---

## 八、部署说明

### 8.1 Vercel部署
由于项目在Vercel构建时遇到权限问题，解决方案是：
1. 本地执行 `npm run build` 构建项目
2. 将 `dist` 目录文件通过Vercel API直接上传
3. 创建部署时设置 `outputDirectory: "."` 绕过构建步骤

### 8.2 环境变量
```env
# API配置
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 九、功能清单汇总

### 9.1 用户端功能 (30+)
- [x] 首页展示 (Banner/分类/商品推荐)
- [x] 商品搜索与筛选
- [x] 商品详情页
- [x] 购物车管理
- [x] 订单流程 (创建/支付/取消/确认)
- [x] 用户登录/注册
- [x] 个人中心
- [x] 地址管理
- [x] 优惠券领取使用
- [x] 消息通知
- [x] 商品评价
- [x] 收藏商品
- [x] 活动页面

### 9.2 管理后台功能 (50+)
- [x] 管理员登录认证
- [x] 数据仪表盘
- [x] 商品管理 (CRUD + 上下架)
- [x] 订单管理 (状态更新/退款)
- [x] 用户管理 (查看/编辑/禁用)
- [x] 优惠券管理 (CRUD + 发放)
- [x] 分类管理 (多级分类)
- [x] 支付记录查询
- [x] 客服工单处理
- [x] 公告发布管理
- [x] 活动创建管理
- [x] Banner轮播管理
- [x] 积分规则配置

---

## 十、后续开发建议

### 10.1 待实现功能
1. **后端API对接** - 当前为Mock数据，需要对接真实后端
2. **支付接口集成** - 微信/支付宝真实支付
3. **即时通讯** - 客服实时聊天
4. **地图定位** - 收货地址地图选择
5. **图片上传** - 商品图片上传功能
6. **数据导出** - 订单/用户数据导出

### 10.2 性能优化
1. 图片懒加载
2. 虚拟列表 (长列表)
3. 代码分割
4. Service Worker离线缓存

### 10.3 安全加固
1. 输入验证
2. XSS防护
3. CSRF Token
4. 敏感数据加密

---

## 十一、联系方式

- **项目仓库**: https://github.com/huaxiashanghui-a11y/beicang-star-express
- **生产地址**: https://beicang-star-express-huaxiashanghui-a11ys-projects.vercel.app

---

> 文档生成时间: 2026-03-29
> 生成工具: Qoder AI
