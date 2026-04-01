import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

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
}

export default function HomePopup({ data }: HomePopupProps) {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  // 检查是否需要显示弹窗
  useEffect(() => {
    if (!data) return;

    const storageKey = `popup_shown_${data.id}`;
    const lastShown = localStorage.getItem(storageKey);
    const now = new Date().getTime();

    let shouldShow = false;

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

    if (shouldShow) {
      setIsVisible(true);
      // 记录显示时间
      localStorage.setItem(storageKey, now.toString());
    }
  }, [data]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaimAll = () => {
    // 领取所有优惠券
    data?.coupons.forEach(coupon => {
      dispatch({
        type: 'ADD_COUPON',
        payload: {
          id: `coupon-${Date.now()}-${coupon.amount}`,
          code: `COUPON${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          name: `${coupon.amount}元优惠券`,
          description: coupon.rule,
          discount: coupon.amount,
          minAmount: 0,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isUsed: false,
          createdAt: new Date().toISOString(),
        }
      });
    });
    setIsVisible(false);
  };

  const handleUseCoupon = (link: string) => {
    setIsVisible(false);
    navigate(link);
  };

  if (!isVisible || !data) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Popup */}
      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Main Card */}
        <div className="bg-gradient-to-b from-yellow-100 via-orange-200 to-red-400 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-center">
            <h2 className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
              {data.title}
            </h2>
          </div>

          {/* Coupon List */}
          <div className="px-4 pb-4 space-y-3">
            {data.coupons.map((coupon, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-md"
              >
                {/* Amount */}
                <div className="flex-shrink-0 text-center">
                  <span className="text-3xl font-bold text-orange-500">¥{coupon.amount}</span>
                </div>

                {/* Divider */}
                <div className="w-px h-12 bg-gray-200" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate">{coupon.rule}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {coupon.amount === 1 ? '下单即可立减配送费' : `满${coupon.amount * 10}元可用`}
                  </p>
                </div>

                {/* Use Button */}
                <button
                  onClick={() => handleUseCoupon(coupon.link)}
                  className="flex-shrink-0 px-4 py-2 bg-white border-2 border-red-400 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 active:scale-95 transition-all"
                >
                  去使用
                </button>
              </div>
            ))}
          </div>

          {/* Cartoon Character */}
          <div className="absolute right-2 bottom-24 pointer-events-none">
            <div className="relative">
              {/* Simple cartoon bear */}
              <div className="w-16 h-16 bg-pink-300 rounded-full relative">
                {/* Ears */}
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-pink-300 rounded-full" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-300 rounded-full" />
                {/* Face */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl">🎀</div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <div className="px-4 pb-6">
            <button
              onClick={handleClaimAll}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:from-orange-500 hover:to-orange-600 active:scale-[0.98] transition-all"
            >
              一键领取
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
