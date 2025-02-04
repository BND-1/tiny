"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import AuthLayout from "../components/AuthLayout"
import { useRouter } from "next/navigation"
import { registerUser } from "../services/api"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 验证手机号格式（11位中国大陆手机号）
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("请输入正确的11位中国大陆手机号");
      setIsLoading(false);
      return;
    }

    // 验证用户名长度（2-20位）
    if (formData.username.length < 2 || formData.username.length > 20) {
      setError("用户名长度需要在2-20位之间");
      setIsLoading(false);
      return;
    }

    // 验证密码长度（6-20位）
    if (formData.password.length < 6 || formData.password.length > 20) {
      setError("密码长度需要在6-20位之间");
      setIsLoading(false);
      return;
    }

    // 验证两次密码是否一致
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        phone: formData.phone,
        password: formData.password,
        username: formData.username
      });

      if (response.success) {
        // 注册成功，跳转到登录页
        router.push("/login")
      } else {
        setError(response.error || "注册失败，请重试")
      }
    } catch (error) {
      setError("注册时发生错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="创建新账号">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Input
          type="text"
          placeholder="手机号"
          className="h-12 rounded-lg border-gray-300"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isLoading}
        />

        <Input
          type="text"
          placeholder="用户名"
          className="h-12 rounded-lg border-gray-300"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="密码"
            className="h-12 rounded-lg border-gray-300 pr-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="确认密码"
          className="h-12 rounded-lg border-gray-300"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          disabled={isLoading}
        />

        <Button 
          type="submit" 
          className="w-full h-12 rounded-lg bg-[#FF7F6E] hover:bg-[#ff6a56] text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? "注册中..." : "注册"}
        </Button>
      </form>

      <div className="text-sm text-center mt-4">
        <span className="text-gray-600">已有账号？</span>
        <Link href="/login" className="text-[#FF7F6E] ml-1">
          立即登录
        </Link>
      </div>

      <p className="text-xs text-gray-500 text-center mt-8">
        注册即代表同意
        <Link href="/terms" className="text-[#FF7F6E] mx-1">
          《用户协议》
        </Link>
        和
        <Link href="/privacy" className="text-[#FF7F6E] ml-1">
          《隐私政策》
        </Link>
      </p>
    </AuthLayout>
  )
} 