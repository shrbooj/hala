import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useSound } from '../sound'
import { finalReport } from '../data/investigationData'

/* Stages: idle -> clicked -> expected -> terminated -> reopened */
export default function SecretButton({ onGlitch, onRestart }) {
  const { play } = useSound()
  const s = finalReport.secret
  const [stage, setStage] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const press = () => {
    play('glitch')
    setStage('clicked')
    later(() => setStage('expected'), 1700)
  }

  const leave = () => {
    play('tap')
    setStage('terminated')
    later(() => {
      setStage('reopened')
      play('glitch')
      onGlitch?.()
    }, 2300)
  }

  return (
    <div className="mt-14 flex min-h-[170px] flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {stage === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={press}
            className="min-h-[44px] rounded-lg border border-red-400/40 bg-red-500/10 px-4 font-mono text-[10px] tracking-[0.28em] text-red-300/80 transition hover:border-red-400/80 hover:bg-red-500/20"
          >
            {s.buttonLabel}
          </motion.button>
        )}

        {stage === 'clicked' && (
          <motion.p
            key="clicked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-display text-2xl font-semibold sm:text-3xl"
          >
            {s.line1}
          </motion.p>
        )}

        {stage === 'expected' && (
          <motion.div
            key="expected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="font-display text-xl text-paper/80 sm:text-2xl">{s.line2}</p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={leave}
              className="btn-ghost"
            >
              {s.leaveButton}
            </motion.button>
          </motion.div>
        )}

        {stage === 'terminated' && (
          <motion.p
            key="terminated"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-md border-2 border-paper/30 px-5 py-2 font-mono text-sm tracking-[0.25em] text-paper/80 sm:text-base"
          >
            {s.terminated.toUpperCase()}
          </motion.p>
        )}

        {stage === 'reopened' && (
          <motion.div
            key="reopened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="glitch-text font-display text-3xl font-bold text-accent sm:text-5xl" data-text={s.reopened}>
              {s.reopened}
            </span>
            <button
              onClick={() => {
                play('open')
                onRestart?.()
              }}
              className="btn-ghost"
            >
              <RotateCcw size={14} /> Reopen case file
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
