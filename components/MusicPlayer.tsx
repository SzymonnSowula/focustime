'use client';

import { useEffect } from 'react';
import { useFocusStore } from '@/lib/store';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioGenerator } from '@/lib/audioGenerator';

const musicTypes = [
  // { id: 'lofi', name: 'Lo-Fi', color: 'from-blue-500 to-cyan-500', icon: '🎵' },
  { id: 'binaural', name: 'Binaural', color: 'from-purple-500 to-pink-500', icon: '🧠' },
  // { id: 'nature', name: 'Nature', color: 'from-green-500 to-emerald-500', icon: '🌿' },
  { id: 'none', name: 'None', color: 'from-gray-600 to-gray-700', icon: '🔇' },
] as const;

export function MusicPlayer() {
  const { musicPlaying, musicType, volume, setMusicPlaying, setMusicType, setVolume } = useFocusStore();

  useEffect(() => {
    return () => {
      audioGenerator.stop();
    };
  }, []);

  useEffect(() => {
    if (musicPlaying && musicType !== 'none') {
      audioGenerator.setVolume(volume);
      audioGenerator.play(musicType as any);
    } else {
      audioGenerator.stop();
    }
  }, [musicPlaying, musicType]);

  useEffect(() => {
    audioGenerator.setVolume(volume);
  }, [volume]);

  const toggleMusic = () => {
    if (musicType === 'none') {
      setMusicType('binaural');
      setMusicPlaying(true);
    } else {
      setMusicPlaying(!musicPlaying);
    }
  };

  return (
    <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 relative">
          <Music className="w-5 h-5 !text-white" />
          {musicPlaying && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold !text-white">AI-Generated Music</h3>
          <p className="text-sm text-gray-300">Real-time procedural audio for focus</p>
        </div>
        {musicPlaying && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 text-green-400 text-sm font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Playing
          </motion.div>
        )}
      </div>

      {/* Music Type Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {musicTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMusicType(type.id);
              if (type.id !== 'none') {
                setMusicPlaying(true);
              } else {
                setMusicPlaying(false);
              }
            }}
            className={`
              px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
              ${musicType === type.id
                ? `bg-gradient-to-r ${type.color} !text-white shadow-lg`
                : 'bg-white/5 text-gray-200 hover:bg-white/10 hover:!text-white border border-white/10'
              }
            `}
          >
            <span className="text-lg">{type.icon}</span>
            <span>{type.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Volume Control */}
      {musicType !== 'none' && (
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMusic}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            {musicPlaying ? (
              <Volume2 className="w-5 h-5 !text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-300" />
            )}
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(236, 72, 153) ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
              }}
            />
          </div>

          <span className="text-sm !text-white font-medium w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
