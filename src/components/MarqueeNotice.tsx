import React from 'react';
import { Volume2, ChevronRight } from 'lucide-react';

const notices = [
  '📢 木姐市集：每日新鲜蔬果上市，限时特惠！',
  '🏠 木姐房产：新增多套精品房源，拎包入住！',
  '🔄 换汇服务：实时汇率，诚信经营，安全可靠！',
  '🍜 美食推荐：木姐地道美食地图，网红店铺合集！',
  '📋 签证服务：木姐-瑞丽往返签证，一站式办理！',
  '🚗 汽车服务：木姐汽修保养，24小时道路救援！',
  '📱 二手市场：木姐同城交易，诚信保障！',
];

export default function MarqueeNotice() {
  return (
    <div className="bg-white border-b border-orange-100">
      <div className="max-w-lg mx-auto">
        <div className="relative flex items-center h-10 px-3">
          {/* Left Badge */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-3 border-r border-gray-200">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-bold whitespace-nowrap tracking-wide">
              公告消息
            </span>
          </div>

          {/* 水平滚动公告 - 从右向左 */}
          <div className="flex-1 relative overflow-hidden h-full ml-3">
            <div className="marquee-container">
              <div className="marquee-content">
                {[...notices, ...notices].map((notice, index) => (
                  <span key={index} className="inline-block whitespace-nowrap px-8 text-sm text-gray-700">
                    {notice}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right More Button */}
          <button className="flex-shrink-0 ml-2 flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-orange-600 transition-colors duration-200 bg-gray-50 rounded-full hover:bg-orange-50">
            <span>更多</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
