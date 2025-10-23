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
  const { setTimeRemaining, setTotalTime, setState } = useFocusStore();
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const handleSetTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds > 0) {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-200">Custom Timer</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Quick Presets</label>
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
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
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
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetTimer}
                disabled={hours === 0 && minutes === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all"
              >
                Set Timer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
