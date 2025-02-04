"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 顶部导航 */}
      <div className="bg-white p-4 flex items-center sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold ml-2">关于我们</h1>
      </div>

      {/* 内容区域 */}
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Logo 和项目名 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#FF7F6E] to-[#4B8CA6] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">探</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">每日探索</h2>
            <p className="mt-2 text-gray-500">发现生活中的微小惊喜</p>
          </div>

          {/* 项目介绍 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">项目理念</h3>
            <p className="text-gray-600 leading-relaxed">
              "每日探索"致力于让用户通过完成简单有趣的日常任务，培养观察力和探索精神。我们相信，生活中处处都有值得发现的美好，只是我们常常忽略了它们。
            </p>
          </div>

          {/* 核心特色 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">🎯 微任务系统</h4>
              <p className="text-gray-600">
                精心设计的任务体系，从观察周围环境到互动探索，让每一天都充满新鲜感。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">🏆 成长激励</h4>
              <p className="text-gray-600">
                通过等级提升、成就解锁等方式，记录您的探索历程，激励持续进步。
              </p>
            </div>
          </div>

          {/* 使命愿景 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">我们的使命</h3>
            <p className="text-gray-600 leading-relaxed">
              让更多人发现日常生活中被忽视的细节之美，培养积极探索的心态，让每一天都充满期待和惊喜。
            </p>
          </div>

          {/* 版本信息 */}
          <div className="text-center text-sm text-gray-500 pt-8">
            <p>当前版本：0.0.1</p>
            <p className="mt-2">Copyright © 2025 YanG</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 