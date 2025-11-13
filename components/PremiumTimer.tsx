'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { useFocusStore } from '@/lib/store';

interface PremiumTimerProps {
  initialTime: number; // in seconds
  onComplete?: () => void;
  mode: 'pomodoro' | 'deep-work' | 'custom';
}

export function PremiumTimer({ initialTime, onComplete, mode }: PremiumTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { setMusicPlaying, setMusicType } = useFocusStore();

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Reset timer when initialTime changes (e.g., custom time set)
  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          setMusicPlaying(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, setMusicPlaying]);

  // Auto-control music based on timer state
  useEffect(() => {
    if (isRunning) {
      setMusicType('binaural');
      setMusicPlaying(true);
    } else if (!isCompleted) {
      setMusicPlaying(false);
    }
  }, [isRunning, isCompleted, setMusicPlaying, setMusicType]);

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsCompleted(false);
    setMusicPlaying(false);
  };

  const getModeColor = () => {
    switch (mode) {
      case 'pomodoro':
        return 'from-[#FF453A] to-[#FF9F0A]'; // Red to Orange
      case 'deep-work':
        return 'from-[#0A84FF] to-[#5E5CE6]'; // Blue to Purple
      case 'custom':
        return 'from-[#30D158] to-[#0A84FF]'; // Green to Blue
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Timer Container - Glassmorphism */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative backdrop-blur-2xl bg-gray-a3 border border-gray-a5 rounded-[32px] p-12 shadow-2xl"
      >
        {/* Ambient Glow */}
        <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${getModeColor()} opacity-10 blur-3xl`} />

        {/* Progress Ring */}
        <div className="relative w-full aspect-square max-w-[320px] mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--gray-a3)"
              strokeWidth="8"
            />
            
            {/* Progress Circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90}
              initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                {mode === 'pomodoro' && (
                  <>
                    <stop offset="0%" stopColor="#FF453A" />
                    <stop offset="100%" stopColor="#FF9F0A" />
                  </>
                )}
                {mode === 'deep-work' && (
                  <>
                    <stop offset="0%" stopColor="#0A84FF" />
                    <stop offset="100%" stopColor="#5E5CE6" />
                  </>
                )}
                {mode === 'custom' && (
                  <>
                    <stop offset="0%" stopColor="#30D158" />
                    <stop offset="100%" stopColor="#0A84FF" />
                  </>
                )}
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display - Center of Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getModeColor()} flex items-center justify-center mb-4`}>
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-12">Complete!</p>
                </motion.div>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-7xl font-light tracking-tight text-gray-12 tabular-nums">
                    {String(minutes).padStart(2, '0')}
                    <span className="text-gray-11 mx-1">:</span>
                    {String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-sm font-medium text-gray-11 mt-2 uppercase tracking-wider">
                    {mode.replace('-', ' ')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="w-14 h-14 rounded-full backdrop-blur-xl bg-gray-a3 border border-gray-a5 flex items-center justify-center hover:bg-gray-a4 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-gray-12" />
          </motion.button>

          {/* Play/Pause Button - Hero */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            disabled={isCompleted}
            className={`
              relative w-20 h-20 rounded-full 
              bg-gradient-to-br ${getModeColor()}
              shadow-2xl
              flex items-center justify-center
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getModeColor()} blur-xl opacity-50`} />
            
            {/* Icon */}
            <div className="relative">
              {isRunning ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </div>
          </motion.button>

          {/* Spacer for symmetry */}
          <div className="w-14 h-14" />
        </div>

        {/* Progress Percentage */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-10">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </motion.div>

      {/* Breathing Animation Indicator */}
      {isRunning && (
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${getModeColor()} opacity-5 pointer-events-none`}
        />
      )}
    </div>
  );
}
