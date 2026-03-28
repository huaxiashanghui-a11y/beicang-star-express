import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Gift, Phone, X, Send, Minus } from 'lucide-react';

export default function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [showMiniApp, setShowMiniApp] = useState(false);
  const [activeTab, setActiveTab] = useState<'service' | 'cart' | 'gift'>('service');

  const quickActions = [
    { icon: MessageCircle, label: '客服', color: 'bg-green-500', id: 'service' },
    { icon: ShoppingBag, label: '购物车', color: 'bg-orange-500', id: 'cart' },
    { icon: Gift, label: '福利', color: 'bg-purple-500', id: 'gift' },
  ];

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-2 bottom-20 z-40 flex flex-col gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeTab === action.id && expanded;
          return (
            <button
              key={action.id}
              onClick={() => {
                setActiveTab(action.id as any);
                setExpanded(!expanded);
              }}
              className={`w-12 h-12 ${action.color} rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 ${
                isActive ? 'ring-4 ring-white/50' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}

        {/* Expand Panel */}
        {expanded && (
          <div className="absolute right-14 bottom-0 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-bounce-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTab === 'service' && <MessageCircle className="w-5 h-5" />}
                {activeTab === 'cart' && <ShoppingBag className="w-5 h-5" />}
                {activeTab === 'gift' && <Gift className="w-5 h-5" />}
                <span className="font-semibold">
                  {activeTab === 'service' && '在线客服'}
                  {activeTab === 'cart' && '最近浏览'}
                  {activeTab === 'gift' && '福利中心'}
                </span>
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
              {activeTab === 'service' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">您好！有什么可以帮您？</p>
                  <div className="space-y-2">
                    {[
                      '订单问题咨询',
                      '商品问题咨询',
                      '退换货申请',
                      '配送问题',
                    ].map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      在线聊天
                    </button>
                    <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      电话客服
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'cart' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">您最近浏览的商品</p>
                  <div className="space-y-3">
                    {[
                      { name: 'iPhone 15 Pro Max', price: '¥8999' },
                      { name: 'MacBook Pro 14', price: '¥12999' },
                      { name: 'AirPods Pro 2', price: '¥1699' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="text-sm text-orange-600 font-semibold">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium">
                    查看购物车
                  </button>
                </div>
              )}

              {activeTab === 'gift' && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
