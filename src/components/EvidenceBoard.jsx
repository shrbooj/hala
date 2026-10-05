import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Screen, { Eyebrow } from './Screen'
import EvidenceCard from './EvidenceCard'
import { useSound } from '../sound'
import { evidenceRoom } from '../data/investigationData'

export default function EvidenceBoard({ onNext }) {
  const { play } = useSound()
  const [openIds, setOpenIds] = useState([])
  const [seen, setSeen] = useState([])

  const toggle = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const total = evidenceRoom.cards.length
  const pct = (seen.length / total) * 100

  return (
    <Screen>
      <Eyebrow>Evidence Room</Eyebrow>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{evidenceRoom.title}</h2>
      <p className="mt-4 max-w-xl text-base text-paper/60 sm:text-lg">{evidenceRoom.subtitle}</p>

      {/* review tracker */}
      <div className="mt-8 flex items-center gap-4">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="tag tabular-nums">
          {seen.length} / {total} reviewed
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {evidenceRoom.cards.map((card, i) => (
          <EvidenceCard
            key={card.id}
            card={card}
            index={i}
            open={openIds.includes(card.id)}
            onToggle={toggle}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-center sm:justify-start">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            play('open')
            onNext()
          }}
          className="btn-primary group w-full sm:w-auto"
        >
          {evidenceRoom.button}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </Screen>
  )
}
