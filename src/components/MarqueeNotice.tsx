import React, { useEffect, useState } from 'react';
import { Volume2, ChevronRight } from 'lucide-react';

const notices = [
  '🎉 限时优惠：新人注册即送100元大礼包！',
  '📦 全场满500减50，满1000减120，上不封顶！',
  '🚚 今日下单，明日送达！偏远地区除外',
  '🎊 春季大促：数码产品全场8折起！',
  '💳 支持KBZ Pay、WavePay、Visa等多种支付',
  '📱 手机端专属优惠：APP下单再减10元',
];

export default function MarqueeNotice() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-orange-100">
      <div className="max-w-lg mx-auto">
        <div className="relative flex items-center h-10 px-4">
          {/* Left Badge */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-3 border-r border-gray-200 mr-3">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-bold whitespace-nowrap tracking-wide">
              公告
            </span>
          </div>

          {/* Scrolling Notice */}
          <div className="flex-1 relative overflow-hidden h-10">
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{
                transform: `translateY(-${currentIndex * 40}px)`,
              }}
            >
              {notices.map((notice, index) => (
                <div
                  key={index}
                  className="h-10 flex items-center"
                >
                  <span className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis pr-4 hover:text-orange-600 cursor-pointer transition-colors duration-200">
                    {notice}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right More Button */}
          <button className="flex-shrink-0 ml-2 flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-orange-600 transition-colors duration-200 bg-gray-50 rounded-full hover:bg-orange-50">
            <span>更多</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
