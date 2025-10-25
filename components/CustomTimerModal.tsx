'use client';

import { useState } from 'react';
import { useFocusStore } from '@/lib/store';
import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomTimerModal({ isOpen, onClose }: CustomTimerModalProps) {
  const { setTimeRemaining, setTotalTime, setState, setMode } = useFocusStore();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleSetTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds > 0) {
      setMode('custom');
      setTimeRemaining(totalSeconds);
      setTotalTime(totalSeconds);
      setState('idle');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50"
          >
            <div className="backdrop-blur-2xl bg-[var(--glass-bg)] border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#30D158] to-[#0A84FF]">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--neutral-50)]">Custom Timer</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--neutral-400)]" />
                </button>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-400)] mb-2">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[var(--neutral-50)] focus:border-[#30D158] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-400)] mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[var(--neutral-50)] focus:border-[#30D158] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--neutral-400)] mb-3">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '30 min', h: 0, m: 30 },
                    { label: '45 min', h: 0, m: 45 },
                    { label: '1 hour', h: 1, m: 0 },
                    { label: '1.5 hours', h: 1, m: 30 },
                    { label: '2 hours', h: 2, m: 0 },
                    { label: '3 hours', h: 3, m: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setHours(preset.h);
                        setMinutes(preset.m);
                      }}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-[var(--neutral-300)] font-medium transition-all hover:scale-105"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[var(--neutral-300)] font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetTimer}
                  disabled={hours === 0 && minutes === 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#30D158] to-[#0A84FF] hover:shadow-lg hover:shadow-[#30D158]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
                >
                  Set Timer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
