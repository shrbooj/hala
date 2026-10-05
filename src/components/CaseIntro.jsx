import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldAlert } from 'lucide-react'
import Screen from './Screen'
import TextReveal from './TextReveal'
import { useSound } from '../sound'
import { caseMeta, girl, intro } from '../data/investigationData'

const formatDate = (d) =>
  d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()

const formatTime = (d) => d.toLocaleTimeString('en-GB', { hour12: false })

function Field({ label, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="border-t border-white/10 py-4"
    >
      <div className="tag mb-2">{label}</div>
      {children}
    </motion.div>
  )
}

export default function CaseIntro({ onBegin }) {
  const { play } = useSound()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <Screen center>
      <div className="mx-auto w-full max-w-xl">
        {/* top meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <span className="tag">{caseMeta.agency}</span>
          <span className="tag hidden sm:inline">{caseMeta.clearance}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9"
        >
          {/* corner glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

          {/* stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 16 }}
            className="absolute right-4 top-5 rounded-md border-2 border-red-400/70 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.25em] text-red-400/80 sm:right-7 sm:top-7 sm:text-xs"
          >
            {intro.stamp}
          </motion.div>

          <div className="mb-8 flex items-center gap-2 text-paper/60">
            <ShieldAlert size={15} />
            <span className="tag">Confidential</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-4xl font-bold leading-none tracking-tight sm:text-6xl"
          >
            CASE FILE
            <span className="ml-3 text-accent">#{caseMeta.caseNumber}</span>
          </motion.h1>

          <div className="mt-8">
            <Field label="Subject" delay={0.55}>
              <div className="font-display text-2xl font-semibold sm:text-3xl">
                <span className="glitch-text" data-text={girl.name}>
                  {girl.name}
                </span>
              </div>
            </Field>

            <Field label="Status" delay={0.7}>
              <div className="flex items-center gap-3 font-mono text-sm tracking-[0.12em]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                </span>
                {intro.status}
              </div>
            </Field>

            <Field label="Opened" delay={0.85}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-paper/60">
                <span>{caseMeta.openedOn || formatDate(now)}</span>
                <span className="tabular-nums">{formatTime(now)}</span>
                <span>ID {caseMeta.caseId}</span>
              </div>
            </Field>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-base text-paper/75 sm:text-lg">
          <TextReveal text={intro.line} delay={1.1} stagger={0.045} />
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              play('open')
              onBegin()
            }}
            className="btn-primary group w-full sm:w-auto"
          >
            {intro.button}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </Screen>
  )
}
