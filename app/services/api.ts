import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3004/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// 登录函数
export const loginUser = async (credentials: LoginRequest) => {
  try {
    const response = await fetch('http://localhost:3004/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: credentials.phone,
        password: credentials.password
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '登录失败');
    }

    if (data.code === 200 && data.data) {
      const { token, refreshToken, userInfo } = data.data;
      
      // 存储令牌和用户信息
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // 如果是首次登录，初始化任务统计数据
      if (!localStorage.getItem('taskStats')) {
        const initialTaskStats = {
          totalExperience: 0,
          averageTime: 0,
          totalTasks: 0,
          currentStreak: 0
        };
        localStorage.setItem('taskStats', JSON.stringify(initialTaskStats));
        localStorage.setItem('unlockedMedals', JSON.stringify([]));
      }
      
      return { success: true, data: data.data };
    }
    
    return { success: false, error: data.message };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '登录失败'
    };
  }
};

// 注册函数
export const registerUser = async (credentials: RegisterRequest) => {
  try {
    const response = await fetch('http://localhost:3004/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        phone: credentials.phone,
        password: credentials.password,
        username: credentials.username
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '注册失败');
    }

    // 初始化新用户的任务统计数据
    const initialTaskStats = {
      totalExperience: 0,
      averageTime: 0,
      totalTasks: 0,
      currentStreak: 0
    };
    
    // 存储初始统计数据
    localStorage.setItem('taskStats', JSON.stringify(initialTaskStats));
    localStorage.setItem('unlockedMedals', JSON.stringify([]));

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '注册失败'
    };
  }
};

// 退出登录函数
export const logout = () => {
  // 清除本地存储的用户信息和令牌
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};

// 获取任务列表
export const getTasks = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  isNightTask?: boolean;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isNightTask !== undefined) queryParams.append('isNightTask', params.isNightTask.toString());

    const response = await fetch(
      `http://localhost:3004/api/tasks?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '获取任务列表失败');
    }

    return data;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取任务列表失败'
    };
  }
};

// 获取随机任务
export const getRandomTask = async (params?: {
  category?: string;
  tags?: string[];
  isNightTask?: boolean;
  excludeIds?: number[];
}) => {
  try {
    let url = 'http://localhost:3004/api/tasks/random';
    const queryParams: string[] = [];

    if (params?.category) {
      queryParams.push(`category=${encodeURIComponent(params.category)}`);
    }
    if (params?.tags && params.tags.length > 0) {
      queryParams.push(`tags=${params.tags.map(tag => encodeURIComponent(tag)).join(',')}`);
    }
    if (params?.isNightTask !== undefined) {
      queryParams.push(`isNightTask=${params.isNightTask}`);
    }
    if (params?.excludeIds && params.excludeIds.length > 0) {
      queryParams.push(`excludeIds=${params.excludeIds.join(',')}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    console.log('请求URL:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    console.log('API返回的原始数据:', data);
    
    if (data.code !== 200) {
      throw new Error(data.message || '获取随机任务失败');
    }

    return {
      success: true,
      data: data.data.task
    };
  } catch (error) {
    console.error('获取随机任务失败:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取随机任务失败'
    };
  }
};

// 定义完成任务的响应类型
interface TaskCompletionResponse {
  completion: {
    userId: string;
    taskId: number;
    completedAt: Date;
    timeSpent: number;
    experienceGained: number;
    pointsGained: number;
  };
  rewards: {
    experienceGained: number;
    pointsGained: number;
  };
  userStats: {
    newLevel: number;
    newExperience: number;
    nextLevelExp: number;
    streak: number;
  };
}

// 记录任务完成
export const completeTask = async (taskId: number, timeSpent: number) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('请先登录');
    }

    const response = await fetch('http://localhost:3004/api/tasks/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        taskId,
        timeSpent,
        completedAt: new Date().toISOString()
      })
    });

    const data = await response.json();
    console.log('任务完成响应:', data);
    
    if (response.ok && data.code === 200) {
      return {
        success: true,
        data: data.data
      };
    }

    throw new Error(data.message || '任务完成失败');

  } catch (error) {
    console.error('任务完成失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '任务完成失败'
    };
  }
};

// 定义任务完成记录的接口类型
export interface TaskCompletion {
  taskId: number;  // 这是实际的任务ID
  task: {         // 添加这个字段来包含任务详情
    description: string;
    category: string;
    tags: string[];
  };
  completedAt: Date;
  timeSpent: number;
  experienceGained: number;
}

export interface TaskCompletionsResponse {
  completions: TaskCompletion[];
  stats: {
    totalExperience: number;
    averageTime: number;
    totalTasks: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 获取任务完成记录
export const getTaskCompletions = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(
      `http://localhost:3004/api/tasks/completions?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const data = await response.json();
    
    if (data.code === 200) {
      return {
        success: true,
        data: data.data as TaskCompletionsResponse
      };
    }

    return {
      success: false,
      error: data.message || '获取任务完成记录失败'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取任务完成记录失败'
    };
  }
};

// 日历数据接口定义
export interface CalendarData {
  year: number;
  month: number;
  completedDates: number[];  // 已完成日期数组
  currentStreak: number;     // 当前连续天数
  longestStreak: number;     // 最长连续天数
}

// 获取日历数据的 API 函数
export const getCalendarData = async (year: number, month: number) => {
  try {
    // 添加请求前的日志
    console.log(`准备请求日历数据 - 年份: ${year}, 月份: ${month}`)
    console.log('请求URL:', `http://localhost:3004/api/calendar?year=${year}&month=${month}`)
    
    // 获取并打印 token
    const token = localStorage.getItem('token')
    console.log('Authorization Token:', token ? '已设置' : '未设置')

    const response = await fetch(
      `http://localhost:3004/api/calendar?year=${year}&month=${month}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 添加响应状态日志
    console.log('API响应状态:', response.status, response.statusText)
    
    const data = await response.json();
    console.log('API原始响应数据:', data)
    
    if (data.code === 200) {
      console.log('数据获取成功:', data.data)
      return {
        success: true,
        data: data.data as CalendarData
      };
    }
    
    console.error('API返回错误:', data.message)
    return { success: false, error: data.message };
  } catch (error) {
    console.error('API请求异常:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取日历数据失败'
    };
  }
};

// 修改勋章接口定义以匹配后端数据
export interface Medal {
  id: string;           // 改为 string 类型
  name: string;
  icon: string;         // 基础图标
  displayIcon: string;  // 已解锁显示图标
  description: string;
  criteria: {           // 新增解锁条件结构
    type: string;
    value: number;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  rewards?: Array<{     // 新增奖励数组
    type: string;
    value: number;
  }>;
}

// 获取勋章列表的 API 函数
export const getMedals = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('请先登录');
    }
    
    const response = await fetch('http://localhost:3004/api/medals', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('获取勋章失败');
    }
    
    const data = await response.json();
    console.log('勋章数据响应:', data);
    
    if (data.code === 200 && data.data?.medals) {
      return data.data.medals;
    }
    
    throw new Error(data.message || '获取勋章失败');
    
  } catch (error) {
    console.error('获取勋章失败:', error);
    throw error;
  }
};

export default api; 