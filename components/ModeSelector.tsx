'use client';

import { useState } from 'react';
import { useFocusStore, TimerMode } from '@/lib/store';
import { Clock, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomTimerModal } from './CustomTimerModal';

const modes = [
  {
    id: 'pomodoro' as TimerMode,
    name: 'Pomodoro',
    description: '25 min focus + 5 min break',
    icon: Clock,
    duration: 25 * 60,
  },
  {
    id: 'deep-work' as TimerMode,
    name: 'Deep Work',
    description: '90 min uninterrupted focus',
    icon: Zap,
    duration: 90 * 60,
  },
  {
    id: 'custom' as TimerMode,
    name: 'Custom',
    description: 'Set your own duration',
    icon: Settings,
    duration: 60 * 60,
  },
];

export function ModeSelector() {
  const { mode, setMode, setState, setTimeRemaining, setTotalTime, state } = useFocusStore();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleModeChange = (newMode: TimerMode, duration: number) => {
    if (state === 'running') return; // Don't change mode while timer is running
    
    if (newMode === 'custom') {
      setMode(newMode);
      setShowCustomModal(true);
      return;
    }
    
    setMode(newMode);
    setTimeRemaining(duration);
    setTotalTime(duration);
    setState('idle');
  };

  return (
    <>
      <CustomTimerModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      {modes.map((modeOption) => {
        const Icon = modeOption.icon;
        const isActive = mode === modeOption.id;
        
        return (
          <motion.button
            key={modeOption.id}
            whileHover={{ scale: state === 'running' ? 1 : 1.02 }}
            whileTap={{ scale: state === 'running' ? 1 : 0.98 }}
            onClick={() => handleModeChange(modeOption.id, modeOption.duration)}
            disabled={state === 'running'}
            className={`
              relative p-6 rounded-2xl border-2 transition-all
              ${isActive 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }
              ${state === 'running' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`
                p-3 rounded-xl
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-800'
                }
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="text-center">
                <h3 className={`
                  font-semibold text-lg
                  ${isActive ? 'text-purple-400' : 'text-gray-200'}
                `}>
                  {modeOption.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {modeOption.description}
                </p>
              </div>
            </div>

            {isActive && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 rounded-2xl border-2 border-purple-500"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
      </div>
    </>
  );
}
