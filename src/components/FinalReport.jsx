import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Screen, { Eyebrow } from './Screen'
import TextReveal from './TextReveal'
import SecretButton from './SecretButton'
import { caseMeta, finalReport, girl } from '../data/investigationData'

export default function FinalReport({ onRestart }) {
  const [stage, setStage] = useState(0) // 0 report, 1 pre-conclusion, 2 conclusion, 3 follow-up, 4 secret + off the record
  const [glitching, setGlitching] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    const schedule = [
      [1, 2300],
      [2, 5200],
      [3, 7600],
      [4, 9400],
    ]
    schedule.forEach(([s, ms]) => timers.current.push(setTimeout(() => setStage(s), ms)))
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const skip = () => {
    timers.current.forEach(clearTimeout)
    setStage(4)
  }

  const rows = [
    ['Subject', girl.name],
    ['Case status', finalReport.caseStatus],
    ['Evidence', finalReport.evidence],
    ['Threat level', finalReport.threatLevel],
  ]

  const { offTheRecord } = finalReport

  return (
    <Screen className={glitching ? 'glitch-page' : ''}>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>
          Final report / {caseMeta.caseId}
        </Eyebrow>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mb-6 flex items-center justify-between">
            <span className="tag">Confidential</span>
            <span className="tag">Page 1 of 1</span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            {finalReport.title}
          </h2>

          <div className="mt-8">
            {rows.map(([label, value], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.5 }}
                className="flex flex-col gap-1 border-t border-white/10 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="tag">{label}</span>
                <span
                  className={`font-display text-xl font-semibold sm:text-2xl ${
                    label === 'Threat level' ? 'text-amber-300' : label === 'Evidence' ? 'text-accent' : ''
                  }`}
                >
                  {value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* the reveal */}
        <div className="mt-12 min-h-[190px] text-center">
          {stage >= 1 && (
            <p className="text-base text-paper/65 sm:text-lg">
              <TextReveal text={finalReport.preConclusion} stagger={0.05} />
            </p>
          )}

          {stage === 1 && (
            <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-paper/50"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}

          {stage >= 2 && (
            <motion.h3
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
            >
              {finalReport.conclusion}
            </motion.h3>
          )}

          {stage >= 3 && (
            <p className="mt-5 text-base text-paper/55 sm:text-lg">
              <TextReveal text={finalReport.followUp} stagger={0.05} />
            </p>
          )}
        </div>

        {stage < 4 && (
          <div className="mt-4 text-center">
            <button
              onClick={skip}
              className="min-h-[44px] px-3 font-mono text-[11px] tracking-[0.16em] text-paper/25 transition hover:text-paper/55"
            >
              skip
            </button>
          </div>
        )}

        {stage >= 4 && (
          <>
            <SecretButton onGlitch={() => setGlitching(true)} onRestart={onRestart} />

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 border-t border-white/10 pt-8 text-center"
            >
              <div className="tag mb-5">{offTheRecord.title}</div>
              <div className="space-y-2 text-sm text-paper/60 sm:text-base">
                {offTheRecord.lines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.9 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + offTheRecord.lines.length * 0.9 }}
                className="mt-6 font-mono text-[11px] tracking-[0.2em] text-paper/35"
              >
                {offTheRecord.signature}
              </motion.p>
            </motion.section>
          </>
        )}
      </div>
    </Screen>
  )
}
