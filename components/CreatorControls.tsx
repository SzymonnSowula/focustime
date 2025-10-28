'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp } from 'lucide-react';
import { StartSessionModal } from './StartSessionModal';

interface CreatorControlsProps {
  companyId: string;
  onSessionCreated?: () => void;
}

export function CreatorControls({ companyId, onSessionCreated }: CreatorControlsProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <StartSessionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        companyId={companyId}
        onSessionCreated={onSessionCreated}
      />

      <div className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#5E5CE6]">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Creator Controls</h3>
              <p className="text-sm text-[var(--neutral-400)]">
                Start a focus session for your community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0A84FF] to-[#5E5CE6] rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#0A84FF]/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Start Session
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">🔥</div>
            <div className="text-xs text-[var(--neutral-400)]">Increase Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">⏱️</div>
            <div className="text-xs text-[var(--neutral-400)]">Build Accountability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">🤝</div>
            <div className="text-xs text-[var(--neutral-400)]">Stronger Community</div>
          </div>
        </div>
      </div>
    </>
  );
}