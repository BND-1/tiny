import { useState, useEffect } from "react"
import { Calendar, Medal, ChevronLeft, ChevronRight, X } from "lucide-react"
import { getCalendarData, type CalendarData } from "../services/api"
import { soundService } from "../services/sound"

// 定义勋章数据结构
interface MedalData {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'TASK_STREAK' | 'TOTAL_TASKS';
    value: number;
  };
  rewards: {
    type: 'EXPERIENCE';
    value: number;
  }[];
}

// 预设勋章数据
const PRESET_MEDALS: MedalData[] = [
  {
    id: '1',
    name: '初次尝试',
    description: '完成第一个任务',
    icon: '🎯',
    criteria: { type: 'TOTAL_TASKS', value: 1 },
    rewards: [{ type: 'EXPERIENCE', value: 100 }]
  },
  {
    id: '2',
    name: '三连击',
    description: '连续完成三个任务',
    icon: '🔥',
    criteria: { type: 'TASK_STREAK', value: 3 },
    rewards: [{ type: 'EXPERIENCE', value: 300 }]
  },
  {
    id: '3',
    name: '坚持不懈',
    description: '累计完成20个任务',
    icon: '🌟',
    criteria: { type: 'TOTAL_TASKS', value: 20 },
    rewards: [{ type: 'EXPERIENCE', value: 500 }]
  },
  {
    id: '4',
    name: '持之以恒',
    description: '连续完成7个任务',
    icon: '🌈',
    criteria: { type: 'TASK_STREAK', value: 7 },
    rewards: [{ type: 'EXPERIENCE', value: 700 }]
  },
  {
    id: '5',
    name: '任务达人',
    description: '累计完成50个任务',
    icon: '👑',
    criteria: { type: 'TOTAL_TASKS', value: 50 },
    rewards: [{ type: 'EXPERIENCE', value: 1000 }]
  },
  {
    id: '6',
    name: '坚如磐石',
    description: '连续完成14个任务',
    icon: '💎',
    criteria: { type: 'TASK_STREAK', value: 14 },
    rewards: [{ type: 'EXPERIENCE', value: 1400 }]
  },
  {
    id: '7',
    name: '百战百胜',
    description: '累计完成100个任务',
    icon: '🏆',
    criteria: { type: 'TOTAL_TASKS', value: 100 },
    rewards: [{ type: 'EXPERIENCE', value: 2000 }]
  },
  {
    id: '8',
    name: '传奇',
    description: '连续完成30个任务',
    icon: '⭐',
    criteria: { type: 'TASK_STREAK', value: 30 },
    rewards: [{ type: 'EXPERIENCE', value: 3000 }]
  }
];

interface TaskStats {
  totalExperience: number;
  averageTime: number;
  totalTasks: number;
  currentStreak: number;
}

