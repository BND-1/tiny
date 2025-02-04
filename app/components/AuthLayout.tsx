import React from "react"
import { motion } from "framer-motion"

type AuthLayoutProps = {
  children: React.ReactNode
  title: string
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE5E0] to-[#FFF5F3]">
      <div className="fixed top-0 right-0 w-64 h-64 bg-[#FF7F6E] rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-48 h-48 bg-[#4B8CA6] rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <h2 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-[#FF7F6E] to-[#4B8CA6] bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          每日微任务，让生活充满惊喜
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-white/20">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

