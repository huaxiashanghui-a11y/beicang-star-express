const fs = require('fs');
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../data');

// 确保数据目录存在
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// 读取数据
function readData(filename) {
  const filePath = path.join(DB_PATH, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// 写入数据
function writeData(filename, data) {
  const filePath = path.join(DB_PATH, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 数据库操作类
class Database {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DB_PATH, `${name}.json`);
    this.data = this.load();
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    return this.getDefaultData();
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  getDefaultData() {
    return [];
  }

  find(query) {
    return this.data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  findOne(query) {
    return this.find(query)[0];
  }

  findById(id) {
    return this.data.find(item => item.id === id);
  }

  create(data) {
    this.data.push(data);
    this.save();
    return data;
  }

  update(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.data[index];
    }
    return null;
  }

  delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  clear() {
    this.data = [];
    this.save();
  }
}

// 用户数据库
class UsersDB extends Database {
  constructor() {
    super('users');
  }

  getDefaultData() {
    return [
      {
        id: 'user-1',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '+95 9 123 4567',
        password: '$2a$10$8K1p/a0dL1LXMIgZ7f7PN.8XvdFvJCRMr4vGf0vLPEZVYj8L6wQPa', // 123456
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z'
      }
    ];
  }
}

// 商品数据库
class ProductsDB extends Database {
  constructor() {
    super('products');
  }

  getDefaultData() {
    return [
      {
        id: 'prod-1',
        name: 'iPhone 15 Pro Max 256GB',
        description: '全新iPhone 15 Pro Max，搭载A17 Pro芯片，钛金属设计，专业级摄像系统。支持动作模式视频拍摄，让你轻松记录精彩瞬间。',
        price: 1299000,
        originalPrice: 1399000,
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop',
        ],
        category: '电子产品',
        subcategory: '手机',
        rating: 4.9,
        reviewCount: 2341,
        sales: 8562,
        stock: 128,
        specifications: [
          { name: '存储', value: '256GB' },
          { name: '颜色', value: '原色钛金属' },
          { name: '芯片', value: 'A17 Pro' },
        ],
        seller: { id: 'seller-1', name: 'Apple官方旗舰店', avatar: '🍎', rating: 4.9, products: 156 },
        tags: ['热门', '新品', '官方正品'],
        isHot: true,
        isNew: true,
        discount: 7,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-2',
        name: '华为 Mate 60 Pro 12GB+512GB',
        description: '华为Mate 60 Pro，麒麟9000S芯片，超光变XMAGE影像，卫星通话，玄武架构。',
        price: 799900,
        originalPrice: 899900,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        ],
        category: '电子产品',
        subcategory: '手机',
        rating: 4.8,
        reviewCount: 1892,
        sales: 6543,
        stock: 256,
        specifications: [
          { name: '存储', value: '512GB' },
          { name: '颜色', value: '雅丹黑' },
          { name: '芯片', value: '麒麟9000S' },
        ],
        seller: { id: 'seller-2', name: '华为官方旗舰店', avatar: '📱', rating: 4.8, products: 234 },
        tags: ['热门', '国产旗舰'],
        isHot: true,
        discount: 11,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-3',
        name: '耐克 Air Max 270 运动鞋',
        description: '耐克经典Air Max 270男子运动鞋，Max Air气垫设计，舒适缓震，时尚百搭。',
        price: 129900,
        originalPrice: 169900,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
        ],
        category: '服装',
        subcategory: '运动鞋',
        rating: 4.7,
        reviewCount: 3256,
        sales: 12089,
        stock: 342,
        specifications: [
          { name: '尺码', value: '42' },
          { name: '颜色', value: '黑红白' },
          { name: '材质', value: '合成革+网布' },
        ],
        seller: { id: 'seller-3', name: '耐克运动专营店', avatar: '👟', rating: 4.7, products: 567 },
        tags: ['热销', '运动'],
        isHot: true,
        discount: 24,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-4',
        name: '雅诗兰黛 小棕瓶精华液 50ml',
        description: '雅诗兰黛明星产品小棕瓶精华，修护肌肤，深层保湿，淡化细纹，提升肌肤屏障。',
        price: 89900,
        originalPrice: 115000,
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
        ],
        category: '美妆',
        subcategory: '护肤',
        rating: 4.9,
        reviewCount: 8921,
        sales: 25678,
        stock: 523,
        specifications: [
          { name: '容量', value: '50ml' },
          { name: '功效', value: '修护保湿' },
        ],
        seller: { id: 'seller-4', name: '雅诗兰黛官方旗舰店', avatar: '💄', rating: 4.9, products: 189 },
        tags: ['热销', '美妆大牌'],
        isHot: true,
        discount: 22,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-5',
        name: '戴森 V15 Detect 无线吸尘器',
        description: '戴森V15 Detect无绳吸尘器，激光探测技术，智能显示，强劲吸力，全新HEPA过滤系统。',
        price: 549000,
        originalPrice: 649000,
        images: [
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=600&fit=crop',
        ],
        category: '家居',
        subcategory: '清洁电器',
        rating: 4.8,
        reviewCount: 2341,
        sales: 4532,
        stock: 89,
        specifications: [
          { name: '续航', value: '60分钟' },
          { name: '吸力', value: '230AW' },
        ],
        seller: { id: 'seller-5', name: '戴森官方旗舰店', avatar: '🏠', rating: 4.8, products: 45 },
        tags: ['高端', '智能家居'],
        isHot: true,
        discount: 15,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-6',
        name: '索尼 WH-1000XM5 降噪耳机',
        description: '索尼旗舰级无线降噪耳机，全新设计驱动单元，业界领先降噪技术，30小时续航。',
        price: 299900,
        originalPrice: 349900,
        images: [
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        ],
        category: '电子产品',
        subcategory: '耳机',
        rating: 4.9,
        reviewCount: 5678,
        sales: 8901,
        stock: 234,
        specifications: [
          { name: '降噪', value: '主动降噪' },
          { name: '续航', value: '30小时' },
          { name: '蓝牙', value: '5.2' },
        ],
        seller: { id: 'seller-6', name: '索尼数码专营', avatar: '🎧', rating: 4.9, products: 345 },
        tags: ['热门', '音频设备'],
        isHot: true,
        discount: 14,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-7',
        name: 'MacBook Pro 14英寸 M3 Pro',
        description: '苹果MacBook Pro 14英寸，搭载M3 Pro芯片，18小时电池续航，Liquid视网膜XDR显示屏。',
        price: 1699900,
        originalPrice: 1899900,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop',
        ],
        category: '电子产品',
        subcategory: '电脑',
        rating: 4.9,
        reviewCount: 3456,
        sales: 5678,
        stock: 67,
        specifications: [
          { name: '芯片', value: 'M3 Pro' },
          { name: '内存', value: '18GB' },
          { name: '存储', value: '512GB' },
        ],
        seller: { id: 'seller-1', name: 'Apple官方旗舰店', avatar: '🍎', rating: 4.9, products: 156 },
        tags: ['热门', '专业级'],
        isHot: true,
        isNew: true,
        discount: 11,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-8',
        name: '爱他美 婴儿配方奶粉 3段 800g',
        description: '德国爱他美婴儿配方奶粉3段，专为10-12个月宝宝设计，含DHA、益生元组合。',
        price: 25900,
        originalPrice: 29900,
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
        ],
        category: '母婴',
        subcategory: '奶粉',
        rating: 4.8,
        reviewCount: 12345,
        sales: 45678,
        stock: 1024,
        specifications: [
          { name: '段数', value: '3段' },
          { name: '净含量', value: '800g' },
          { name: '产地', value: '德国' },
        ],
        seller: { id: 'seller-8', name: '爱他美官方旗舰店', avatar: '🍼', rating: 4.8, products: 56 },
        tags: ['母婴必备', '进口'],
        isHot: true,
        discount: 13,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-9',
        name: '新西兰进口奇异果 12粒装',
        description: '正宗新西兰进口奇异果，果肉金黄，香甜多汁，富含维生素C，单果重约100g。',
        price: 8900,
        originalPrice: 12900,
        images: [
          'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=600&h=600&fit=crop',
        ],
        category: '食品',
        subcategory: '水果',
        rating: 4.7,
        reviewCount: 5678,
        sales: 23456,
        stock: 2048,
        specifications: [
          { name: '产地', value: '新西兰' },
          { name: '数量', value: '12粒' },
          { name: '规格', value: '约100g/粒' },
        ],
        seller: { id: 'seller-9', name: '鲜果汇', avatar: '🍊', rating: 4.7, products: 123 },
        tags: ['进口', '新鲜'],
        discount: 31,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      },
      {
        id: 'prod-10',
        name: '北欧风实木餐桌 1.4米',
        description: '北欧简约风格实木餐桌，优质白橡木材质，环保水性漆，大容量储物空间，适合4-6人使用。',
        price: 289900,
        originalPrice: 359900,
        images: [
          'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&h=600&fit=crop',
        ],
        category: '家居',
        subcategory: '家具',
        rating: 4.6,
        reviewCount: 892,
        sales: 1234,
        stock: 45,
        specifications: [
          { name: '材质', value: '白橡木' },
          { name: '尺寸', value: '140x80x75cm' },
        ],
        seller: { id: 'seller-7', name: '北欧家具馆', avatar: '🪑', rating: 4.6, products: 234 },
        tags: ['北欧风', '实木'],
        discount: 19,
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z'
      }
    ];
  }
}

// 分类数据库
class CategoriesDB extends Database {
  constructor() {
    super('categories');
  }

  getDefaultData() {
    return [
      { id: 'cat-1', name: '服装', icon: '👕', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop' },
      { id: 'cat-2', name: '电子产品', icon: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' },
      { id: 'cat-3', name: '家居', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
      { id: 'cat-4', name: '美妆', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop' },
      { id: 'cat-5', name: '食品', icon: '🍎', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
      { id: 'cat-6', name: '运动', icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-fffceb5efa23?w=400&h=300&fit=crop' },
      { id: 'cat-7', name: '母婴', icon: '👶', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop' },
      { id: 'cat-8', name: '图书', icon: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop' },
    ];
  }
}

// 导出数据库实例
module.exports = {
  usersDB: new UsersDB(),
  productsDB: new ProductsDB(),
  categoriesDB: new CategoriesDB(),
  ordersDB: new Database('orders'),
  cartDB: new Database('cart'),
  addressesDB: new Database('addresses'),
  couponsDB: new Database('coupons'),
  notificationsDB: new Database('notifications'),
};
