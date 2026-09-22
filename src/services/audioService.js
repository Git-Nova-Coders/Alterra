/**
 * Alterra Procedural Audio Synthesizer (Web Audio API)
 * Zero external audio assets, zero latency, 100% reliable in any browser
 * Implements M29 (Sound/feedback layer)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Generic tone generator with envelope
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, pitchBend = null) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      if (pitchBend) {
        osc.frequency.exponentialRampToValueAtTime(pitchBend, this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('[SoundEngine] Audio playback error:', e);
    }
  }

  // UI Click: subtle cyber tick
  playClick() {
    this.playTone(1200, 'triangle', 0.04, 0.08, 400);
  }

  // Object / Secret Discovery: ascending crystal chord
  playDiscovery() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.35, 0.12);
      }, idx * 75);
    });
  }

  // Artifact Awakening: deep sub-bass resonant boom + high shimmer
  playArtifactAwaken() {
    if (this.muted) return;
    this.playTone(90, 'triangle', 1.2, 0.25, 45);
    setTimeout(() => this.playTone(330, 'sine', 0.8, 0.15, 660), 150);
    setTimeout(() => this.playTone(587.33, 'sine', 1.0, 0.12, 1174), 300);
  }

  // World Reaction sounds based on choice
  playWorldReaction(choice) {
    if (this.muted) return;
    if (choice === 'save') {
      // Radiant harmonious chime chord
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major
      chords.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 1.2, 0.15), i * 90);
      });
    } else if (choice === 'control') {
      // Glitch dissonance: saw pulses
      [380, 220, 440, 190, 600].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sawtooth', 0.12, 0.12), i * 70);
      });
    } else if (choice === 'destroy') {
      // Seismic seismic rumble: sub bass drop & crunch
      this.playTone(70, 'sawtooth', 1.5, 0.3, 25);
      setTimeout(() => this.playTone(110, 'square', 0.4, 0.18, 30), 100);
      setTimeout(() => this.playTone(60, 'sawtooth', 1.2, 0.25, 20), 300);
    }
  }

  // Mini-game success
  playSuccess() {
    if (this.muted) return;
    this.playTone(587.33, 'sine', 0.2, 0.15); // D5
    setTimeout(() => this.playTone(880, 'sine', 0.4, 0.18), 120); // A5
  }

  // Mini-game failure
  playFailure() {
    if (this.muted) return;
    this.playTone(280, 'sawtooth', 0.3, 0.18, 120);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.4, 0.22, 60), 180);
  }

  // Hidden Easter Egg discovery
  playSecret() {
    if (this.muted) return;
    [329.63, 493.88, 659.25, 987.77, 1318.51].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.6, 0.15), i * 80);
    });
  }

  // Awakening deep hum / eye opening
  playAwakening() {
    if (this.muted) return;
    this.playTone(55, 'sine', 2.5, 0.2, 110);
    setTimeout(() => this.playTone(220, 'sine', 1.8, 0.12, 440), 600);
    setTimeout(() => this.playTone(528, 'triangle', 1.5, 0.15, 660), 1200);
  }

  // Subtle footstep
  playStep() {
    if (this.muted) return;
    const pitch = 140 + Math.random() * 40;
    this.playTone(pitch, 'triangle', 0.05, 0.04, pitch * 0.7);
  }

  // Portal portal resonance hum
  playPortalHum() {
    if (this.muted) return;
    this.playTone(196, 'sine', 0.8, 0.1, 261.63);
    setTimeout(() => this.playTone(392, 'triangle', 0.6, 0.08, 523.25), 100);
  }

  // Pained creature growl
  playCreatureGrowl() {
    if (this.muted) return;
    this.playTone(75, 'sawtooth', 1.4, 0.25, 45);
    setTimeout(() => this.playTone(90, 'sawtooth', 0.9, 0.2, 60), 200);
    setTimeout(() => this.playTone(60, 'square', 1.2, 0.15, 35), 450);
  }
}

export const AudioService = new SoundEngine();

