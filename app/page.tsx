"use client"

import { useState } from "react"
import { useNavigation } from "../hooks/useNavigation"
import HomePage from "./components/HomePage"
import AchievementWallPage from "./components/AchievementWallPage"
import ProfilePage from "./components/ProfilePage"
import TabBar from "./components/TabBar"
import TaskCompletionPage from "./components/TaskCompletionPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  const { currentPage, setCurrentPage } = useNavigation()
  const [showTaskCompletion, setShowTaskCompletion] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        <main className="flex-1 overflow-y-auto">
          {currentPage === "home" && <HomePage onTaskComplete={() => setShowTaskCompletion(true)} />}
          {currentPage === "achievements" && <AchievementWallPage />}
          {currentPage === "profile" && <ProfilePage />}
        </main>
        <TabBar currentPage={currentPage} onChangePage={setCurrentPage} />
        {showTaskCompletion && <TaskCompletionPage onClose={() => setShowTaskCompletion(false)} />}
      </div>
    </ProtectedRoute>
  )
}

