import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type FailureModalProps = {
  onClose: () => void;
  onRetry: () => void;
}

export default function FailureModal({ onClose, onRetry }: FailureModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => {
        // 只有点击背景时才关闭
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()} // 防止点击内容区域时关闭
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="text-[48px] mb-4">😢</div>
          <h3 className="text-xl font-semibold text-[#2D3748] mb-2">
            任务失败
          </h3>
          <p className="text-gray-600">
            很遗憾，任务时间已到，本次任务未能完成。
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            关闭
          </button>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-[#FF7E67] text-white rounded-lg hover:bg-opacity-90"
          >
            重试
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 