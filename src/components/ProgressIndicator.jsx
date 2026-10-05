import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { sections } from '../data/investigationData'
import { SoundToggle, useSound } from '../sound'

const pad = (n) => String(n).padStart(2, '0')

export default function ProgressIndicator({ current, maxReached, onNavigate }) {
  const { play } = useSound()
  const total = sections.length
  const canGoBack = current > 0

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => {
            play('tap')
            onNavigate(current - 1)
          }}
          disabled={!canGoBack}
          aria-label="Previous section"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper/80 transition enabled:hover:bg-white/10 disabled:opacity-25"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <motion.span
              key={current}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="truncate font-mono text-[11px] tracking-[0.2em] text-paper"
            >
              {sections[current].label}
            </motion.span>
            <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-paper/50">
              {pad(current + 1)} / {pad(total)}
            </span>
          </div>

          <div className="mt-2 flex gap-1.5">
            {sections.map((s, i) => {
              const reachable = i <= maxReached
              const done = i < current
              const active = i === current
              return (
                <button
                  key={s.id}
                  disabled={!reachable}
                  onClick={() => {
                    if (i !== current) {
                      play('tap')
                      onNavigate(i)
                    }
                  }}
                  aria-label={`Go to ${s.label}`}
                  className="group relative h-4 flex-1 disabled:cursor-default"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-accent"
                      initial={false}
                      animate={{ width: done || active ? '100%' : reachable ? '35%' : '0%' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ opacity: active ? 1 : 0.55 }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <SoundToggle />
      </div>
    </header>
  )
}
