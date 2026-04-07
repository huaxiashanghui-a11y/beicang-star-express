/**
 * 汇率服务 - 从 exchangerate-api.com 获取实时汇率
 */
const https = require('https');
const http = require('http');

// API配置
const API_KEY = '3574c442886215ca6e78a329';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// 缓存
let cachedRates = null;
let lastUpdate = null;
let updateInterval = null;

// 默认汇率（API不可用时使用）
const DEFAULT_RATES = {
  USD: 1,
  CNY: 7.24,
  MMK: 2100,
  THB: 35.5,
  SGD: 1.34,
  MYR: 4.72,
  EUR: 0.92,
  VND: 24500,
};

// 汇率缓存对象
const exchangeRatesCache = {
  rates: { ...DEFAULT_RATES },
  updateTime: '',
  lastFetch: null,
};

/**
 * 获取汇率数据
 */
async function fetchRates() {
  return new Promise((resolve) => {
    const req = https.get(API_URL, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);

          if (result.result === 'success' && result.conversion_rates) {
            const rates = result.conversion_rates;
            cachedRates = {
              USD: rates.USD || 1,
              CNY: rates.CNY || 7.24,
              MMK: rates.MMK || 2100,
              THB: rates.THB || 35.5,
              SGD: rates.SGD || 1.34,
              MYR: rates.MYR || 4.72,
              EUR: rates.EUR || 0.92,
              VND: rates.VND || 24500,
            };
            lastUpdate = new Date().toISOString();

            // 更新缓存
            exchangeRatesCache.rates = { ...cachedRates };
            exchangeRatesCache.updateTime = lastUpdate;
            exchangeRatesCache.lastFetch = Date.now();

            console.log(`[汇率服务] 汇率已更新: USD基准, ${Object.keys(cachedRates).length}个货币`);
            resolve(cachedRates);
          } else {
            console.error('[汇率服务] API返回错误:', result);
            resolve(DEFAULT_RATES);
          }
        } catch (err) {
          console.error('[汇率服务] 解析失败:', err);
          resolve(DEFAULT_RATES);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[汇率服务] 网络错误:', err.message);
      resolve(DEFAULT_RATES);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.error('[汇率服务] 请求超时');
      resolve(DEFAULT_RATES);
    });
  });
}

/**
 * 初始化汇率服务
 */
function initExchangeRateService() {
  // 立即获取一次
  fetchRates();

  // 每60秒更新一次
  updateInterval = setInterval(fetchRates, 60 * 1000);

  console.log('[汇率服务] 已启动自动更新，间隔 60 秒');
}

/**
 * 获取当前汇率
 */
function getRates() {
  return cachedRates || DEFAULT_RATES;
}

/**
 * 计算换汇
 */
function calculateExchange(fromCurrency, toCurrency, amount) {
  const rates = getRates();

  // 如果是同一种货币
  if (fromCurrency === toCurrency) {
    return {
      fromAmount: amount,
      toAmount: amount,
      exchangeRate: 1,
      baseRate: 1,
      markupRate: 0,
      fee: 0,
    };
  }

  // 转换为美元再转换为目标货币
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // 基础汇率
  const baseRate = toRate / fromRate;

  // 加价比例 2%
  const markupRate = 0.02;
  const exchangeRate = baseRate * (1 + markupRate);

  // 计算手续费（按汇出货币收取0.5%）
  const fee = amount * 0.005;

  // 计算实际到账金额
  const actualAmount = amount - fee;
  const toAmount = actualAmount * exchangeRate;

  return {
    fromAmount: amount,
    toAmount: toAmount,
    exchangeRate: exchangeRate,
    baseRate: baseRate,
    markupRate: markupRate * 100,
    fee: fee,
  };
}

/**
 * 获取支持的货币列表
 */
function getSupportedCurrencies() {
  return [
    { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
    { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
    { code: 'MMK', name: '缅元', symbol: 'K', flag: '🇲🇲' },
    { code: 'THB', name: '泰铢', symbol: '฿', flag: '🇹🇭' },
    { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
    { code: 'MYR', name: '马来西亚林吉特', symbol: 'RM', flag: '🇲🇾' },
    { code: 'EUR', name: '欧元', symbol: '€', flag: '🇪🇺' },
    { code: 'VND', name: '越南盾', symbol: '₫', flag: '🇻🇳' },
  ];
}

module.exports = {
  initExchangeRateService,
  getRates,
  calculateExchange,
  getSupportedCurrencies,
  exchangeRatesCache,
};
