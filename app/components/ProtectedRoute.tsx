"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
} 