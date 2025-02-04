import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CountdownAnimationProps = {
  number: number;
}

export default function CountdownAnimation({ number }: CountdownAnimationProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={number}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[120px] font-bold text-white"
        >
          {number}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 