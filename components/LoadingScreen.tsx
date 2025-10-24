'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Ambient Light Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/focustime.jpg"
              alt="FocusTime Logo"
              width={120}
              height={120}
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl -z-10"
          />
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            FocusTime
          </h2>
          <p className="text-gray-400 text-sm">Loading your focus space...</p>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-700 border-t-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}
