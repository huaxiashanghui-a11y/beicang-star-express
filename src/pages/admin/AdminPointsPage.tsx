import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Gift } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminPointsPage() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules] = useState([
    { id: 'R001', name: '购物返积分', points: 100, description: '每消费1元返1积分', status: '启用' },
    { id: 'R002', name: '新用户注册', points: 500, description: '注册即送500积分', status: '启用' },
    { id: 'R003', name: '商品评价', points: 50, description: '完成商品评价返50积分', status: '启用' },
    { id: 'R004', name: '邀请好友', points: 200, description: '邀请好友注册送200积分', status: '启用' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">积分管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理积分规则和用户积分</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />添加规则</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,234,567</p>
              <p className="text-gray-500 text-sm">总积分发放</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 text-xl font-bold">✓</div>
            <div>
              <p className="text-2xl font-bold">876,543</p>
              <p className="text-gray-500 text-sm">已使用积分</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">567</p>
              <p className="text-gray-500 text-sm">积分商品</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-xl font-bold">人</div>
            <div>
              <p className="text-2xl font-bold">8,542</p>
              <p className="text-gray-500 text-sm">参与用户</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('rules')} className={`px-6 py-3 font-medium ${activeTab === 'rules' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>积分规则</button>
          <button onClick={() => setActiveTab('records')} className={`px-6 py-3 font-medium ${activeTab === 'records' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>积分记录</button>
          <button onClick={() => setActiveTab('products')} className={`px-6 py-3 font-medium ${activeTab === 'products' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}>积分商品</button>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规则名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{rule.name}</td>
                  <td className="px-6 py-4 text-orange-500 font-semibold">+{rule.points}</td>
                  <td className="px-6 py-4 text-gray-600">{rule.description}</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{rule.status}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-2"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
