import React from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Users } from 'lucide-react';

type ShareModalProps = {
  onClose: () => void;
  onShareToFriends: () => void;
  onShareToMoments: () => void;
}

export default function ShareModal({ onClose, onShareToFriends, onShareToMoments }: ShareModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#2D3748]">分享成就</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex justify-around mb-6">
          <button
            onClick={onShareToFriends}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-14 h-14 bg-[#4B8CA6] rounded-full flex items-center justify-center">
              <Share2 size={28} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">分享给好友</span>
          </button>
          
          <button
            onClick={onShareToMoments}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-14 h-14 bg-[#FF7E67] rounded-full flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">分享到朋友圈</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 