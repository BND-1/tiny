import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserGuideProps {
  isFirstLogin?: boolean;
}

export default function UserGuide({ isFirstLogin = false }: UserGuideProps) {
  const [isExpanded, setIsExpanded] = useState(isFirstLogin);

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsExpanded(false);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#2D3748]">使用指南</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="关闭使用指南"
                >
                  <ChevronUp size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF7E67]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FF7E67] font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D3748] mb-1">每日任务推荐</h4>
                    <p className="text-sm leading-relaxed">
                      系统每天为您精心推荐一个微任务，包括观察、互动和记录等多种类型。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#4B8CA6]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#4B8CA6] font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D3748] mb-1">开始任务</h4>
                    <p className="text-sm leading-relaxed">
                      点击"接受任务"开始计时，在规定时间内完成任务并点击"完成"按钮。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF7E67]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FF7E67] font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D3748] mb-1">获得奖励</h4>
                    <p className="text-sm leading-relaxed">
                      完成任务可以获得经验值，累积经验值可以提升等级和解锁成就勋章。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#4B8CA6]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#4B8CA6] font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#2D3748] mb-1">更换任务</h4>
                    <p className="text-sm leading-relaxed">
                      如果当前任务不感兴趣，可以点击"换任务"按钮更换。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="absolute left-4 top-4 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors"
          aria-label="打开使用指南"
        >
          <ChevronDown size={20} className="text-gray-600" />
        </motion.button>
      )}
    </AnimatePresence>
  );
} 