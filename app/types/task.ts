export interface Task {
  id: string;
  taskId: number;      // 添加 taskId 字段
  category: string;    // 任务分类
  description: string; // 任务描述
  estimatedTime: number; // 预计完成时间（秒）
  tags: string[];      // 标签数组
  difficulty: number;  // 难度等级 1-5
  points: number;      // 任务积分
  isNightTask: boolean; // 是否夜间任务
  animation: 'orange' | 'search' | 'weather' | 'camera';
}

export interface TaskResponse {
  code: number;
  message: string;
  data: {
    task: Task;
  };
}

export interface TaskCompleteRequest {
  taskId: number;      // 任务ID
  timeSpent: number;   // 实际花费时间（秒）
}

export interface TaskCompleteResponse {
  success: boolean;
  message: string;
  data?: {
    experienceGained: number;  // 获得的经验值
    newLevel: number;         // 当前等级
    newExperience: number;    // 当前经验值
    nextLevelExp: number;     // 下一级所需经验值
    streak: number;          // 连续完成任务次数
  };
} 