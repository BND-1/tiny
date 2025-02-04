import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import successAnimation from '@/app/animations/lottie/完成任务后的动画展示.json';

type SuccessAnimationProps = {
  onAnimationComplete: () => void;
}

export default function SuccessAnimation({ onAnimationComplete }: SuccessAnimationProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="w-[400px] h-[400px]"
        >
          <Lottie
            animationData={successAnimation}
            loop={false}
            autoplay={true}
            onComplete={onAnimationComplete}
            style={{ 
              width: '100%', 
              height: '100%',
              transform: 'scale(1.2)'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 