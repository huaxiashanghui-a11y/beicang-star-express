import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Phone, Lock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import { currentUser } from '@/data/mockData'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: currentUser })
      setIsLoading(false)
      navigate('/')
    }, 1000)
  }

  const handleSocialLogin = (provider: string) => {
    dispatch({ type: 'LOGIN', payload: currentUser })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-12 text-center">
        <div className="w-24 h-24 mx-auto rounded-3xl gradient-hero flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 animate-bounce-in">
          <span className="text-white font-bold text-3xl">BC</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">欢迎回来</h1>
        <p className="text-muted-foreground">登录北苍星际速充，探索全球好物</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 pb-8">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-white/80 backdrop-blur"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 rounded-xl bg-white/80 backdrop-blur"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
              <span className="text-muted-foreground">记住我</span>
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              忘记密码?
            </Link>
          </div>

          <Button
            type="submit"
            variant="premium"
            size="lg"
            className="w-full h-14 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                登录中...
              </span>
            ) : (
              '登录'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">或</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSocialLogin('wechat')}
            className="flex flex-col items-center justify-center h-16 rounded-xl bg-[#07C160]/10 hover:bg-[#07C160]/20 transition-colors"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs text-muted-foreground mt-1">微信</span>
          </button>
          <button
            onClick={() => handleSocialLogin('telegram')}
            className="flex flex-col items-center justify-center h-16 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 transition-colors"
          >
            <span className="text-2xl">📱</span>
            <span className="text-xs text-muted-foreground mt-1">Telegram</span>
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="flex flex-col items-center justify-center h-16 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs text-muted-foreground mt-1">Facebook</span>
          </button>
        </div>

        {/* Customer Service */}
        <div className="mt-6 flex items-center justify-center">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-4 h-4" />
            联系客服
          </button>
        </div>
      </div>

      {/* Register Link */}
      <div className="px-6 pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          还没有账号?
          <Link to="/register" className="text-primary font-semibold ml-1 hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}
