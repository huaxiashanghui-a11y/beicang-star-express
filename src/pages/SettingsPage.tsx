import { useState } from 'react'
import { Globe, Languages, Bell, Shield, Moon, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

export default function SettingsPage() {
  const { state, dispatch } = useApp()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('中文')
  const [currency, setCurrency] = useState('USD')

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Account & Security */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">账号与安全</span>
              </div>
              <span className="text-sm text-muted-foreground">修改密码、绑定手机</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-medium">国家与地区</span>
              </div>
              <select
                value={state.user?.address?.country || 'Myanmar'}
                className="bg-transparent text-sm text-muted-foreground outline-none"
              >
                <option value="Myanmar">缅甸</option>
                <option value="China">中国</option>
                <option value="Thailand">泰国</option>
                <option value="Singapore">新加坡</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language & Region */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-secondary" />
                <span className="font-medium">语言</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm text-muted-foreground outline-none"
              >
                <option value="中文">中文</option>
                <option value="English">English</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Thai">Thai</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">💰</span>
                <span className="font-medium">货币</span>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm text-muted-foreground outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="MMK">MMK (K)</option>
                <option value="THB">THB (฿)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-medium">消息通知</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-secondary" />
                <span className="font-medium">深色模式</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <button className="w-full flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">帮助中心</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">📜</span>
                <span className="font-medium">用户协议</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <div className="mx-4 mt-8 text-center text-sm text-muted-foreground">
        <p>北苍星际速充 v1.0.0</p>
        <p className="mt-1">© 2024 Beicang Star Express</p>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-8">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  )
}
