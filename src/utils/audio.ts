/**
 * Audio and Speech System for Smart English Tutor
 * Uses Web Speech API for authentic English pronunciations
 * Uses Web Audio API for responsive, zero-latency sound effects & ambient music
 */

class SoundEffectsSystem {
  private ctx: AudioContext | null = null;
  public soundEnabled = true;
  public musicEnabled = false;
  private musicInterval: number | null = null;
  private musicGainNode: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft card pickup/drag click
  playPickup() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext error ignored
    }
  }

  // Play a soft card drop sound
  playDrop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext error ignored
    }
  }

  // Play pleasant chime for correct answer
  playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {
      // AudioContext error ignored
    }
  }

  // Gentle friendly tone for wrong answer (not harsh)
  playIncorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.22);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext error ignored
    }
  }

  // Timer 10-second warning tick
  playWarningTick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // AudioContext error ignored
    }
  }

  // Victory fanfare for completion
  playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.14, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.5);
      });
    } catch {
      // AudioContext error ignored
    }
  }

  // Soft ambient study music generator (gentle relaxing harmonic progression)
  toggleBackgroundMusic(enable?: boolean) {
    if (enable !== undefined) {
      this.musicEnabled = enable;
    } else {
      this.musicEnabled = !this.musicEnabled;
    }

    if (!this.musicEnabled) {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      return false;
    }

    this.initCtx();
    if (!this.ctx) return false;

    // Chord progressions in C Major (I - vi - IV - V in gentle lofi tones)
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C
      [220.0, 261.63, 329.63, 440.0],  // Am
      [174.61, 220.0, 261.63, 349.23], // F
      [196.0, 246.94, 293.66, 392.0],  // G
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || !this.musicEnabled) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;

      currentChord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.015, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    if (this.musicInterval) clearInterval(this.musicInterval);
    this.musicInterval = window.setInterval(playChord, 3800);
    return true;
  }
}

export const soundEffects = new SoundEffectsSystem();

/**
 * Speech Synthesis helper for authentic UK/US voice
 */
class SpeechSystem {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isLoaded = false;
  public currentlyPlayingWord: string | null = null;
  private onStateChangeListeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    this.isLoaded = this.voices.length > 0;
  }

  public subscribe(cb: () => void) {
    this.onStateChangeListeners.add(cb);
    return () => {
      this.onStateChangeListeners.delete(cb);
    };
  }

  private notify() {
    this.onStateChangeListeners.forEach(cb => cb());
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  private getPreferredVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    // 1. Priority: English UK
    const ukVoice = this.voices.find(
      v => v.lang.startsWith('en-GB') || v.lang.startsWith('en_GB') || v.name.includes('United Kingdom') || v.name.includes('British')
    );
    if (ukVoice) return ukVoice;

    // 2. Fallback: English US
    const usVoice = this.voices.find(
      v => v.lang.startsWith('en-US') || v.lang.startsWith('en_US') || v.name.includes('US')
    );
    if (usVoice) return usVoice;

    // 3. Fallback: Any English voice
    const anyEn = this.voices.find(v => v.lang.startsWith('en'));
    return anyEn || this.voices[0] || null;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentlyPlayingWord = null;
      this.notify();
    }
  }

  /**
   * Speak a word
   * @param word The word to speak
   * @param isSlow Whether to speak slowly (0.65 rate) or natural (0.8 rate)
   */
  public speak(word: string, isSlow = false, onEnd?: () => void): boolean {
    if (!this.synth) return false;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    const voice = this.getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.rate = isSlow ? 0.6 : 0.8;
    utterance.pitch = 1.0;

    this.currentlyPlayingWord = word;
    this.notify();

    utterance.onend = () => {
      this.currentlyPlayingWord = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentlyPlayingWord = null;
      this.notify();
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
    return true;
  }

  /**
   * Listen and Compare mode:
   * Speaks base verb, waits ~500ms, then speaks inflected verb
   */
  public speakCompare(base: string, inflected: string, isSlow = false, onEnd?: () => void): boolean {
    if (!this.synth) return false;
    this.synth.cancel();

    this.currentlyPlayingWord = `${base} → ${inflected}`;
    this.notify();

    this.speak(base, isSlow, () => {
      setTimeout(() => {
        this.speak(inflected, isSlow, () => {
          this.currentlyPlayingWord = null;
          this.notify();
          if (onEnd) onEnd();
        });
      }, 500);
    });

    return true;
  }
}

export const speechSystem = new SpeechSystem();
