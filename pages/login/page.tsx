"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import AuthLayout from "../components/AuthLayout"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthLayout title="欢迎回来">
      <form className="space-y-4 w-full max-w-md mx-auto">
        <Input type="text" placeholder="手机号/用户名" className="h-12 rounded-lg border-gray-300" />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="密码"
            className="h-12 rounded-lg border-gray-300 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button type="submit" className="w-full h-12 rounded-lg bg-[#FF7F6E] hover:bg-[#ff6a56] text-white font-medium">
          登录
        </Button>
      </form>

      <div className="flex justify-between text-sm mt-4 w-full max-w-md mx-auto">
        <Link href="/register" className="text-[#FF7F6E]">
          注册新账号
        </Link>
        <button className="text-[#FF7F6E]">忘记密码？</button>
      </div>

      <div className="mt-8 w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 justify-center">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-sm text-gray-500">其他登录方式</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="mt-6 flex justify-center gap-8">
          <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#07C160">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1677FF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 用户协议 */}
      <p className="text-xs text-gray-500 text-center mt-auto">
        登录即代表同意
        <button className="text-[#FF7F6E] mx-1">《用户协议》</button>和
        <button className="text-[#FF7F6E] ml-1">《隐私政策》</button>
      </p>
    </AuthLayout>
  )
}

