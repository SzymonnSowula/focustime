'use client';

export type SoundType = 'lofi' | 'binaural' | 'nature' | 'ambient';

class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.audioContext!.sampleRate * 2;
    const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  private createBinauralBeats() {
    if (!this.audioContext || !this.masterGain) return;

    // Left ear: 200 Hz
    const leftOsc = this.audioContext.createOscillator();
    leftOsc.frequency.value = 200;
    leftOsc.type = 'sine';
    
    const leftGain = this.audioContext.createGain();
    leftGain.gain.value = 0.15;
    
    const leftMerger = this.audioContext.createChannelMerger(2);
    leftOsc.connect(leftGain);
    leftGain.connect(leftMerger, 0, 0);
    
    // Right ear: 210 Hz (10 Hz difference = Alpha waves)
    const rightOsc = this.audioContext.createOscillator();
    rightOsc.frequency.value = 210;
    rightOsc.type = 'sine';
    
    const rightGain = this.audioContext.createGain();
    rightGain.gain.value = 0.15;
    
    rightOsc.connect(rightGain);
    rightGain.connect(leftMerger, 0, 1);
    
    leftMerger.connect(this.masterGain);
    
    leftOsc.start();
    rightOsc.start();
    
    this.oscillators.push(leftOsc, rightOsc);
  }

  private createLoFiBeats() {
    if (!this.audioContext || !this.masterGain) return;

    // Bass drum pattern
    const bass = this.audioContext.createOscillator();
    bass.frequency.value = 60;
    bass.type = 'sine';
    
    const bassGain = this.audioContext.createGain();
    bassGain.gain.value = 0;
    
    bass.connect(bassGain);
    bassGain.connect(this.masterGain);
    bass.start();
    
    // Kick pattern
    const kickPattern = () => {
      const now = this.audioContext!.currentTime;
      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    };
    
    setInterval(kickPattern, 800);
    
    // Hi-hat
    const noiseBuffer = this.createNoiseBuffer();
    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 8000;
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.value = 0.05;
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
    
    this.noiseNode = noise;
    this.oscillators.push(bass);
    
    // Ambient pad
    const pad = this.audioContext.createOscillator();
    pad.frequency.value = 220;
    pad.type = 'triangle';
    
    const padGain = this.audioContext.createGain();
    padGain.gain.value = 0.08;
    
    const padFilter = this.audioContext.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 800;
    
    pad.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.masterGain);
    pad.start();
    
    this.oscillators.push(pad);
  }

  private createNatureSounds() {
    if (!this.audioContext || !this.masterGain) return;

    // Rain sound (filtered noise)
    const noiseBuffer = this.createNoiseBuffer();
    const rain = this.audioContext.createBufferSource();
    rain.buffer = noiseBuffer;
    rain.loop = true;
    
    const rainFilter = this.audioContext.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1000;
    rainFilter.Q.value = 0.5;
    
    const rainGain = this.audioContext.createGain();
    rainGain.gain.value = 0.15;
    
    rain.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rain.start();
    
    this.noiseNode = rain;
    
    // Wind (low frequency oscillation)
    const wind = this.audioContext.createOscillator();
    wind.frequency.value = 0.5;
    wind.type = 'sine';
    
    const windGain = this.audioContext.createGain();
    windGain.gain.value = 0;
    
    const windLFO = this.audioContext.createOscillator();
    windLFO.frequency.value = 0.1;
    windLFO.type = 'sine';
    
    const windLFOGain = this.audioContext.createGain();
    windLFOGain.gain.value = 0.05;
    
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windGain.gain);
    
    wind.connect(windGain);
    windGain.connect(this.masterGain);
    
    wind.start();
    windLFO.start();
    
    this.oscillators.push(wind, windLFO);
  }

  private createAmbient() {
    if (!this.audioContext || !this.masterGain) return;

    // Drone
    const drone = this.audioContext.createOscillator();
    drone.frequency.value = 110;
    drone.type = 'sawtooth';
    
    const droneGain = this.audioContext.createGain();
    droneGain.gain.value = 0.06;
    
    const droneFilter = this.audioContext.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 400;
    
    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();
    
    // Pad
    const pad = this.audioContext.createOscillator();
    pad.frequency.value = 165;
    pad.type = 'triangle';
    
    const padGain = this.audioContext.createGain();
    padGain.gain.value = 0.05;
    
    pad.connect(padGain);
    padGain.connect(this.masterGain);
    pad.start();
    
    this.oscillators.push(drone, pad);
  }

  play(type: SoundType) {
    if (this.isPlaying) {
      this.stop();
    }

    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (type) {
      case 'binaural':
        this.createBinauralBeats();
        break;
      case 'lofi':
        this.createLoFiBeats();
        break;
      case 'nature':
        this.createNatureSounds();
        break;
      case 'ambient':
        this.createAmbient();
        break;
    }

    this.isPlaying = true;
  }

  stop() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
      } catch (e) {
        // Already stopped
      }
    }
    
    this.oscillators = [];
    this.noiseNode = null;
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioGenerator = new AudioGenerator();
