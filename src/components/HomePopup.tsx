import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface CouponItem {
  amount: number;
  rule: string;
  link: string;
}

interface PopupData {
  id: string;
  title: string;
  coupons: CouponItem[];
  frequency: 'once' | 'daily' | 'always';
}

interface HomePopupProps {
  data?: PopupData;
  /** 强制显示弹窗（用于调试） */
  forceShow?: boolean;
  /** 是否显示（默认true） */
  enabled?: boolean;
}

export default function HomePopup({ data, forceShow = false, enabled = true }: HomePopupProps) {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // 检查是否需要显示弹窗
  useEffect(() => {
    if (!data || !enabled) {
      setIsVisible(false);
      return;
    }

    // 强制显示模式（调试用）
    if (forceShow) {
      setIsVisible(true);
      return;
    }

    const storageKey = `popup_shown_${data.id}`;
    const lastShown = localStorage.getItem(storageKey);
    const now = Date.now();

    let shouldShow = false;

    // 开发模式下每次都显示
    if (import.meta.env.DEV) {
      shouldShow = true;
    } else {
      // 生产环境检查频次
      if (data.frequency === 'always') {
        shouldShow = true;
      } else if (data.frequency === 'daily') {
        // 检查是否今天已经显示过
        if (!lastShown) {
          shouldShow = true;
        } else {
          const lastShownDate = new Date(parseInt(lastShown)).toDateString();
          const today = new Date().toDateString();
          shouldShow = lastShownDate !== today;
        }
      } else if (data.frequency === 'once') {
        // 首次进入 - 24小时内不重复显示
        if (!lastShown) {
          shouldShow = true;
        } else {
          const timeDiff = now - parseInt(lastShown);
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          shouldShow = hoursDiff >= 24;
        }
      }
    }

    if (shouldShow && !hasShown) {
      setIsVisible(true);
      setHasShown(true);
      // 记录显示时间
      localStorage.setItem(storageKey, now.toString());
    }
  }, [data, forceShow, enabled, hasShown]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleClaimAll = useCallback(() => {
    if (!data) return;

    // 领取所有优惠券
    const newCoupons = data.coupons.map((coupon, index) => ({
      id: `coupon-${Date.now()}-${index}`,
      code: `COUPON${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name: `${coupon.amount}元优惠券`,
      description: coupon.rule,
      discount: coupon.amount,
      minAmount: 0,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      createdAt: new Date().toISOString(),
    }));

    newCoupons.forEach(coupon => {
      dispatch({
        type: 'ADD_COUPON',
        payload: coupon,
      });
    });

    // 关闭弹窗
    setIsVisible(false);

    // 显示领取成功提示（如果需要可以取消注释）
    // showToast('success', `成功领取${newCoupons.length}张优惠券`);
  }, [data, dispatch]);

  const handleUseCoupon = useCallback((link: string) => {
    setIsVisible(false);
    if (link && link !== '/') {
      navigate(link);
    }
  }, [navigate]);

  // 组件未激活时不渲染
  if (!data || !enabled) {
    return null;
  }

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={cn(
          'fixed inset-0 z-[9999] transition-all duration-300',
          isVisible
            ? 'bg-black/40 backdrop-blur-sm opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
      />

      {/* 弹窗主体 */}
      <div
        className={cn(
          'fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none transition-all duration-300',
          isVisible ? 'opacity-100' : 'opacity-0 scale-95'
        )}
      >
        <div
          className={cn(
            'relative w-full max-w-sm pointer-events-auto transition-transform duration-300',
            isVisible ? 'scale-100' : 'scale-90'
          )}
        >
          {/* 主卡片 */}
          <div className="bg-gradient-to-b from-yellow-100 via-orange-200 to-red-400 rounded-3xl overflow-hidden shadow-2xl">
            {/* 顶部横幅 */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-center">
              <h2 className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
                {data.title}
              </h2>
            </div>

            {/* 优惠券列表 */}
            <div className="px-4 pt-4 pb-2 space-y-3">
              {data.coupons.map((coupon, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-md"
                >
                  {/* 金额 */}
                  <div className="flex-shrink-0 text-center min-w-[60px]">
                    <span className="text-3xl font-bold text-orange-500">¥{coupon.amount}</span>
                  </div>

                  {/* 分隔线 */}
                  <div className="w-px h-12 bg-gray-200 flex-shrink-0" />

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium truncate">{coupon.rule}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {coupon.amount === 1 ? '下单即可立减配送费' : `满${coupon.amount * 10}元可用`}
                    </p>
                  </div>

                  {/* 使用按钮 */}
                  <button
                    onClick={() => handleUseCoupon(coupon.link)}
                    className="flex-shrink-0 px-4 py-2 bg-white border-2 border-red-400 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 active:scale-95 transition-all"
                  >
                    去使用
                  </button>
                </div>
              ))}
            </div>

            {/* 卡通形象装饰 */}
            <div className="absolute right-2 bottom-28 pointer-events-none select-none">
              <div className="w-16 h-16 bg-pink-300 rounded-full relative shadow-lg">
                {/* 耳朵 */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-pink-300 rounded-full border-2 border-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-300 rounded-full border-2 border-white" />
                {/* 表情 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🎀</span>
                </div>
              </div>
            </div>

            {/* 一键领取按钮 */}
            <div className="px-4 pb-6">
              <button
                onClick={handleClaimAll}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:from-orange-500 hover:to-orange-600 active:scale-[0.98] transition-all"
              >
                一键领取
              </button>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 active:scale-95 transition-all z-10 border-2 border-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
