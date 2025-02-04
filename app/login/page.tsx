"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import AuthLayout from "../components/AuthLayout"
import { useRouter } from "next/navigation"
import { loginUser } from "../services/api"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.username)) {
      setError("请输入正确的手机号码");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        phone: formData.username,  // 直接传入手机号
        password: formData.password
      });

      if (response.success) {
        router.push("/")
      } else {
        setError(response.error || "登录失败，请重试")
      }
    } catch (error) {
      setError("登录时发生错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="开启探索之旅">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm text-red-500 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">手机号</label>
          <Input
            type="text"
            placeholder="请输入手机号"
            className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm focus:border-[#FF7F6E] focus:ring-[#FF7F6E]"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">密码</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="请输入密码"
              className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm pr-10 focus:border-[#FF7F6E] focus:ring-[#FF7F6E]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 rounded-lg bg-gradient-to-r from-[#FF7F6E] to-[#FF9B8C] hover:from-[#FF6A56] hover:to-[#FF8A7A] text-white font-medium shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          disabled={isLoading}
        >
          {isLoading ? "登录中..." : "开始探索"}
        </Button>

        <div className="flex justify-between text-sm mt-4">
          <Link href="/register" className="text-[#FF7F6E] hover:text-[#FF6A56] font-medium">
            注册新账号
          </Link>
          <Link href="/forgot-password" className="text-[#FF7F6E] hover:text-[#FF6A56] font-medium">
            忘记密码？
          </Link>
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-white/80">其他登录方式</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="w-12 h-12 rounded-full bg-white/90 shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#07C160">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-8">
          登录即代表同意
          <Link href="/terms" className="text-[#FF7F6E] hover:text-[#FF6A56] mx-1 font-medium">
            《用户协议》
          </Link>
          和
          <Link href="/privacy" className="text-[#FF7F6E] hover:text-[#FF6A56] ml-1 font-medium">
            《隐私政策》
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
} 