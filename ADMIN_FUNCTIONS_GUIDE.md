# 管理后台功能详细文档

> 更新时间：2026-03-31
> 版本：v1.0.0

---

## 1. 仪表盘 (/admin)

### 功能逻辑
- 加载4个核心统计指标：总销售额、今日订单、商品数量、用户总数
- 加载最近5条订单和热销5个商品
- 支持刷新数据功能

### API响应
```typescript
GET /api/admin/stats/dashboard
Response: {
  stats: { totalSales, todayOrders, totalProducts, totalUsers, salesChange, ordersChange },
  recentOrders: [{ id, userName, total, status, createdAt }],
  topProducts: [{ name, sales, price }]
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击统计卡片 | 跳转到对应管理页面 |
| 点击刷新按钮 | 重新加载所有数据，显示加载动画 |
| API失败时 | 自动使用演示数据 |

---

## 2. 商品管理 (/admin/products)

### 功能逻辑
- 显示商品列表表格（名称、分类、价格、库存、销量、状态）
- 支持搜索商品名称和按分类筛选

### 数据结构
```typescript
Product: { id, name, category, price, stock, sales, status, image }
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加商品" | 打开添加商品弹窗 |
| 点击查看图标 | 打开商品详情弹窗 |
| 点击编辑图标 | 打开编辑商品弹窗 |
| 点击删除图标 | 显示删除确认弹窗 |
| 库存<50时 | 库存数字显示红色警告 |

---

## 3. 订单管理 (/admin/orders)

### 功能逻辑
- 显示4个订单状态统计：待支付、处理中、已发货、已完成
- 订单列表支持按订单号/用户名搜索和按状态筛选
- 显示支付方式、订单金额、时间等详情

### 数据结构
```typescript
Order: { id, user, phone, total, status, payment, date }
Status: '待支付' | '处理中' | '已发货' | '已完成' | '已取消'
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"导出订单" | 导出订单数据 |
| 点击查看图标 | 打开订单详情弹窗 |
| 状态筛选 | 实时过滤订单列表 |

---

## 4. 用户管理 (/admin/users)

### 功能逻辑
- 显示3个用户统计：总用户数、活跃用户、本月新增
- 用户列表支持搜索（用户名/手机/邮箱）和按状态筛选
- 支持禁用/启用用户

### 数据结构
```typescript
User: { id, name, phone, email, orders, spent, status, registered }
Status: '正常' | '禁用'
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"导出用户" | 导出用户数据CSV |
| 点击查看图标 | 打开用户详情弹窗 |
| 点击禁用/启用图标 | 切换用户状态，显示Toast提示 |

---

## 5. 优惠券管理 (/admin/coupons)

### 功能逻辑
- 优惠券卡片展示：名称、类型、折扣、使用条件、领取进度
- 支持创建、编辑、删除优惠券
- 自动根据时间判断状态：进行中/未开始/已结束

### 数据结构
```typescript
Coupon: {
  id: string
  name: string
  type: '折扣' | '满减'
  discount: string
  minAmount: number
  maxDiscount: number
  total: number
  claimed: number
  startDate: string
  endDate: string
  status: '进行中' | '已结束' | '未开始'
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"创建优惠券" | 打开创建弹窗，包含所有字段表单 |
| 点击"复制" | 复制优惠券代码到剪贴板 |
| 点击"详情" | 打开详情弹窗 |
| 点击"编辑" | 打开编辑弹窗，预填当前数据 |
| 点击"删除" | 打开删除确认弹窗 |
| 点击保存 | 验证必填字段，保存后显示成功Toast |

---

## 6. 分类管理 (/admin/categories)

### 功能逻辑
- 显示分类列表（图标、名称、子类数量、商品数、状态）
- 统计：一级分类、二级分类、商品总数、本月新增

### 数据结构
```typescript
Category: { id, name, icon, subCount, productCount, status }
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加分类" | 打开添加分类弹窗 |
| 点击编辑图标 | 打开编辑分类弹窗 |
| 点击删除图标 | 显示删除确认弹窗 |

