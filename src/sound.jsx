import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/* Optional, tiny synthesized UI sounds. OFF by default; nothing plays until
   she taps the speaker toggle. No audio files needed. */

const SoundContext = createContext({ enabled: false, toggle: () => {}, play: () => {} })

const TONES = {
  tap: [{ f: 520, d: 0.06, t: 'triangle', v: 0.05 }],
  open: [
    { f: 440, d: 0.07, t: 'triangle', v: 0.05 },
    { f: 660, d: 0.09, t: 'triangle', v: 0.05, at: 0.06 },
  ],
  good: [
    { f: 600, d: 0.07, t: 'sine', v: 0.06 },
    { f: 900, d: 0.1, t: 'sine', v: 0.06, at: 0.07 },
  ],
  bad: [
    { f: 180, d: 0.18, t: 'sawtooth', v: 0.04 },
  ],
  glitch: [
    { f: 120, d: 0.05, t: 'square', v: 0.04 },
    { f: 90, d: 0.07, t: 'square', v: 0.04, at: 0.06 },
    { f: 200, d: 0.05, t: 'square', v: 0.04, at: 0.14 },
  ],
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef(null)
  const enabledRef = useRef(false)

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctxRef.current = new AC()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  const play = useCallback((name) => {
    if (!enabledRef.current) return
    const ctx = ensureCtx()
    const tones = TONES[name]
    if (!ctx || !tones) return
    tones.forEach(({ f, d, t, v, at = 0 }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = ctx.currentTime + at
      osc.type = t
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(v, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + d)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + d + 0.02)
    })
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      enabledRef.current = next
      if (next) {
        ensureCtx()
        // tiny confirmation blip (enabledRef already true)
        setTimeout(() => play('good'), 0)
      }
      return next
    })
  }, [play])

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play])
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)

export function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Mute sound' : 'Unmute sound'}
      aria-pressed={enabled}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper/70 transition hover:bg-white/10 hover:text-paper"
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
}
