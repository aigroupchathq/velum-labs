// Web Audio API based sound synthesizer for Tinder UI sound effects

class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public setEnabled(val: boolean) {
    this.enabled = val
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public playLike() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'

      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(784, now + 0.12)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch {
      // Audio fallback silent
    }
  }

  public playNope() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'

      osc.frequency.setValueAtTime(280, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.14)
    } catch {
      // Audio fallback silent
    }
  }

  public playSuperLike() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return
        const noteStart = now + idx * 0.05
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, noteStart)

        gain.gain.setValueAtTime(0.15, noteStart)
        gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.2)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + 0.22)
      })
    } catch {
      // Audio fallback
    }
  }

  public playMatch() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      // Fanfare chords
      const chords = [
        { freqs: [523.25, 659.25, 783.99], time: 0, dur: 0.25 },
        { freqs: [587.33, 739.99, 880.0], time: 0.18, dur: 0.25 },
        { freqs: [659.25, 830.61, 987.77], time: 0.36, dur: 0.25 },
        { freqs: [783.99, 987.77, 1174.66, 1567.98], time: 0.54, dur: 0.6 },
      ]

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const start = now + chord.time

          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, start)

          gain.gain.setValueAtTime(0.12, start)
          gain.gain.exponentialRampToValueAtTime(0.001, start + chord.dur)

          osc.connect(gain)
          gain.connect(this.ctx.destination)

          osc.start(start)
          osc.stop(start + chord.dur)
        })
      })
    } catch {
      // Audio fallback
    }
  }

  public playMessage() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.1)
    } catch {
      // Audio fallback
    }
  }

  public playTap() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const now = this.ctx.currentTime

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundManager()
