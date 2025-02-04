import { Home, Award, User } from "lucide-react"

type TabBarProps = {
  currentPage: string
  onChangePage: (page: "home" | "achievements" | "profile") => void
}

export default function TabBar({ currentPage, onChangePage }: TabBarProps) {
  return (
    <div className="flex justify-around items-center h-16 bg-white border-t border-gray-200">
      <button
        onClick={() => onChangePage("home")}
        className={`flex flex-col items-center ${currentPage === "home" ? "text-green-500" : "text-gray-500"}`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">首页</span>
      </button>
      <button
        onClick={() => onChangePage("achievements")}
        className={`flex flex-col items-center ${currentPage === "achievements" ? "text-green-500" : "text-gray-500"}`}
      >
        <Award size={24} />
        <span className="text-xs mt-1">成就</span>
      </button>
      <button
        onClick={() => onChangePage("profile")}
        className={`flex flex-col items-center ${currentPage === "profile" ? "text-green-500" : "text-gray-500"}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">我的</span>
      </button>
    </div>
  )
}

