import { create } from 'zustand';

export type TimerMode = 'pomodoro' | 'deep-work' | 'custom';
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface FocusStore {
  // Timer state
  mode: TimerMode;
  state: TimerState;
  timeRemaining: number;
  totalTime: number;
  
  // Pomodoro specific
  pomodoroRound: number;
  isBreak: boolean;
  
  // Music state
  musicPlaying: boolean;
  musicType: 'binaural' | 'lofi' | 'nature' | 'none';
  volume: number;
  
  // Actions
  setMode: (mode: TimerMode) => void;
  setState: (state: TimerState) => void;
  setTimeRemaining: (time: number) => void;
  setTotalTime: (time: number) => void;
  setPomodoroRound: (round: number) => void;
  setIsBreak: (isBreak: boolean) => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicType: (type: 'binaural' | 'lofi' | 'nature' | 'none') => void;
  setVolume: (volume: number) => void;
  resetTimer: () => void;
}

export const useFocusStore = create<FocusStore>((set) => ({
  // Initial state
  mode: 'pomodoro',
  state: 'idle',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  totalTime: 25 * 60,
  pomodoroRound: 1,
  isBreak: false,
  musicPlaying: false,
  musicType: 'lofi',
  volume: 0.5,
  
  // Actions
  setMode: (mode) => set({ mode }),
  setState: (state) => set({ state }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setTotalTime: (time) => set({ totalTime: time }),
  setPomodoroRound: (round) => set({ pomodoroRound: round }),
  setIsBreak: (isBreak) => set({ isBreak }),
  setMusicPlaying: (playing) => set({ musicPlaying: playing }),
  setMusicType: (type) => set({ musicType: type }),
  setVolume: (volume) => set({ volume }),
  resetTimer: () => set({ 
    state: 'idle', 
    timeRemaining: 25 * 60,
    totalTime: 25 * 60,
    pomodoroRound: 1,
    isBreak: false
  }),
}));
