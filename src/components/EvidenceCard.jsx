import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  EyeOff,
  Flame,
  Headphones,
  Laugh,
  MessageSquare,
  Quote,
  Star,
  Zap,
  Lock,
  FolderOpen,
} from 'lucide-react'
import { useSound } from '../sound'

const ICONS = {
  verbal: Quote,
  shy: EyeOff,
  temper: Flame,
  chat: MessageSquare,
  audio: Headphones,
  visual: Camera,
  behavior: Zap,
  joke: Laugh,
  favorite: Star,
}

export default function EvidenceCard({ card, index, open, onToggle }) {
  const { play } = useSound()
  const Icon = ICONS[card.icon] || Star

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 36, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: open ? 0 : card.tilt ?? 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.4 },
      }}
      whileHover={open ? undefined : { y: -6, rotate: 0, scale: 1.02 }}
      className="relative"
    >
      {/* pin */}
      <span className="absolute left-1/2 top-2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent))]" />

      <button
        type="button"
        onClick={() => {
          play(open ? 'tap' : 'open')
          onToggle(card.id)
        }}
        aria-expanded={open}
        className={`glass w-full rounded-2xl p-5 pt-7 text-left transition-colors sm:p-6 sm:pt-8 ${
          open ? 'border-accent/40' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                open ? 'border-accent/50 bg-accent/15 text-accent' : 'border-white/10 bg-white/[0.04] text-paper/80'
              }`}
            >
              <Icon size={18} />
            </span>
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] text-paper">{card.label}</div>
              <div className="tag mt-1">
                {card.teaser} · {card.id}
              </div>
            </div>
          </div>
          <span className="mt-1 text-paper/40">
            {open ? <FolderOpen size={16} /> : <Lock size={16} />}
          </span>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {open ? (
            <motion.div
              key="open"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.label}
                    loading="lazy"
                    className="mb-4 aspect-[4/3] w-full rounded-xl border border-white/10 object-cover"
                  />
                ) : card.icon === 'visual' ? (
                  <div className="mb-4 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_10px,transparent_10px_20px)] text-paper/40">
                    <Camera size={22} />
                    <span className="tag">Image pending</span>
                  </div>
                ) : null}

                <p className="font-display text-base leading-snug text-paper sm:text-lg">{card.reveal}</p>
                {card.note && <p className="mt-3 font-mono text-[11px] text-paper/45">// {card.note}</p>}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4"
            >
              <span className="tag">Sealed</span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-accent">TAP TO OPEN</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}
