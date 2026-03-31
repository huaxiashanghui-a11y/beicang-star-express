# 管理后台使用手册

> 更新时间：2026-03-31

---

## 快速访问

### 在线地址
| 类型 | 地址 |
|------|------|
| React 后台 | https://beicang-star-express.vercel.app/admin/login |
| 静态备用版 | https://beicang-star-express.vercel.app/admin-static.html |

### 登录信息
```
用户名：admin
密码：123456
```

---

## 功能模块一览

### 1. 仪表盘 (/admin)
- 总销售额统计（带趋势变化）
- 今日订单数量
- 商品总数
- 用户总数
- 最近订单列表
- 热销商品排行
- 商品分类占比图

### 2. 商品管理 (/admin/products)
- 商品列表展示
- 搜索筛选
- 添加新商品
- 编辑商品信息
- 删除商品
- 上下架管理
- 库存显示

### 3. 订单管理 (/admin/orders)
- 订单统计卡片
- 订单状态筛选（待支付/处理中/已发货/已完成）
- 订单详情查看
- 订单发货操作
- 导出订单功能

### 4. 用户管理 (/admin/users)
- 用户统计概览
- 用户列表
- 用户状态管理（启用/禁用）
- 用户详情查看
- 导出用户数据

### 5. 优惠券 (/admin/coupons)
- 优惠券创建
- 优惠券列表
- 使用规则配置
- 发放管理

### 6. 分类管理 (/admin/categories)
- 分类列表
- 添加/编辑分类
- 分类图标设置
- 子分类管理

### 7. 支付管理 (/admin/payments)
- 支付方式列表
- KBZ Pay
- Wave Pay
- Visa / Mastercard
- PayPal

### 8. 客服管理 (/admin/customer-service)
- 客服工单列表
- 待处理会话
- 回复客户
- 历史记录

### 9. 公告管理 (/admin/announcements)
- 公告列表
- 发布新公告
- 公告类型（系统/活动/商品/会员）
- 浏览量统计

### 10. 活动管理 (/admin/activities)
- 活动列表
- 创建活动
- 活动时间设置
- 活动数据报表

### 11. 轮播管理 (/admin/banners)
- 轮播图列表
- 添加轮播图
- 投放时间设置
- 点击量统计

### 12. 积分管理 (/admin/points)
- 积分规则配置
- 积分记录查看
- 积分商品管理
- 总积分统计

### 13. 骑手管理 (/admin/riders)
- 骑手列表
- 在线/离线状态
- 今日接单统计
- 骑手评分
- 服务区域配置

---

## 注意事项

### 1. 离线模式
当前版本前端部署在 Vercel 静态托管，**后端 API 未部署**。
- 所有数据为本地演示数据
- 登录使用本地验证
- 部分数据操作仅在本地生效

### 2. 缓存问题
如果页面显示空白：
1. 按 Ctrl+Shift+R 强制刷新
2. 或使用 Ctrl+Shift+N 打开隐身窗口访问

### 3. 备用方案
如 React 后台无法使用，可使用静态备用版：
- admin-static.html：登录页
- admin-panel.html：管理面板

---

## 技术信息

- 前端框架：React + TypeScript + Tailwind CSS
- 路由：React Router v7
- 部署：Vercel
- CI/CD：GitHub Actions

---

*本手册最后更新于 2026-03-31*
