'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, Zap } from 'lucide-react';

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSessionCreated?: () => void;
}

const modes = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: '25 min focus session',
    icon: Clock,
    duration: 25 * 60,
    gradient: 'from-[#FF453A] to-[#FF9F0A]',
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    description: '90 min deep focus',
    icon: Zap,
    duration: 90 * 60,
    gradient: 'from-[#0A84FF] to-[#5E5CE6]',
  },
];

export function StartSessionModal({ isOpen, onClose, companyId, onSessionCreated }: StartSessionModalProps) {
  const [selectedMode, setSelectedMode] = useState<'pomodoro' | 'deep-work'>('pomodoro');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    const mode = modes.find(m => m.id === selectedMode);
    if (!mode) return;

    setCreating(true);
    try {
      const res = await fetch('/api/community/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          mode: mode.id,
          duration: mode.duration,
          title: title || mode.name + ' Session',
        }),
      });

      if (res.ok) {
        onSessionCreated?.();
        onClose();
        setTitle('');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreating(false);
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
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#5E5CE6]">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--neutral-50)]">Start Community Session</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--neutral-400)]" />
                </button>
              </div>

              {/* Session Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--neutral-400)] mb-2">
                  Session Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning Deep Work"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[var(--neutral-50)] placeholder:text-[var(--neutral-600)] focus:border-[#0A84FF] focus:outline-none transition-colors"
                />
              </div>

              {/* Mode Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--neutral-400)] mb-3">
                  Choose Focus Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {modes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;

                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id as 'pomodoro' | 'deep-work')}
                        className={`
                          relative p-4 rounded-2xl border-2 transition-all
                          ${isSelected
                            ? 'border-white/20 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/15'
                          }
                        `}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selected-session-mode"
                            className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-10 rounded-2xl`}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className="relative">
                          <div className={`
                            w-10 h-10 rounded-xl mb-3 flex items-center justify-center
                            ${isSelected
                              ? `bg-gradient-to-br ${mode.gradient}`
                              : 'bg-white/5'
                            }
                          `}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-[var(--neutral-300)]'}`}>
                            {mode.name}
                          </h3>
                          <p className="text-xs text-[var(--neutral-500)]">{mode.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  💡 Your community members will be notified and can join your session in real-time!
                </p>
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
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0A84FF] to-[#5E5CE6] hover:shadow-lg hover:shadow-[#0A84FF]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      Start Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}