export default function AchievementWallPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMedal, setSelectedMedal] = useState<MedalData | null>(null)

  useEffect(() => {
    // 从 localStorage 获取任务统计信息
    const storedTaskStats = localStorage.getItem('taskStats')
    if (storedTaskStats) {
      try {
        const parsedStats = JSON.parse(storedTaskStats);
        // 确保所有必要的字段都有默认值
        setTaskStats({
          totalExperience: parsedStats.totalExperience || 0,
          averageTime: parsedStats.averageTime || 0,
          totalTasks: parsedStats.totalTasks || 0,
          currentStreak: parsedStats.currentStreak || 0
        });
      } catch (error) {
        console.error('解析任务统计信息失败:', error);
        // 设置默认值
        setTaskStats({
          totalExperience: 0,
          averageTime: 0,
          totalTasks: 0,
          currentStreak: 0
        });
      }
    }
  }, [])

  // 判断勋章是否解锁
  const isMedalUnlocked = (medal: MedalData): boolean => {
    if (!taskStats) return false;
    
    let isUnlocked = false;
    switch (medal.criteria.type) {
      case 'TOTAL_TASKS':
        isUnlocked = taskStats.totalTasks >= medal.criteria.value;
        break;
      case 'TASK_STREAK':
        isUnlocked = taskStats.currentStreak >= medal.criteria.value;
        break;
      default:
        return false;
    }

    // 如果勋章被解锁，保存到 localStorage
    if (isUnlocked) {
      const storedMedals = localStorage.getItem('unlockedMedals');
      let unlockedMedals = [];
      try {
        unlockedMedals = storedMedals ? JSON.parse(storedMedals) : [];
        if (!unlockedMedals.find((m: any) => m.id === medal.id)) {
          unlockedMedals.push({
            id: medal.id,
            unlockedAt: new Date().toISOString(),
            rewards: medal.rewards
          });
          localStorage.setItem('unlockedMedals', JSON.stringify(unlockedMedals));
          
          // 更新任务统计信息中的总经验值
          const storedTaskStats = localStorage.getItem('taskStats');
          if (storedTaskStats) {
            const taskStats = JSON.parse(storedTaskStats);
            const medalExp = medal.rewards.reduce((sum, reward) => 
              sum + (reward.type === 'EXPERIENCE' ? reward.value : 0), 0);
            taskStats.totalExperience += medalExp;
            localStorage.setItem('taskStats', JSON.stringify(taskStats));
          }
        }
      } catch (error) {
        console.error('保存勋章数据失败:', error);
      }
    }

    return isUnlocked;
  }

  // 获取解锁时间（这里可以根据实际需求调整）
  const getUnlockTime = (medal: MedalData): string | null => {
    if (!isMedalUnlocked(medal)) return null;
    // 这里可以从 localStorage 中获取具体解锁时间，暂时返回当前时间
    return new Date().toLocaleDateString();
  }

  // 获取日历数据
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log(`获取${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月的日历数据`)
        
        const response = await getCalendarData(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        )
        
        if (response.success && response.data) {
          setCalendarData(response.data)
        } else {
          setError(response.error || '获取数据失败')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取日历数据时发生错误'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarData()
  }, [currentDate]) // 只在日期变化时获取日历数据

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // 添加获取勋章文字颜色的函数
  const getMedalTextColor = (medalId: string): string => {
    const colors: { [key: string]: string } = {
      '1': 'text-[#FF7E67]',  // 红色
      '2': 'text-[#F59E0B]',  // 橙色
      '3': 'text-[#10B981]',  // 绿色
      '4': 'text-[#3B82F6]',  // 蓝色
      '5': 'text-[#8B5CF6]',  // 紫色
      '6': 'text-[#EC4899]',  // 粉色
      '7': 'text-[#6366F1]',  // 靛蓝色
      '8': 'text-[#F43F5E]'   // 玫瑰红
    };
    return colors[medalId] || 'text-[#2D3748]';
  };

  // 在解锁新勋章时播放音效
  const handleMedalUnlock = (medal: MedalData) => {
    if (isMedalUnlocked(medal)) {
      soundService.play('medalUnlock');
      // ... 其他勋章解锁逻辑
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] p-4">
      <h2 className="text-[24px] font-semibold mb-6 text-[#2D3748]">成就墙</h2>

      {/* 打卡日历卡片 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-semibold flex items-center text-[#2D3748]">
            <Calendar className="mr-2 text-[#4B8CA6]" size={24} />
            打卡日历
          </h3>
          
          <div className="flex items-center space-x-4">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={20} className="text-[#4B8CA6]" />
            </button>
            <span className="text-[15px] font-medium text-[#2D3748]">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </span>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleNextMonth}
            >
              <ChevronRight size={20} className="text-[#4B8CA6]" />
            </button>
          </div>
        </div>

        {/* 日历网格 */}
        <div className="mb-6">
          <div className="grid grid-cols-7 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-[14px] font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array(31).fill(null).map((_, i) => (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-[14px] font-medium
                  ${calendarData?.completedDates.includes(i + 1)
                    ? "bg-gradient-to-br from-[#FF7E67] to-[#FF9B8C] text-white shadow-sm"
                    : "bg-gray-50 text-[#2D3748] hover:bg-gray-100 transition-colors"
                  }
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 统计数据 */}
        <div className="flex justify-center gap-12 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-[28px] font-semibold bg-gradient-to-r from-[#FF7E67] to-[#FF9B8C] bg-clip-text text-transparent">
              {calendarData?.currentStreak || 0}
            </div>
            <div className="text-[14px] text-gray-500 mt-1">天连续打卡</div>
          </div>
          <div className="text-center">
            <div className="text-[28px] font-semibold bg-gradient-to-r from-[#4B8CA6] to-[#6BA5BD] bg-clip-text text-transparent">
              {calendarData?.longestStreak || 0}
            </div>
            <div className="text-[14px] text-gray-500 mt-1">最长连续天数</div>
          </div>
        </div>
      </div>

      {/* 勋章展示卡片 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6">
        <h3 className="text-[18px] font-semibold flex items-center mb-6 text-[#2D3748]">
          <Medal className="mr-2 text-[#4B8CA6]" size={24} />
          勋章陈列馆
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {PRESET_MEDALS.map((medal, index) => {
            const isUnlocked = isMedalUnlocked(medal);
            return (
              <div key={index} className="group relative">
                <button 
                  onClick={() => {
                    setSelectedMedal(medal);
                    handleMedalUnlock(medal);
                  }}
                  className="w-full focus:outline-none"
                >
                  <div className={`
                    aspect-square rounded-2xl mb-2 flex items-center justify-center
                    ${isUnlocked 
                      ? 'bg-gradient-to-br from-[#F8F9FA] to-white shadow-md' 
                      : 'bg-gray-50'
                    }
                    transition-all duration-300 group-hover:shadow-lg
                  `}>
                    <div className={`
                      text-[40px] transform transition-all duration-300
                      ${!isUnlocked && 'opacity-30 filter grayscale'}
                      ${isUnlocked && 'group-hover:scale-110'}
                    `}>
                      {medal.icon}
                    </div>
                    
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
                        <span className="text-[32px]">🔒</span>
                      </div>
                    )}
                  </div>
                  
                  <span className={`
                    text-[14px] font-medium text-center block
                    ${isUnlocked ? getMedalTextColor(medal.id) : 'text-gray-400'}
                  `}>
                    {medal.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 勋章详情模态框 */}
      {selectedMedal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="relative bg-white rounded-2xl w-full max-w-sm animate-scaleIn">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setSelectedMedal(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* 勋章内容 */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-[48px]">{selectedMedal.icon}</div>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-2 text-[#2D3748]">
                {selectedMedal.name}
              </h3>
              
              <p className="text-center text-[#FF7E67] font-medium mb-4">
                {selectedMedal.description}
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    解锁条件: {selectedMedal.criteria.value} 
                    {selectedMedal.criteria.type === 'TASK_STREAK' ? '个连续任务' : '个任务'}
                  </p>
                  {!isMedalUnlocked(selectedMedal) && taskStats && (
                    <div className="mt-2">
                      <p className="text-sm text-[#4B8CA6]">
                        当前进度: {
                          selectedMedal.criteria.type === 'TASK_STREAK' 
                            ? `${taskStats.currentStreak}/${selectedMedal.criteria.value}`
                            : `${taskStats.totalTasks}/${selectedMedal.criteria.value}`
                        }
                      </p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#4B8CA6] to-[#FF7E67] h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(selectedMedal.criteria.type === 'TASK_STREAK' 
                              ? (taskStats.currentStreak / selectedMedal.criteria.value) 
                              : (taskStats.totalTasks / selectedMedal.criteria.value)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {getUnlockTime(selectedMedal) && (
                  <div className="bg-[#4B8CA6]/10 rounded-lg p-4">
                    <p className="text-sm text-[#4B8CA6]">
                      获得时间: {getUnlockTime(selectedMedal)}
                    </p>
                  </div>
                )}
                
                <div className="bg-[#FF7E67]/10 rounded-lg p-4">
                  <p className="text-sm text-[#FF7E67]">
                    奖励: {selectedMedal.rewards.map(reward => 
                      `${reward.value} ${reward.type === 'EXPERIENCE' ? '经验值' : '积分'}`
                    ).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

