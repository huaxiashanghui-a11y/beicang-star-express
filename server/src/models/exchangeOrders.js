/**
 * 数据存储模型 - 换汇订单
 */
const fs = require('fs');
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../data');

// 确保数据目录存在
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// 基础数据库类
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
    return [];
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
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
    const item = {
      id: data.id || `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(item);
    this.save();
    return item;
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
}

// 换汇订单数据库
class ExchangeOrdersDB extends Database {
  constructor() {
    super('exchange_orders');
  }

  findByUser(userId) {
    return this.data.filter(item => item.userId === userId);
  }
}

module.exports = {
  exchangeOrdersDB: new ExchangeOrdersDB()
};
