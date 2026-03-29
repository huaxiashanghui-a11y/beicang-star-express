import { useState } from 'react'
import { Globe, Languages, Bell, Shield, Moon, HelpCircle, LogOut, Lock, Mail, Phone as PhoneIcon, MessageSquare, UserCheck, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { state, dispatch } = useApp()
  const [darkMode, setDarkMode] = useState(state.user?.theme === 'dark')
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState(state.user?.language || '中文')
  const [country, setCountry] = useState(state.user?.country || 'Myanmar')
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [securityTab, setSecurityTab] = useState<'password' | 'phone' | 'email' | 'wechat' | 'telegram'>('password')
  const [securityForm, setSecurityForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: state.user?.phone || '',
    email: state.user?.email || '',
    wechat: state.user?.wechat || '',
    telegram: state.user?.telegram || '',
    code: '',
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  const handleThemeChange = (enabled: boolean) => {
    setDarkMode(enabled)
    dispatch({
      type: 'UPDATE_USER',
      payload: { theme: enabled ? 'dark' : 'light' }
    })
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSaveSecurity = (type: string) => {
    let message = ''
    switch (type) {
      case 'password':
        if (securityForm.newPassword !== securityForm.confirmPassword) {
          alert('两次密码输入不一致')
          return
        }
        if (securityForm.newPassword.length < 6) {
          alert('密码长度至少6位')
          return
        }
        message = '密码修改成功'
        break
      case 'phone':
        if (!securityForm.phone) {
          alert('请输入手机号')
          return
        }
        message = '手机号绑定成功'
        break
      case 'email':
        if (!securityForm.email || !securityForm.email.includes('@')) {
          alert('请输入正确的邮箱')
          return
        }
        message = '邮箱绑定成功'
        break
      case 'wechat':
        message = '微信绑定成功'
        break
      case 'telegram':
        message = 'Telegram绑定成功'
        break
    }

    dispatch({
      type: 'UPDATE_USER',
      payload: { ...securityForm }
    })
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      setShowSecurityModal(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Account & Security */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="w-full flex items-center justify-between p-4 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">账号与安全</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">修改密码、绑定手机</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-medium">国家与地区</span>
              </div>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  dispatch({
                    type: 'UPDATE_USER',
                    payload: { country: e.target.value }
                  })
                }}
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
                onChange={(e) => {
                  setLanguage(e.target.value)
                  dispatch({
                    type: 'UPDATE_USER',
                    payload: { language: e.target.value }
                  })
                }}
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
                className="bg-transparent text-sm text-muted-foreground outline-none"
                defaultValue="USD"
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
                className={cn(
                  'w-12 h-7 rounded-full transition-colors relative',
                  notifications ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-1',
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className={cn('w-5 h-5', darkMode ? 'text-primary' : 'text-secondary')} />
                <span className="font-medium">深色模式</span>
              </div>
              <button
                onClick={() => handleThemeChange(!darkMode)}
                className={cn(
                  'w-12 h-7 rounded-full transition-colors relative',
                  darkMode ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-1',
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  )}
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
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">📜</span>
                <span className="font-medium">用户协议</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
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

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSecurityModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl animate-slide-in-up max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold">账号与安全</h3>
              <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Security Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: 'password', icon: Lock, label: '密码' },
                { id: 'phone', icon: PhoneIcon, label: '手机' },
                { id: 'email', icon: Mail, label: '邮箱' },
                { id: 'wechat', icon: MessageSquare, label: '微信' },
                { id: 'telegram', icon: UserCheck, label: 'Telegram' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSecurityTab(tab.id as any)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-3 text-sm transition-colors',
                    securityTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {securityTab === 'password' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">当前密码</label>
                    <Input
                      type="password"
                      value={securityForm.oldPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                      placeholder="请输入当前密码"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">新密码</label>
                    <Input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="请输入新密码"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">确认密码</label>
                    <Input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </>
              )}

              {securityTab === 'phone' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">手机号</label>
                    <Input
                      type="tel"
                      value={securityForm.phone}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="请输入手机号"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={securityForm.code}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="验证码"
                      className="flex-1"
                    />
                    <Button variant="outline" className="whitespace-nowrap">
                      获取验证码
                    </Button>
                  </div>
                </>
              )}

              {securityTab === 'email' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">邮箱</label>
                    <Input
                      type="email"
                      value={securityForm.email}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="请输入邮箱"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={securityForm.code}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="验证码"
                      className="flex-1"
                    />
                    <Button variant="outline" className="whitespace-nowrap">
                      获取验证码
                    </Button>
                  </div>
                </>
              )}

              {securityTab === 'wechat' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">微信</label>
                    <Input
                      value={securityForm.wechat}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, wechat: e.target.value }))}
                      placeholder="请输入微信号"
                    />
                  </div>
                </>
              )}

              {securityTab === 'telegram' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Telegram</label>
                    <Input
                      value={securityForm.telegram}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, telegram: e.target.value }))}
                      placeholder="请输入Telegram用户名"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border">
              <Button
                className="w-full"
                onClick={() => handleSaveSecurity(securityTab)}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="bg-black/80 text-white px-8 py-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
