import React, { useState } from 'react';
import { Gift, X } from 'lucide-react';

export default function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* 福利悬浮按钮 - 单独一个，与底部TabBar对齐 */}
      <div className="fixed right-2 bottom-20 z-30">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 ${
            expanded ? 'ring-4 ring-white ring-offset-2' : ''
          }`}
        >
          <Gift className="w-6 h-6" />
        </button>

        {/* 福利面板 */}
        {expanded && (
          <div className="absolute right-16 bottom-0 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-bounce-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">福利中心</span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">专属福利 限时领取</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: '新人礼包', desc: '价值500元', color: 'from-orange-500 to-red-500' },
                    { title: '邀请有礼', desc: '各得50元', color: 'from-blue-500 to-purple-500' },
                    { title: '积分兑换', desc: '100抵1元', color: 'from-yellow-500 to-orange-500' },
                    { title: '每日抽奖', desc: 'iphone等你', color: 'from-green-500 to-teal-500' },
                  ].map((item, index) => (
                    <button
                      key={index}
                      className={`p-3 bg-gradient-to-br ${item.color} rounded-lg text-white text-center`}
                    >
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs opacity-90">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
