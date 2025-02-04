import React, { useState, useEffect } from 'react';
import { getTaskCompletions, TaskCompletionsResponse } from '../services/api';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TaskHistory() {
  const [completions, setCompletions] = useState<TaskCompletionsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletions = async (page: number) => {
    setIsLoading(true);
    const response = await getTaskCompletions({
      page,
      limit: 10
    });

    if (response.success) {
      setCompletions(response.data);
      setError(null);
      if (response.data?.stats) {
        const statsToStore = {
          totalExperience: response.data.stats.totalExperience,
          averageTime: response.data.stats.averageTime,
          totalTasks: response.data.stats.totalTasks,
          currentStreak: response.data.stats.currentStreak || 0
        };
        localStorage.setItem('taskStats', JSON.stringify(statsToStore));
      }
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompletions(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (completions && currentPage < completions.pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7E67]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-[#FF7E67] mb-1">
            <Award className="w-6 h-6 mx-auto" />
          </div>
          <div className="text-sm text-gray-500">总经验</div>
          <div className="text-lg font-semibold">{completions?.stats.totalExperience || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-[#4B8CA6] mb-1">
            <Clock className="w-6 h-6 mx-auto" />
          </div>
          <div className="text-sm text-gray-500">平均用时</div>
          <div className="text-lg font-semibold">{Math.round(completions?.stats.averageTime || 0)}秒</div>
        </div>
        <div className="text-center">
          <div className="text-[#4B8CA6] mb-1">
            <Calendar className="w-6 h-6 mx-auto" />
          </div>
          <div className="text-sm text-gray-500">总任务数</div>
          <div className="text-lg font-semibold">{completions?.stats.totalTasks || 0}</div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {completions?.completions.map((completion, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-medium text-gray-800">
                {completion.task.description}
              </h3>
              <span className="text-sm text-gray-500">
                {format(new Date(completion.completedAt), 'MM-dd HH:mm', { locale: zhCN })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {completion.task.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                用时: {completion.timeSpent}秒
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页控制 */}
      {completions && completions.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center text-gray-600 disabled:text-gray-300"
          >
            <ChevronLeft className="w-5 h-5" />
            上一页
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {completions.pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === completions.pagination.totalPages}
            className="flex items-center text-gray-600 disabled:text-gray-300"
          >
            下一页
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
} 