---

## 7. 支付管理 (/admin/payments)

### 功能逻辑
- 支付方式卡片展示：图标、名称、描述、交易统计
- 支持添加、编辑、删除支付方式
- 支持启用/禁用支付方式
- 显示手续费率、单笔限额、日限额

### 数据结构
```typescript
Payment: {
  id: string
  name: string
  description: string
  icon: string
  status: '启用' | '禁用'
  transactionFee: number
  minAmount: number
  maxAmount: number
  dailyLimit: number
  todayVolume: number
  orderCount: number
  color: string
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加支付方式" | 打开添加弹窗，可选图标和颜色 |
| 点击"启用/禁用"图标 | 切换状态，显示Toast提示 |
| 点击"详情" | 显示完整支付方式信息 |
| 点击"编辑" | 打开编辑弹窗 |
| 点击"删除" | 显示删除确认弹窗 |

---

## 8. 客服管理 (/admin/customer-service)

### 功能逻辑
- 左侧：客服人员列表（头像、姓名、部门、状态、统计数据）
- 右侧：待处理会话列表
- 支持切换客服在线状态
- 自动计算满意度平均值

### 数据结构
```typescript
Staff: {
  id: string
  name: string
  avatar: string
  role: string
  status: '在线' | '离线' | '忙碌'
  department: string
  phone: string
  email: string
  todayConversations: number
  avgResponseTime: string
  satisfaction: number
  unresolved: number
}

