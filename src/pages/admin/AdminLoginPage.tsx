import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);

    // 优先使用演示模式验证（不需要等待API）
    if (username === 'admin' && password === '123456') {
      const demoToken = 'demo-token-' + Date.now();
      const demoUser = {
        id: 'admin-1',
        username: 'admin',
        name: '演示管理员',
        role: 'super_admin'
      };
      localStorage.setItem('adminToken', demoToken);
      localStorage.setItem('adminUser', JSON.stringify(demoUser));
      navigate('/admin');
      return;
    }

    // 如果不是演示账号，尝试API登录
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('adminToken', data.data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
          navigate('/admin');
          return;
        }
      }
      setError('用户名或密码错误');
    } catch (err) {
      setError('用户名或密码错误（演示账号: admin / 123456）');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理后台</h1>
          <p className="text-gray-400">登录以继续管理您的商城</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </form>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-yellow-400 text-xs text-center mb-2 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              演示模式
            </p>
            <div className="flex justify-between text-gray-300 text-sm">
              <span>用户名: <span className="text-white">admin</span></span>
              <span>密码: <span className="text-white">123456</span></span>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 贝仓精选. 保留所有权利.
        </p>
      </div>
    </div>
  );
}
