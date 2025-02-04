import React, { useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import orangeRunAnimation from '../animations/lottie/橘子快跑_加载动画.json';

interface TaskAnimationProps {
  onCircleFound?: (count: number) => void;
  duration?: number;
  isCompleted?: boolean;
}

const TaskAnimation: React.FC<TaskAnimationProps> = ({
  onCircleFound,
  duration = 30,
  isCompleted = false,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0 || isCompleted) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, duration]);

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Lottie动画 */}
      <Lottie
        lottieRef={lottieRef}
        animationData={orangeRunAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />

      {/* 时间显示 */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
        {timeLeft}s
      </div>

      {/* 完成状态 */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg px-6 py-4 text-center">
            <h3 className="text-lg font-bold text-green-600">任务完成！</h3>
            <p className="text-gray-600">观察任务已完成</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAnimation; 