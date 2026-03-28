import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Check, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { Address } from '@/types'

export default function AddressPage() {
  const { state, dispatch } = useApp()
  const { addresses } = state
  const [showForm, setShowForm] = useState(false)

  const handleSetDefault = (address: Address) => {
    addresses.forEach(a => {
      if (a.isDefault && a.id !== address.id) {
        dispatch({ type: 'UPDATE_ADDRESS', payload: { ...a, isDefault: false } })
      }
    })
    dispatch({ type: 'UPDATE_ADDRESS', payload: { ...address, isDefault: true } })
  }

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: id })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Address List */}
      <div className="p-4 space-y-3">
        {addresses.map((address) => (
          <Card key={address.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{address.name}</span>
                    <span className="text-muted-foreground">{address.phone}</span>
                    {address.isDefault && (
                      <Badge variant="success" className="text-[10px]">默认</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.country} {address.province} {address.city} {address.district}
                    <br />
                    {address.street} {address.postalCode}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSetDefault(address)}
                      className={`p-2 rounded-lg transition-colors ${
                        address.isDefault
                          ? 'bg-success/10 text-success'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                      <Trash2 className="w-4 h-4" onClick={() => handleDelete(address.id)} />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">暂无收货地址</h3>
            <p className="text-muted-foreground mb-6">添加收货地址以便更快下单</p>
            <Button
              variant="premium"
              onClick={() => setShowForm(true)}
              className="rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              添加地址
            </Button>
          </div>
        )}
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
            <h2 className="font-semibold">添加收货地址</h2>
            <button onClick={() => setShowForm(false)}>取消</button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">收货人</label>
              <input
                type="text"
                placeholder="请输入收货人姓名"
                className="w-full h-12 rounded-xl border-2 border-input bg-background px-4"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">手机号</label>
              <input
                type="tel"
                placeholder="请输入手机号"
                className="w-full h-12 rounded-xl border-2 border-input bg-background px-4"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">国家/地区</label>
              <select className="w-full h-12 rounded-xl border-2 border-input bg-background px-4">
                <option>缅甸</option>
                <option>中国</option>
                <option>泰国</option>
                <option>新加坡</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">省/州</label>
                <select className="w-full h-12 rounded-xl border-2 border-input bg-background px-4">
                  <option>仰光省</option>
                  <option>曼德勒省</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">城市</label>
                <select className="w-full h-12 rounded-xl border-2 border-input bg-background px-4">
                  <option>仰光</option>
                  <option>曼德勒</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">详细地址</label>
              <textarea
                placeholder="请输入详细地址"
                className="w-full h-24 rounded-xl border-2 border-input bg-background px-4 py-3 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">邮政编码</label>
              <input
                type="text"
                placeholder="请输入邮政编码"
                className="w-full h-12 rounded-xl border-2 border-input bg-background px-4"
              />
            </div>
            <Button
              variant="premium"
              size="lg"
              className="w-full h-14 rounded-xl mt-4"
              onClick={() => setShowForm(false)}
            >
              保存地址
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      {addresses.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-bottom">
          <div className="max-w-lg mx-auto px-4 py-3">
            <Button
              variant="premium"
              size="lg"
              className="w-full h-12 rounded-xl"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              添加新地址
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
