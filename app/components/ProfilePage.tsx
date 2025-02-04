"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Camera, Settings, Clock, FileText, ChevronRight, Moon, LogOut } from "lucide-react"
import { logout } from "../services/api"
import { soundService } from "../services/sound"

interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  // 移除 level 字段，因为我们会根据经验值动态计算
}

interface TaskStats {
  totalExperience: number;
  averageTime: number;
  totalTasks: number;
}

const AVATAR_COLORS = [
  'bg-[#FF7E67]', // 红色
  'bg-[#4B8CA6]', // 蓝色
  'bg-[#6B8E23]', // 橄榄绿
  'bg-[#9370DB]', // 紫色
  'bg-[#FF8C00]', // 橙色
  'bg-[#20B2AA]', // 青色
  'bg-[#BA55D3]', // 兰花紫
  'bg-[#FF69B4]', // 粉色
];

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [isMuted, setIsMuted] = useState(soundService.getMuteStatus())

  // 修正计算等级的逻辑
  const calculateLevel = (experience: number): number => {
    if (!experience) return 0;
    return Math.floor(experience / 100) + 1; // 修改为从 Lv.1 开始
  }

  useEffect(() => {
    // 从 localStorage 获取用户信息和任务统计信息
    const storedUserInfo = localStorage.getItem('userInfo')
    const storedTaskStats = localStorage.getItem('taskStats')
    const storedMedals = localStorage.getItem('unlockedMedals')
    
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }

    if (storedTaskStats) {
      try {
        const parsedTaskStats = JSON.parse(storedTaskStats);
        let totalExp = parsedTaskStats.totalExperience || 0; // 确保默认为0
        
        // 新增：计算勋章奖励的经验值
        if (storedMedals) {
          const unlockedMedals = JSON.parse(storedMedals);
          const medalExp = unlockedMedals.reduce((acc: number, medal: any) => {
            return acc + (medal.rewards?.reduce((sum: number, reward: any) => {
              return sum + (reward.type === 'EXPERIENCE' ? reward.value : 0);
            }, 0) || 0);
          }, 0);
          
          totalExp += medalExp;
        }
        
        setTaskStats({
          ...parsedTaskStats,
          totalExperience: totalExp
        });
      } catch (error) {
        console.error('解析任务统计信息失败:', error);
        // 如果解析失败，设置默认值为0
        setTaskStats({
          totalExperience: 0,
          averageTime: 0,
          totalTasks: 0
        });
      }
    } else {
      // 如果没有统计信息，设置默认值为0
      setTaskStats({
        totalExperience: 0,
        averageTime: 0,
        totalTasks: 0
      });
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleTaskHistory = () => {
    router.push('/task-history')
  }

  // 获取用户名最后两个字符作为头像显示
  const getAvatarText = (nickname: string): string => {
    if (!nickname) return '用户';
    return nickname.slice(-2);
  }

  // 基于用户名生成固定的颜色
  const getAvatarColor = (nickname: string): string => {
    if (!nickname) return AVATAR_COLORS[0];
    
    // 将用户名转换为数字（通过将字符串中每个字符的 ASCII 码值相加）
    const sum = nickname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // 使用这个数字来选择颜色数组中的一个颜色
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  // 修改处理函数,添加点击音效
  const handleAboutUs = () => {
    router.push('/about')
  }

  const handleToggleSound = () => {
    soundService.toggleMute();
    setIsMuted(soundService.getMuteStatus());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] p-4">
      {/* 用户信息卡片 - 更新样式 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden mb-4">
        <div className="p-6">
          <div className="flex items-center">
            <div className={`
              w-[60px] h-[60px] 
              ${userInfo ? getAvatarColor(userInfo.nickname) : 'bg-gray-200'} 
              rounded-xl mr-4 flex items-center justify-center
              shadow-sm transform hover:scale-105 transition-transform duration-200
            `}>
              <span className="text-[20px] font-medium text-white">
                {userInfo ? getAvatarText(userInfo.nickname) : '用户'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-semibold text-[#2D3748] mb-2">
                {userInfo?.nickname || '加载中...'}
              </h2>
              <div className="flex items-center bg-[#F8F9FA] rounded-full px-3 py-1.5 w-fit">
                <span className="text-[13px] font-medium text-[#4B8CA6]">
                  专注探索者 Lv.{taskStats ? calculateLevel(taskStats.totalExperience) : 1}
                </span>
                <div className="mx-2 h-3 w-[1px] bg-gray-200"></div>
                <span className="text-xs text-[#FF7E67]">
                  {taskStats?.totalExperience || 0}/{((taskStats ? calculateLevel(taskStats.totalExperience) : 1)) * 100}经验
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单卡片 */}
      <div className="space-y-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
          {/* 任务历史按钮 */}
          <button 
            onClick={handleTaskHistory}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#4B8CA6]/10 flex items-center justify-center mr-4">
                <Clock size={20} className="text-[#4B8CA6]" />
              </div>
              <span className="text-[16px] font-medium text-[#2D3748]">任务历史</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* 偏好设置 */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#4B8CA6]/10 flex items-center justify-center mr-4">
                <Settings size={20} className="text-[#4B8CA6]" />
              </div>
              <span className="text-[16px] font-medium text-[#2D3748]">偏好设置</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[14px] text-gray-500">音效</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={!isMuted}
                onChange={handleToggleSound}
              />
            </div>
          </div>

          {/* 关于我们 */}
          <button 
            onClick={handleAboutUs}
            className="w-full p-4 border-t border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#4B8CA6]/10 flex items-center justify-center mr-4">
                <FileText size={20} className="text-[#4B8CA6]" />
              </div>
              <span className="text-[16px] font-medium text-[#2D3748]">关于我们</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 退出登录按钮 */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors space-x-2"
        >
          <LogOut size={20} />
          <span className="text-[16px] font-medium">退出登录</span>
        </button>
      </div>
    </div>
  )
}

