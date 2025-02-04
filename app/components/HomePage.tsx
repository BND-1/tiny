"use client"

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, SkipForward, RefreshCcw, Check, Clock } from "lucide-react"
import Lottie from 'lottie-react';
import orangeRunAnimation from '@/app/animations/lottie/橘子快跑_加载动画.json';
import searchAnimation from '@/app/animations/lottie/感官唤醒类（放大镜）.json';
import weatherAnimation from '@/app/animations/lottie/天气动画.json';
import cameraAnimation from '@/app/animations/lottie/拍照动画.json';
import { Task } from '../types/task';
import CountdownAnimation from './CountdownAnimation';
import FailureModal from './FailureModal';
import SuccessAnimation from './SuccessAnimation';
import ShareModal from './ShareModal';
import { UserTaskHistory } from '../types/userTask';
import { getRandomTask, completeTask } from '../services/api';
import { soundService } from '../services/sound';
import UserGuide from './UserGuide';

type HomePageProps = {
  onTaskComplete: () => void
}

export default function HomePage({ onTaskComplete }: HomePageProps) {
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState<Task>({
    id: '',
    taskId: 0,
    description: '加载中...',
    tags: [],
    category: '',
    estimatedTime: 0,
    animation: 'orange',
    difficulty: 1,
    points: 0,
    isNightTask: false
  });
  const [remainingChanges, setRemainingChanges] = useState(3);
  const [isTaskAccepted, setIsTaskAccepted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userTaskHistory, setUserTaskHistory] = useState<UserTaskHistory | null>(null);
  const [taskStartTime, setTaskStartTime] = useState<number>(0);
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const ANIMATIONS = {
    search: searchAnimation,
    weather: weatherAnimation,
    camera: cameraAnimation,
  } as const;

  // 获取随机任务
  const fetchRandomTask = async () => {
    try {
      const params = {
        isNightTask: false
      };

      if (userTaskHistory?.completedTasks) {
        // 转换为数字类型的 ID 数组
        params.excludeIds = Object.keys(userTaskHistory.completedTasks).map(Number);
      }

      const response = await getRandomTask(params);
      console.log('获取到的响应:', response);

      if (response.success && response.data) {
        const taskData = response.data;
        const getAnimationType = (category: string): keyof typeof ANIMATIONS => {
          switch (category.toLowerCase()) {
            case '感官唤醒类':
              return 'search';
            case '环境对话类':
              return 'weather';
            case '记录类':
              return 'camera';
            default:
              return 'search';
          }
        };
        const task: Task = {
          id: String(taskData.taskId), // 使用 taskId 作为 id
          taskId: taskData.taskId,
          description: taskData.description,
          tags: Array.isArray(taskData.tags) ? taskData.tags : [],
          category: taskData.category,
          estimatedTime: taskData.estimatedTime,
          animation: getAnimationType(taskData.category),
          difficulty: taskData.difficulty,
          points: taskData.points,
          isNightTask: taskData.isNightTask
        };
        
        console.log('处理后的任务数据:', task);
        setCurrentTask(task);
      } else {
        console.error('获取任务失败:', response.error);
        setCurrentTask({
          id: '',
          taskId: 0,
          description: '获取任务失败，请重试',
          tags: [],
          category: '',
          estimatedTime: 0,
          animation: 'orange',
          difficulty: 1,
          points: 0,
          isNightTask: false
        });
      }
    } catch (error) {
      console.error('获取任务出错:', error);
    }
  };

  // 初始化时获取随机任务
  useEffect(() => {
    fetchRandomTask();
  }, []);

  // 在useEffect中检查是否是首次登录
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setIsFirstLogin(true);
      localStorage.setItem('hasSeenGuide', 'true');
    }
  }, []);

  // 处理换任务
  const handleChangeTask = async () => {
    if (remainingChanges > 0) {
      if (progressTimer) {
        clearInterval(progressTimer);
        setProgressTimer(null);
      }
      
      await fetchRandomTask();
      setProgress(0);
      setRemainingChanges(prev => prev - 1);
      setIsTaskAccepted(false);
    }
  };

  // 修改任务接受处理函数，记录开始时间
  const handleAcceptTask = () => {
    setIsTaskAccepted(true);
    setTaskStartTime(Date.now());
    setProgress(0);
    
    const totalTime = currentTask.estimatedTime || 30;
    const progressPerSecond = 100 / totalTime;
    
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (progressPerSecond / 10);
        if (newProgress >= 100) {
          clearInterval(timer);
          handleTaskFailure(); // 直接调用失败处理
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    setProgressTimer(timer);
  };

  // 修改完成按钮的处理函数
  const handleComplete = async () => {
    if (!currentTask.taskId) return;
    
    try {
      // 清除进度条计时器
      if (progressTimer) {
        clearInterval(progressTimer);
        setProgressTimer(null);
      }
      
      // 重置进度条
      setProgress(0);
      
      // 计算任务实际花费时间（秒）
      const timeSpent = Math.floor((Date.now() - taskStartTime) / 1000);
      
      console.log('发送任务完成请求:', {
        taskId: currentTask.taskId,
        timeSpent
      });
      
      const response = await completeTask(currentTask.taskId, timeSpent);
      console.log('任务完成响应:', response);
      
      if (response.success) {
        // 显示成功动画
        setShowSuccessAnimation(true);
        // 重置任务状态
        setIsTaskAccepted(false);
        handleTaskComplete();
      } else {
        console.error('任务完成失败:', response.error);
        alert(response.error || '任务完成失败，请重试');
      }
    } catch (error) {
      console.error('任务完成请求失败:', error);
      alert('网络错误，请重试');
    }
  };

  const handleSkip = () => {
    // 添加震动效果（在实际的小程序环境中使用 wx.vibrateShort）
    console.log("Skipped with vibration")
  }

  const getAvailableTasks = () => {
    if (!userTaskHistory) return [];

    // 过滤掉今天已完成的任务
    return [];
  };

  const handleTaskFailure = () => {
    setShowFailureModal(true);
    setIsTaskAccepted(false);
    setProgress(0);
    if (progressTimer) {
      clearInterval(progressTimer);
      setProgressTimer(null);
    }
    handleTaskFail();
  };

  const handleCloseFailureModal = () => {
    setShowFailureModal(false);
    setIsTaskAccepted(false);
    if (progressTimer) {
      clearInterval(progressTimer);
      setProgressTimer(null);
    }
  };

  const handleRetry = () => {
    setShowFailureModal(false);
    setProgress(0);
    setIsTaskAccepted(true);
    setTaskStartTime(Date.now());
    
    const totalTime = currentTask.estimatedTime || 30;
    const progressPerSecond = 100 / totalTime;
    
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (progressPerSecond / 10);
        if (newProgress >= 100) {
          clearInterval(timer);
          handleTaskFailure();
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    setProgressTimer(timer);
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    setShowShareModal(true);
  };

  const handleCloseShare = () => {
    setShowShareModal(false);
    setShowSuccessAnimation(false);
    onTaskComplete();
  };

  // 修改分享处理函数
  const handleShareToFriends = () => {
    setShowShareModal(false);
    setShowSuccessAnimation(false);
    onTaskComplete();
  };

  const handleShareToMoments = () => {
    setShowShareModal(false);
    setShowSuccessAnimation(false);
    onTaskComplete();
  };

  // 在组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    };
  }, [progressTimer]);

  // 在任务完成时播放音效
  const handleTaskComplete = () => {
    // ... 其他任务完成逻辑
  };

  // 在任务失败时播放音效
  const handleTaskFail = () => {
    // ... 其他失败处理逻辑
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF]">
      <UserGuide isFirstLogin={isFirstLogin} />
      <div className="flex-1 flex flex-col justify-center items-center p-4" style={{ height: "70vh" }}>
        <div className="mb-6 text-center">
          <p className="text-xl font-medium bg-gradient-to-r from-[#4B8CA6] to-[#FF7E67] bg-clip-text text-transparent">
            每日微任务，让每一天都有新发现
          </p>
        </div>
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1">
              <Clock size={14} className="text-[#4B8CA6]" />
              <span className="text-xs font-medium text-[#2D3748] ml-1">
                {isTaskAccepted 
                  ? Math.ceil(currentTask.estimatedTime * (1 - progress / 100)) 
                  : currentTask.estimatedTime}s
              </span>
            </div>
          </div>
          <div className="h-[250px] rounded-xl mb-6 flex items-center justify-center relative overflow-hidden bg-[#F8F9FA]">
            {currentTask.animation === 'search' && (
              <Lottie
                animationData={searchAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {currentTask.animation === 'weather' && (
              <Lottie
                animationData={weatherAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {currentTask.animation === 'camera' && (
              <Lottie
                animationData={cameraAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
          <h2 className="text-[22px] font-medium mb-4 text-center leading-relaxed text-[#2D3748]">
            {currentTask?.description || '加载中...'}
          </h2>
          <div className="flex justify-center mb-6 flex-wrap gap-2">
            {currentTask?.tags?.map((tag, index) => (
              <span 
                key={index}
                className={`
                  ${index % 2 === 0 ? 'bg-[#FF7E67]/10 text-[#FF7E67]' : 'bg-[#4B8CA6]/10 text-[#4B8CA6]'}
                  text-sm font-medium px-4 py-1.5 rounded-full
                `}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="relative w-full mt-6">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#4B8CA6] to-[#FF7E67] h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div 
              className="absolute bottom-0 transform -translate-y-1/2"
              style={{ 
                left: `${progress}%`, 
                transform: `translateX(-50%) translateY(0)`,
                width: '52px',
                height: '52px',
                marginBottom: '4px'
              }}
            >
              <Lottie
                animationData={orangeRunAnimation}
                loop={true}
                autoplay={true}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  transform: 'scale(1.2)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-100 p-4 flex justify-between items-center h-[80px] shadow-lg">
        {!isTaskAccepted ? (
          <>
            <div className="relative">
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 focus:outline-none group"
                onClick={handleChangeTask}
              >
                <div className="p-2 rounded-full group-hover:bg-gray-50 transition-colors">
                  <RefreshCcw size={28} className="text-[#4B8CA6]" />
                </div>
                <span className="text-xs mt-1 text-[#2D3748]">换任务</span>
                <span className="absolute -top-1 -right-1 bg-[#FF7E67] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {remainingChanges}
                </span>
              </button>
            </div>
            <button 
              className="flex flex-col items-center justify-center focus:outline-none"
              onClick={handleAcceptTask}
            >
              <div className="bg-gradient-to-r from-[#FF7E67] to-[#FF9B8C] p-3 rounded-full shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5">
                <Check size={32} className="text-white" />
              </div>
              <span className="text-xs mt-2 text-[#2D3748]">接受任务</span>
            </button>
            <div className="w-16" />
          </>
        ) : (
          <>
            <div className="relative w-16 h-16">
              <button 
                className="flex flex-col items-center justify-center w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7E67]"
                onClick={handleChangeTask}
                aria-label="换任务"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleChangeTask()}
              >
                <RefreshCcw 
                  size={32} 
                  className={`${isCountingDown ? 'text-gray-400' : 'text-[#4B8CA6]'}`}
                />
                <span className="text-xs mt-1 text-[#2D3748]">换任务</span>
              </button>
              <span className="absolute -top-2 -right-2 bg-[#FF7E67] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {remainingChanges}
              </span>
            </div>
            <div className="w-16 h-16" />
            <button 
              className={`flex flex-col items-center justify-center w-16 h-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7E67] ${
                isCountingDown ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleComplete}
              disabled={isCountingDown}
            >
              <div className={`bg-[#FF7E67] rounded-full p-2 transform transition-transform duration-200 ${
                !isCountingDown ? 'hover:scale-110' : ''
              }`}>
                <Check size={32} className="text-white" />
              </div>
              <span className="text-xs mt-1 text-[#2D3748]">完成</span>
            </button>
          </>
        )}
      </div>

      {showFailureModal && (
        <FailureModal
          onClose={handleCloseFailureModal}
          onRetry={handleRetry}
        />
      )}
      {showSuccessAnimation && (
        <SuccessAnimation onAnimationComplete={handleSuccessAnimationComplete} />
      )}
      {showShareModal && (
        <ShareModal
          onClose={handleCloseShare}
          onShareToFriends={handleShareToFriends}
          onShareToMoments={handleShareToMoments}
        />
      )}
    </div>
  )
}

