import { useState } from "react"

type Page = "home" | "achievements" | "profile"

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  return { currentPage, setCurrentPage }
}

