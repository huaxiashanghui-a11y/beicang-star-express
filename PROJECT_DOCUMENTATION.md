# 北苍星际速充 - 项目文档

> 更新时间：2026-03-31
> 版本：v1.0.0

---

## 一、项目概述

### 1.1 项目信息
- **项目名称**：北苍星际速充 (beicang-star-express)
- **项目类型**：跨境购物平台 + 跑腿服务平台
- **技术栈**：React + Vite + TypeScript + Tailwind CSS
- **后端**：Express.js (JSON 文件数据库)
- **部署平台**：Vercel (前端) + GitHub Actions (CI/CD)

### 1.2 访问地址
| 环境 | 地址 |
|------|------|
| 前台商城 | https://beicang-star-express.vercel.app |
| 管理后台 | https://beicang-star-express.vercel.app/admin/login |
| 备用静态后台 | https://beicang-star-express.vercel.app/admin-static.html |

### 1.3 账号信息
| 系统 | 用户名 | 密码 |
|------|--------|------|
| 前台用户 | admin@test.com | 123456 |
| 管理后台 | admin | 123456 |

---

## 二、项目结构

```
beicang-star-express/
├── src/                          # React 源代码
│   ├── components/                # 组件目录
│   │   ├── ui/                    # UI 基础组件
│   │   ├── floating/              # 悬浮窗功能
│   │   ├── TabBar.tsx            # 底部导航栏
│   │   └── Layout.tsx            # 主布局
│   ├── pages/                    # 页面目录
│   │   ├── HomePage.tsx          # 首页
│   │   ├── ProductListPage.tsx   # 商品列表
│   │   ├── ProductDetailPage.tsx # 商品详情
│   │   ├── CartPage.tsx          # 购物车
│   │   ├── CheckoutPage.tsx      # 结账页
│   │   ├── OrdersPage.tsx       # 订单列表
│   │   ├── ProfilePage.tsx      # 个人中心
│   │   ├── ErrandsPage.tsx       # 跑腿服务页
│   │   └── admin/                # 管理后台页面
│   ├── layouts/
│   │   ├── Layout.tsx           # 前台布局
│   │   └── AdminLayout.tsx      # 后台布局
│   └── App.tsx                   # 路由配置
├── server/                       # 后端 Express 服务
├── public/                       # 静态资源
├── .github/workflows/            # GitHub Actions
└── vercel.json                  # Vercel 配置
```

---

## 三、前台功能

### 3.1 首页模块
| 功能 | 描述 |
|------|------|
| 顶部公告栏 | 滚动显示重要通知 |
| 轮播图 | 3张促销Banner |
| 分类导航 | 8个商品分类图标 |
| 限时秒杀 | 倒计时抢购商品 |
| 热门推荐 | 商品展示列表 |
| 为你推荐 | 个性化商品推荐 |

### 3.2 商品模块
- 商品列表（分类筛选、搜索）
- 商品详情（图片、描述、评价）
- 收藏/加入购物车

### 3.3 购物车
- 商品数量修改
- 删除商品
- 价格计算

### 3.4 订单模块
- 下单流程
- 订单列表
- 订单详情
- 订单状态追踪

### 3.5 个人中心
- 用户信息管理
- 收货地址管理
- 优惠券查看
- 消息通知
- 设置

### 3.6 跑腿服务 (/errands)
| 功能 | 描述 |
|------|------|
| 代取快递 | 帮忙取快递 |
| 帮我买 | 跑腿代买 |
| 帮我去 | 跑腿办事 |
| 帮我送 | 物品配送 |
| 代驾服务 | 司机服务 |
| 家政生活 | 保洁服务 |
| 上门维修 | 维修服务 |
| 上门回收 | 废品回收 |

### 3.7 悬浮窗功能
| 按钮 | 颜色 | 功能 |
|------|------|------|
| 客服 | 绿色 | 在线客服聊天 |
| 购物车 | 橙色 | 快速购物车 |
| 福利 | 紫色 | 优惠活动 |
| 私信 | 红色 | 消息通知 |
| 小秘书 | 白色 | 通知中心 |

---

## 四、管理后台功能

### 4.1 访问方式
```
URL: https://beicang-star-express.vercel.app/admin/login
账号: admin
密码: 123456
```

### 4.2 后台页面列表

| 序号 | 页面名称 | 路由 | 功能描述 |
|------|----------|------|----------|
| 1 | 仪表盘 | /admin | 数据统计概览 |
| 2 | 商品管理 | /admin/products | 商品CRUD操作 |
| 3 | 订单管理 | /admin/orders | 订单列表与处理 |
| 4 | 用户管理 | /admin/users | 用户列表管理 |
| 5 | 优惠券 | /admin/coupons | 优惠券创建发放 |
| 6 | 分类管理 | /admin/categories | 商品分类管理 |
| 7 | 支付管理 | /admin/payments | 支付方式配置 |
| 8 | 客服管理 | /admin/customer-service | 客服工单处理 |
| 9 | 公告管理 | /admin/announcements | 系统公告发布 |
| 10 | 活动管理 | /admin/activities | 营销活动配置 |
| 11 | 轮播管理 | /admin/banners | 首页轮播图管理 |
| 12 | 积分管理 | /admin/points | 积分规则配置 |
| 13 | 骑手管理 | /admin/riders | 跑腿骑手管理 |

---

## 五、部署说明

### 5.1 GitHub Actions 自动部署
每次推送到 `main` 分支会自动触发部署

### 5.2 必需的环境变量
在 GitHub 仓库 Settings → Secrets 中添加 `VERCEL_TOKEN`

---

## 六、常见问题

### 6.1 后台登录失败
- 使用正确账号： admin / 123456
- 尝试备用静态版本：admin-static.html

### 6.2 页面空白
- 按 Ctrl+Shift+R 强制刷新
- 清除浏览器缓存
- 使用隐身模式访问

---

## 七、GitHub 仓库

https://github.com/huaxiashanghui-a11y/beicang-star-express

---

*本文档最后更新于 2026-03-31*
