import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Screen, { Eyebrow } from './Screen'
import TextReveal from './TextReveal'
import { useSound } from '../sound'
import { brief, caseMeta } from '../data/investigationData'

export default function InvestigationBrief({ onNext }) {
  const { play } = useSound()

  return (
    <Screen>
      <Eyebrow>Briefing / {caseMeta.caseId}</Eyebrow>

      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
        <TextReveal text={brief.title} />
      </h2>
      <p className="mt-4 max-w-xl text-base text-paper/60 sm:text-lg">
        <TextReveal text={brief.subtitle} delay={0.4} stagger={0.03} />
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {brief.cards.map((card, i) => (
          <motion.article
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="glass group relative overflow-hidden rounded-2xl p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                EVIDENCE #{card.id}
              </span>
              <span className="tag">Logged</span>
            </div>
            <p className="font-display text-lg leading-snug text-paper sm:text-xl">
              &ldquo;{card.text}&rdquo;
            </p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 + brief.cards.length * 0.22 + 0.2 }}
        className="mt-10 flex justify-center sm:justify-start"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            play('open')
            onNext()
          }}
          className="btn-primary group w-full sm:w-auto"
        >
          {brief.button}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </Screen>
  )
}
