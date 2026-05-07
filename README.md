# 北苍星际速充 (Beicang Star Express)

跨境综合电商与生活服务平台，集成商城购物、跑腿代办、货币兑换、充值缴费等功能，配备完整后台管理系统。

## 在线访问

- **前端网站**: https://beicang-star-express.vercel.app
- **管理后台**: https://beicang-star-express.vercel.app/admin/login
- **后端 API**: https://beicang-star-express-2jvv.vercel.app

## 默认账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | 123456 |

---

## 一、用户端功能

### 1.1 认证系统
| 功能 | 描述 |
|------|------|
| 手机号+密码登录 | JWT Token 持久化存储，页面刷新不丢失 |
| 用户注册 | 手机号注册 + 验证码（开发环境固定 123456） |
| 社交登录 | 微信 / Telegram / Facebook |
| 个人资料修改 | 头像、昵称等，数据实时同步后端 |

### 1.2 首页
| 功能 | 描述 |
|------|------|
| 公告跑马灯 | 顶部滚动展示系统通知和促销信息 |
| 轮播 Banner | 3 图轮播，可跳转活动/商品页 |
| 快捷入口 | 公告、租房、汇兑、跑腿、充值、活动、优惠券等 8 项 |
| 商品分类 | 8 个分类图标导航 |
| 限时秒杀 | 秒杀商品展示 + 倒计时 |
| 新品推荐 | 新品商品列表 |
| 猜你喜欢 | 个性化商品推荐 |

### 1.3 商品浏览与搜索
| 功能 | 描述 |
|------|------|
| 分类浏览 | 按分类/子分类筛选商品 |
| 全文搜索 | 搜索商品名称/描述，记录搜索历史 |
| 商品详情 | 多图展示、规格选择、用户评价、加购 |

### 1.4 购物车与结算
| 功能 | 描述 |
|------|------|
| 购物车管理 | 添加/删除/改数量，单选/全选 |
| 三步结算 | 地址选择 → 支付方式 → 确认下单 |
| 自动算价 | 小计、优惠折扣、合计金额 |
| 多支付方式 | KBZ Pay / Wave Pay / Visa / Mastercard / PayPal |

### 1.5 订单管理
| 功能 | 描述 |
|------|------|
| 订单列表 | 按状态筛选（待付款/处理中/已发货/已完成） |
| 订单详情 | 商品明细、地址、支付信息、状态追溯 |
| 订单操作 | 取消（未付款）/ 确认收货 / 物流追踪 |

### 1.6 优惠券
| 功能 | 描述 |
|------|------|
| 领取 | 浏览并领取可用优惠券 |
| 列表 | 未使用 / 已使用 / 已过期分类 |
| 自动匹配 | 结算时自动匹配可用优惠券 |

### 1.7 生活服务
| 功能 | 描述 |
|------|------|
| 跑腿代办 | 帮我去 / 帮我送 / 快递取件 / 代驾 + 门店自提、家政、维修、回收 |
| 代购服务 | 代买商品，创建购物清单 |
| 物流追踪 | 包裹实时跟踪，多渠道支持 |

### 1.8 货币兑换
| 功能 | 描述 |
|------|------|
| 实时汇率 | 8 种货币汇率，30 秒自动刷新 |
| 兑换下单 | 计算金额并提交兑换订单 |
| 兑换记录 | 历史订单状态查询 |

### 1.9 账户充值
| 功能 | 描述 |
|------|------|
| 余额充值 | 多币种、多渠道充值 |
| 充值记录 | 历史充值明细 |

### 1.10 消息通知
| 功能 | 描述 |
|------|------|
| 通知分类 | 系统 / 订单 / 促销 / 社交 |
| 未读提醒 | 角标数量，一键全读 |

### 1.11 个人中心
| 功能 | 描述 |
|------|------|
| 个人资料 | 头像/昵称/余额/积分展示 |
| 快捷菜单 | 地址/优惠券/历史/收藏/通知/安全/帮助等 12 项 |
| 地址管理 | 多地址增删改、设置默认 |
| 主题切换 | 亮色 / 暗色 / 跟随系统 |

---

## 二、管理后台功能

