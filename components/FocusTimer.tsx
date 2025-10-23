'use client';

import { useEffect, useRef } from 'react';
import { useFocusStore } from '@/lib/store';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface FocusTimerProps {
  userId: string;
}

export function FocusTimer({ userId }: FocusTimerProps) {
  const {
    state,
    timeRemaining,
    totalTime,
    mode,
    isBreak,
    pomodoroRound,
    setState,
    setTimeRemaining,
    setPomodoroRound,
    setIsBreak,
    setTotalTime,
  } = useFocusStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (state === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && state === 'running') {
      setState('completed');
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, timeRemaining]);

  const saveSession = async (duration: number) => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          mode,
          duration,
        }),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleTimerComplete = async () => {
    // Save the completed session (only for work sessions, not breaks)
    if (!isBreak) {
      const completedDuration = totalTime;
      await saveSession(completedDuration);
    }

    if (mode === 'pomodoro') {
      if (!isBreak) {
        // Work session completed, start break
        const breakTime = pomodoroRound % 4 === 0 ? 15 * 60 : 5 * 60; // Long break every 4 rounds
        setIsBreak(true);
        setTimeRemaining(breakTime);
        setTotalTime(breakTime);
      } else {
        // Break completed, start new work session
        setIsBreak(false);
        setPomodoroRound(pomodoroRound + 1);
        setTimeRemaining(25 * 60);
        setTotalTime(25 * 60);
      }
      setState('idle');
    }
  };

  const handlePlayPause = () => {
    if (state === 'idle' || state === 'paused') {
      if (state === 'idle') {
        sessionStartTimeRef.current = Date.now();
      }
      setState('running');
    } else if (state === 'running') {
      setState('paused');
    }
  };

  const handleReset = () => {
    setState('idle');
    if (mode === 'pomodoro') {
      setTimeRemaining(25 * 60);
      setTotalTime(25 * 60);
      setIsBreak(false);
    } else if (mode === 'deep-work') {
      setTimeRemaining(90 * 60);
      setTotalTime(90 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Timer Display */}
      <div className="relative">
        {/* Progress Ring */}
        <svg className="w-80 h-80 transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-800/30"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 880' }}
            animate={{ 
              strokeDasharray: `${(progress / 100) * 880} 880`,
            }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={timeRemaining}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {formatTime(timeRemaining)}
          </motion.div>
          <div className="text-sm text-gray-400 mt-2">
            {mode === 'pomodoro' && (
              <span>
                {isBreak ? 'Break Time' : `Focus Session ${pomodoroRound}`}
              </span>
            )}
            {mode === 'deep-work' && <span>Deep Work</span>}
            {mode === 'custom' && <span>Custom Timer</span>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {state === 'running' ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Completion Message */}
      {state === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">Session Complete!</span>
        </motion.div>
      )}
    </div>
  );
}
