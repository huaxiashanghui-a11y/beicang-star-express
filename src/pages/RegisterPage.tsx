import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Phone, Lock, Mail, User, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import axios from 'axios'

// API 基础URL - 使用相对路径，生产环境通过vercel.json代理
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const sendCode = async () => {
    if (!phone) {
      setError('请输入手机号')
      return
    }
    setError('')
    setCountdown(60)
    try {
      await axios.post(`${API_BASE}/auth/send-code`, { phone })
    } catch (err) {
      console.error('发送验证码失败:', err)
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 调用后端注册API
      const response = await axios.post(`${API_BASE}/auth/register`, {
        phone,
        password,
        name: `用户${phone.slice(-4)}`
      })

      if (response.data.success) {
        const { user, token } = response.data.data

        // 保存token到localStorage
        localStorage.setItem('token', token)

        // 更新AppContext
        dispatch({ type: 'LOGIN', payload: user })

        setStep(3)
      } else {
        setError(response.data.error?.message || '注册失败')
      }
    } catch (err: any) {
      console.error('注册错误:', err)
      setError(err.response?.data?.error?.message || '注册失败，请检查网络连接')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 via-background to-background flex flex-col">
      {/* Hero Section */}
      <div className="relative px-6 pt-12 pb-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl gradient-secondary flex items-center justify-center shadow-xl shadow-secondary/30 mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gradient mb-2">创建账号</h1>
        <p className="text-muted-foreground text-sm">加入北苍星际速充，尽享购物乐趣</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Progress Steps */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 mt-2 text-xs text-muted-foreground">
          <span>验证手机</span>
          <span>设置密码</span>
          <span>完成注册</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8">
        {step === 1 && (
          <form className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-12 h-14 rounded-xl bg-white/80"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder="验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-12 h-14 rounded-xl bg-white/80"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={sendCode}
                disabled={countdown > 0}
                className="h-14 px-4 rounded-xl font-medium whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </div>

            <Button
              type="button"
              variant="premium"
              size="lg"
              className="w-full h-14 rounded-xl mt-6"
              onClick={() => setStep(2)}
              disabled={!phone || !code}
            >
              下一步
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="设置密码（8-20位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl bg-white/80"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 h-14 rounded-xl bg-white/80"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-primary text-primary focus:ring-primary mt-0.5"
              />
              <span className="text-sm text-muted-foreground">
                我已阅读并同意
                <Link to="/terms" className="text-primary mx-1">《用户协议》</Link>
                和
                <Link to="/privacy" className="text-primary mx-1">《隐私政策》</Link>
              </span>
            </label>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-xl"
                onClick={() => setStep(1)}
              >
                上一步
              </Button>
              <Button
                type="submit"
                variant="premium"
                size="lg"
                className="flex-1 h-14 rounded-xl"
                disabled={!agreed || password !== confirmPassword || password.length < 8 || isLoading}
              >
                {isLoading ? '注册中...' : '完成注册'}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-6 animate-bounce-in">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">注册成功</h2>
            <p className="text-muted-foreground mb-8">欢迎加入北苍星际速充</p>
            <Button
              variant="premium"
              size="lg"
              className="w-full h-14 rounded-xl"
              onClick={() => navigate('/')}
            >
              开始购物
            </Button>
          </div>
        )}
      </div>

      {/* Login Link */}
      {step < 3 && (
        <div className="px-6 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            已有账号?
            <Link to="/login" className="text-primary font-semibold ml-1 hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
