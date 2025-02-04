"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import TaskHistory from "../components/TaskHistory"

export default function TaskHistoryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 顶部导航栏 */}
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} className="text-[#2D3748]" />
        </button>
        <h1 className="text-lg font-semibold ml-2 text-[#2D3748]">任务历史</h1>
      </div>

      {/* 任务历史内容 */}
      <div className="p-4">
        <TaskHistory />
      </div>
    </div>
  )
} 