Chat: {
  id: string
  user: string
  message: string
  time: string
  status: '待回复' | '处理中' | '已回复'
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加客服" | 打开添加客服弹窗 |
| 点击"详情" | 显示客服详细信息 |
| 点击"编辑" | 打开编辑弹窗 |
| 点击状态切换 | 循环切换：离线→在线→忙碌 |
| 点击"回复" | 打开回复会话弹窗 |

---

## 9. 公告管理 (/admin/announcements)

### 功能逻辑
- 公告列表：标题、类型、状态、浏览量、发布时间
- 统计：全部公告、已发布、草稿、总浏览量
- 支持按类型筛选

### 数据结构
```typescript
Announcement: {
  id: string
  title: string
  type: '系统' | '活动' | '商品' | '会员'
  status: '已发布' | '草稿'
  views: number
  date: string
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"发布公告" | 打开发布公告弹窗 |
| 点击查看图标 | 打开公告详情弹窗 |
| 点击编辑图标 | 打开编辑公告弹窗 |
| 点击删除图标 | 显示删除确认弹窗 |

---

## 10. 活动管理 (/admin/activities)

### 功能逻辑
- 活动卡片展示：Banner图、活动名称、描述、统计数据
- 支持5种活动类型：秒杀、新人、邀请、节日、满减
- 自动根据时间判断状态
- 支持立即开始/暂停活动

### 数据结构
```typescript
Activity: {
  id: string
  name: string
  description: string
  type: 'flash' | 'newuser' | 'invite' | 'festival' | 'discount'
  banner: string
  status: '进行中' | '未开始' | '已结束'
  startTime: string
  endTime: string
  participants: number
  orders: number
  revenue: number
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"创建活动" | 打开创建弹窗，设置类型、时间、Banner |
| 点击"详情" | 显示活动完整信息和统计数据 |
| 点击"编辑" | 打开编辑弹窗 |
| 点击"暂停" | 将活动结束时间设为当前时间 |
| 点击"立即开始" | 将活动开始时间设为当前时间 |
| 点击"删除" | 显示删除确认弹窗 |

---

## 11. 轮播管理 (/admin/banners)

### 功能逻辑
- 轮播图卡片展示：Banner预览、标题、链接类型、点击量
- 支持4种链接类型：活动页、分类页、商品页、个人中心
- 支持拖拽排序

### 数据结构
```typescript
Banner: {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  linkType: '活动页' | '分类页' | '商品页' | '个人中心'
  position: number
  status: '显示' | '隐藏' | '草稿'
  startTime: string
  endTime: string
  clicks: number
  gradient: string
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加轮播图" | 打开添加弹窗，可选背景渐变色 |
| 点击"预览" | 打开Banner详情弹窗 |
| 点击"显示/隐藏" | 切换显示状态 |
| 点击"发布" | 将草稿状态改为显示 |
| 点击"编辑" | 打开编辑弹窗 |
| 点击"删除" | 显示删除确认弹窗 |

---

## 12. 积分管理 (/admin/points)

### 功能逻辑
- 3个Tab页：积分规则、积分记录、积分商品
- 统计：总积分发放、已使用积分、积分商品、参与用户
- 积分规则列表：规则名称、积分值、说明、状态

### 数据结构
```typescript
PointRule: { id, name, points, description, status }
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击Tab标签 | 切换显示对应Tab内容 |
| 点击"添加规则" | 打开添加规则弹窗 |
| 点击编辑图标 | 打开编辑规则弹窗 |
| 点击删除图标 | 显示删除确认弹窗 |

---

## 13. 骑手管理 (/admin/riders)

### 功能逻辑
- 骑手列表：姓名、头像、手机号、评分、订单量、状态、服务区域
- 统计：总骑手数、在线骑手、今日订单、完成订单
- 支持搜索和按状态筛选

### 数据结构
```typescript
Rider: {
  id: string
  name: string
  phone: string
  avatar: string
  rating: number
  totalOrders: number
  todayOrders: number
  status: 'active' | 'busy' | 'inactive' // 在线/忙碌/离线
  region: string
  joinDate: string
}
```

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击"添加骑手" | 打开添加骑手弹窗表单 |
| 点击"编辑" | 打开编辑骑手弹窗 |
| 点击"删除" | 显示删除确认弹窗 |
| 状态筛选 | 实时过滤骑手列表 |

---

## 14. 权限管理 (/admin/permissions)

### 功能逻辑
- 左右两栏：用户端(10个) + 管理后台(14个)
- 每个功能支持开启/关闭
- 支持批量开启/关闭分类下所有权限
- 配置保存到localStorage

### 数据结构
```typescript
Permission: { id: string, label: string, enabled: boolean }
PermissionCategory: {
  id: string
  label: string
  items: Permission[]
}
```

### 用户端功能模块
| ID | 功能名称 |
|----|----------|
| home | 首页（商品展示、分类、搜索） |
| product-detail | 商品详情页 |
| cart | 购物车 |
| checkout | 下单结算 |
| orders | 订单管理 |
| profile | 个人中心 |
| coupons | 优惠券 |
| notifications | 消息通知 |
| activities | 活动中心 |
| marquee | 跑马灯公告 |

### 管理后台功能模块
| ID | 功能名称 |
|----|----------|
| dashboard | 仪表盘（销售统计） |
| products | 商品管理 |
| orders | 订单管理 |
| users | 用户管理 |
| coupons | 优惠券管理 |
| categories | 分类管理 |
| payments | 支付管理 |
| customer-service | 客服管理 |
| announcements | 公告管理 |
| activities | 活动管理 |
| banners | 轮播管理 |
| points | 积分管理 |
| riders | 骑手管理 |
| permissions | 权限管理 |

### 用户交互
| 操作 | 响应 |
|------|------|
| 点击复选框 | 切换单个权限开关 |
| 点击"全部启用" | 开启分类下所有权限 |
| 点击"全部禁用" | 关闭分类下所有权限 |
| 点击"保存配置" | 保存到localStorage，显示成功提示 |
| 点击"重置为默认" | 恢复所有权限为默认状态（全部启用） |

---

## 公共交互组件

### Toast 提示
- 成功：绿色背景 + 白色文字 + 勾选图标
- 错误：红色背景 + 白色文字 + 警告图标
- 自动3秒后消失

### 模态框
- 黑色半透明遮罩背景
- 白色圆角卡片容器
- 右上角关闭按钮
- 底部操作按钮区

### 确认删除
- 红色警告图标
- 显示待删除项目名称
- 取消/确认两个按钮

---

*本文档最后更新于 2026-03-31*