### 2.1 仪表盘
总销售额、今日订单、商品总数、用户总数、最近订单、热销排行、销售趋势图、分类分布图

### 2.2 商品管理
商品 CRUD、上下架、分类筛选、库存预警（< 50 红色提醒）

### 2.3 分类管理
分类增删改、图标设置、子分类支持

### 2.4 订单管理
状态卡片（待付/处理中/已发/已完成）、订单搜索筛选、CSV 导出

### 2.5 用户管理
统计（总/活跃/新增）、搜索筛选、启用/禁用、CSV 导出

### 2.6 优惠券管理
折扣/满减类型、最低消费/最高优惠、发放进度、有效期管理

### 2.7 支付配置
支付方式开关、费率/限额配置、增删改

### 2.8 公告管理
系统/活动/商品/会员四类公告、发布/草稿状态

### 2.9 Banner 管理
标题/图片/跳转链接配置、点击统计、拖拽排序、显示/隐藏

### 2.10 活动管理
秒杀/新会员/邀请/节日/折扣五种类型、活动统计、启动/暂停

### 2.11 客服管理
客服列表、响应时间/满意度/未解决等指标、在线会话处理

### 2.12 骑手管理
骑手统计、在线状态筛选、服务区域分配

### 2.13 积分系统
积分规则管理、积分记录明细、积分兑换商品

### 2.14 权限控制
用户端 10 项 + 管理端 14 项功能开关，按模块批量操作

---

## 三、API 接口

### 认证 `/api/auth`
`register` `login` `logout` `profile(GET/PUT)` `send-code` `reset-password` `social-login`

### 商品 `/api/products`
列表(分页/筛选) 详情 热销 新品 推荐 评价

### 购物车 `/api/cart`
获取 添加 改数量 删除(单项/清空) 选中切换 全选

### 订单 `/api/orders`
列表(状态筛选) 详情 创建 取消 确认收货 支付

### 地址 `/api/addresses`
列表 新增 编辑 删除 设默认

### 优惠券 `/api/coupons`
列表 领取 验证 可用券查询

### 通知 `/api/notifications`
列表 未读数 标记已读 全部已读 删除

### 管理 `/api/admin`
登录 仪表盘统计 商品/订单/用户/优惠券/分类/公告/Banner CRUD

### 其他
`/api/payments` `/api/exchange` `/api/recharge` `/api/shopping` `/api/shipping` `/api/categories` `/api/banners` `/api/health`

---

## 四、数据模型

| 模型 | 核心字段 |
|------|----------|
| User | id, name, phone, email, avatar, balance(分), points, theme |
| Product | id, name, price(分), originalPrice, images, category, stock, sales, rating, specifications |
| Order | id, orderNumber, orderType, items, totalAmount(分), status, paymentStatus, shippingAddress, trackingNumber |
| CartItem | id, product, quantity, selected, specifications |
| Address | id, name, phone, country/province/city/district/street, postalCode, isDefault |
| Coupon | id, name, discountType(percentage/fixed), discountValue, minPurchase, maxDiscount, validFrom/To |

---

## 五、技术栈

### 前端
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3.4 + tailwindcss-animate
- Lucide React (图标)
- react-router-dom v7
- Axios
- React Context + useReducer (状态管理)

### 后端
- Node.js (>=18) + Express.js
- JWT 认证 (jsonwebtoken)
- BCrypt 密码加密 (bcryptjs)
- JSON 文件持久化（可迁移至 MongoDB/PostgreSQL）

### 部署
- 前端：Vercel（SPA rewrites）
- 后端：Vercel Serverless Functions
- API 代理：`/api/*` → 后端服务

---

## 六、本地开发

```bash
# 前端
npm install
npm run dev          # http://localhost:5173

# 后端
cd server
npm install
node src/index.js    # http://localhost:3000
```

---

## 七、已知问题与待优化

1. 数据存储使用 JSON 文件，生产环境应迁移至 MongoDB/PostgreSQL
2. 验证码开发环境固定 123456，需对接真实短信服务
3. 支付流程为模拟，需对接真实支付网关
4. 图片使用占位图，需实现文件上传
5. 缺少单元测试和集成测试
6. 未实现代码分割和懒加载
