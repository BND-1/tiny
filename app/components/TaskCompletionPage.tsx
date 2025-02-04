import { Share, ArrowRight } from "lucide-react"

type TaskCompletionPageProps = {
  onClose: () => void
}

export default function TaskCompletionPage({ onClose }: TaskCompletionPageProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-slideUp">
        <div className="text-center mb-6" style={{ height: "50vh" }}>
          <div className="h-full bg-gray-200 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500">庆祝动画区 (Lottie动画)</span>
          </div>
        </div>

        <h2 className="text-[18px] font-semibold mb-4 text-center text-[#2D3748]">解锁连续3天成就！✨</h2>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 h-[400px] w-[300px] mx-auto flex items-center justify-center">
          <p className="text-center">分享卡片预览区</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center bg-[#FF7E67] text-white rounded-lg px-4 py-3 text-[16px] font-semibold">
            <Share size={20} className="mr-2" />
            分享朋友圈
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-[#4B8CA6] text-white rounded-lg px-4 py-3 text-[16px] font-semibold"
          >
            <ArrowRight size={20} className="mr-2" />
            继续新任务
          </button>
        </div>
      </div>
    </div>
  )
}

