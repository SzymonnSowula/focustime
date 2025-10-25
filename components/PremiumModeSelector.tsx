'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Settings2 } from 'lucide-react';
import { useFocusStore } from '@/lib/store';
import { CustomTimerModal } from './CustomTimerModal';

const modes = [
  {
    id: 'pomodoro' as const,
    name: 'Pomodoro',
    description: '25 min focus, 5 min break',
    icon: Clock,
    gradient: 'from-[#FF453A] to-[#FF9F0A]',
    duration: 25 * 60,
  },
  {
    id: 'deep-work' as const,
    name: 'Deep Work',
    description: '90 min deep focus',
    icon: Zap,
    gradient: 'from-[#0A84FF] to-[#5E5CE6]',
    duration: 90 * 60,
  },
  {
    id: 'custom' as const,
    name: 'Custom',
    description: 'Set your own time',
    icon: Settings2,
    gradient: 'from-[#30D158] to-[#0A84FF]',
    duration: 45 * 60,
  },
];

export function PremiumModeSelector() {
  const { mode, setMode } = useFocusStore();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleModeClick = (modeId: 'pomodoro' | 'deep-work' | 'custom') => {
    if (modeId === 'custom') {
      setShowCustomModal(true);
    } else {
      setMode(modeId);
    }
  };

  return (
    <>
      <CustomTimerModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
      <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-[var(--neutral-50)] mb-2 tracking-tight">
          Choose Your Focus
        </h2>
        <p className="text-[var(--neutral-400)] text-sm">
          Select a mode that matches your workflow
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((modeOption, index) => {
          const isSelected = mode === modeOption.id;
          const Icon = modeOption.icon;

          return (
            <motion.button
              key={modeOption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeClick(modeOption.id)}
              className="relative group"
            >
              {/* Card Container */}
              <div
                className={`
                  relative overflow-hidden
                  backdrop-blur-2xl rounded-3xl p-6
                  border transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-[var(--glass-bg)] border-white/20 shadow-2xl'
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }
                `}
              >
                {/* Selected Indicator - Gradient Glow */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-mode"
                    className={`absolute inset-0 bg-gradient-to-br ${modeOption.gradient} opacity-10 rounded-3xl`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl mb-4
                      flex items-center justify-center
                      transition-all duration-300
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${modeOption.gradient}`
                          : 'bg-white/5 group-hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon
                      className={`w-7 h-7 transition-colors ${
                        isSelected ? 'text-white' : 'text-[var(--neutral-300)]'
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <h3
                    className={`text-xl font-semibold mb-1 transition-colors ${
                      isSelected ? 'text-[var(--neutral-50)]' : 'text-[var(--neutral-200)]'
                    }`}
                  >
                    {modeOption.name}
                  </h3>
                  <p className="text-sm text-[var(--neutral-400)]">
                    {modeOption.description}
                  </p>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${modeOption.gradient} flex items-center justify-center`}>
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Hover Gradient Border Effect */}
                <div
                  className={`
                    absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity
                    bg-gradient-to-br ${modeOption.gradient}
                    blur-xl -z-10
                  `}
                  style={{ transform: 'scale(0.95)' }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Subtle Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 text-xs text-[var(--neutral-500)]"
      >
        Tap to switch modes • Your progress will be saved
      </motion.p>
      </div>
    </>
  );
}
