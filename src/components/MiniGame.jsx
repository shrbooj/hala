import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, FileCheck2, RotateCcw, ShieldX, Play } from 'lucide-react'
import Screen, { Eyebrow } from './Screen'
import { useSound } from '../sound'
import { game } from '../data/investigationData'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function MiniGame({ onNext }) {
  const { play } = useSound()
  const [phase, setPhase] = useState('idle') // idle | playing | won | lost
  const [items, setItems] = useState([])
  const [collected, setCollected] = useState([])
  const [strikes, setStrikes] = useState(0)
  const [flash, setFlash] = useState(null)

  const areaRef = useRef(null)
  const idRef = useRef(0)
  const phaseRef = useRef('idle')
  const collectedRef = useRef([])
  const strikesRef = useRef(0)
  const flashTimer = useRef(null)
  const lastText = useRef('')

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  const setPhaseBoth = (p) => {
    phaseRef.current = p
    setPhase(p)
  }

  const start = () => {
    play('open')
    collectedRef.current = []
    strikesRef.current = 0
    setCollected([])
    setStrikes(0)
    setItems([])
    setFlash(null)
    setPhaseBoth('playing')
  }

  const spawn = useCallback(() => {
    const el = areaRef.current
    if (!el || phaseRef.current !== 'playing') return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const itemW = Math.min(190, Math.floor(w * 0.6))
    const real = Math.random() > 0.38

    let pool = real ? game.real : game.fake
    if (real) {
      const fresh = pool.filter((t) => !collectedRef.current.includes(t))
      if (fresh.length) pool = fresh
    }
    let text = pick(pool)
    for (let i = 0; i < 4 && text === lastText.current && pool.length > 1; i++) text = pick(pool)
    lastText.current = text

    const item = {
      id: ++idRef.current,
      text,
      real,
      itemW,
      h,
      left: Math.random() * Math.max(0, w - itemW - 8) + 4,
      dur: 5.2 + Math.random() * 2.2,
    }
    setItems((prev) => (prev.length >= 7 ? prev : [...prev, item]))
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return undefined
    spawn()
    const iv = setInterval(spawn, 900)
    return () => clearInterval(iv)
  }, [phase, spawn])

  const doFlash = (kind) => {
    setFlash(kind)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 280)
  }

  const finish = (result) => {
    setPhaseBoth(result)
    setItems([])
    play(result === 'won' ? 'good' : 'glitch')
  }

  const hit = (item) => {
    if (phaseRef.current !== 'playing') return
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    if (item.real) {
      play('good')
      doFlash('good')
      const next = [...collectedRef.current, item.text]
      collectedRef.current = next
      setCollected(next)
      if (next.length >= game.goal) finish('won')
    } else {
      play('bad')
      doFlash('bad')
      if (navigator.vibrate) navigator.vibrate(25)
      strikesRef.current += 1
      setStrikes(strikesRef.current)
      if (strikesRef.current >= game.maxStrikes) finish('lost')
    }
  }

  const drop = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <Screen>
      <Eyebrow>Field Work</Eyebrow>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{game.title}</h2>
      <p className="mt-4 max-w-xl text-base text-paper/60 sm:text-lg">{game.subtitle}</p>

      {/* HUD */}
      <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="tag mr-1">Evidence</span>
          {Array.from({ length: game.goal }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ scale: i < collected.length ? [1, 1.5, 1] : 1 }}
              className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                i < collected.length ? 'border-accent bg-accent' : 'border-white/25 bg-transparent'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="tag mr-1">Strikes</span>
          {Array.from({ length: game.maxStrikes }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                i < strikes ? 'border-red-400 bg-red-400' : 'border-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      {/* play area */}
      <div
        ref={areaRef}
        className={`no-select glass relative mx-auto mt-4 h-[56svh] min-h-[380px] max-h-[540px] max-w-2xl overflow-hidden rounded-3xl transition-colors duration-200 ${
          flash === 'good' ? '!border-accent/70' : flash === 'bad' ? '!border-red-400/70' : ''
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <AnimatePresence>
          {items.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => hit(item)}
              initial={{ y: -80, opacity: 1, scale: 1 }}
              animate={{ y: item.h + 90 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.16 } }}
              transition={{ duration: item.dur, ease: 'linear' }}
              onAnimationComplete={() => drop(item.id)}
              style={{ left: item.left, width: item.itemW }}
              className="absolute top-0 z-10 rounded-xl border border-white/15 bg-[#14141c]/95 px-3 py-3 text-left shadow-lg shadow-black/50 active:scale-95"
            >
              <span className="mb-1 block font-mono text-[9px] tracking-[0.2em] text-accent">
                EXHIBIT #{String(item.id).padStart(3, '0')}
              </span>
              <span className="block text-[13px] leading-snug text-paper sm:text-sm">{item.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* overlays */}
        <AnimatePresence>
          {phase !== 'playing' && (
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-ink/80 p-6 text-center backdrop-blur-sm"
            >
              {phase === 'idle' && (
                <>
                  <FileCheck2 size={34} className="text-accent" />
                  <p className="max-w-xs text-paper/70">
                    Collect <b className="text-paper">{game.goal}</b> real pieces of evidence. Hit{' '}
                    <b className="text-paper">{game.maxStrikes}</b> fake ones and the case is dismissed.
                  </p>
                  <button onClick={start} className="btn-primary">
                    <Play size={14} /> {game.startButton}
                  </button>
                </>
              )}

              {phase === 'won' && (
                <>
                  <motion.div
                    initial={{ scale: 1.6, rotate: -8, opacity: 0 }}
                    animate={{ scale: 1, rotate: -3, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 15 }}
                    className="rounded-md border-2 border-accent px-4 py-2 font-display text-2xl font-bold tracking-wide text-accent sm:text-3xl"
                  >
                    {game.winTitle}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="max-w-sm text-paper/75"
                  >
                    {game.winLine}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      play('open')
                      onNext()
                    }}
                    className="btn-primary group"
                  >
                    {game.button}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </>
              )}

              {phase === 'lost' && (
                <>
                  <ShieldX size={34} className="text-red-400" />
                  <div className="font-display text-2xl font-bold text-red-400 sm:text-3xl">{game.loseTitle}</div>
                  <p className="max-w-sm text-paper/70">{game.loseLine}</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={start} className="btn-primary">
                      <RotateCcw size={14} /> {game.retryButton}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* collected log */}
      <div className="mx-auto mt-5 min-h-[56px] max-w-2xl">
        <div className="tag mb-2">Evidence log</div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {collected.map((t, i) => (
              <motion.span
                key={`${t}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-paper/85"
              >
                {t}
              </motion.span>
            ))}
          </AnimatePresence>
          {collected.length === 0 && <span className="text-xs text-paper/30">Nothing logged yet.</span>}
        </div>
      </div>

      {/* escape hatch so nobody gets stuck */}
      <div className="mx-auto mt-6 max-w-2xl text-center">
        <button
          onClick={() => {
            play('tap')
            onNext()
          }}
          className="min-h-[44px] px-3 font-mono text-[11px] tracking-[0.16em] text-paper/30 underline-offset-4 transition hover:text-paper/60 hover:underline"
        >
          {game.skipLabel}
        </button>
      </div>
    </Screen>
  )
}
