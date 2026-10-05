import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { SoundProvider } from './sound'
import ProgressIndicator from './components/ProgressIndicator'
import CaseIntro from './components/CaseIntro'
import InvestigationBrief from './components/InvestigationBrief'
import EvidenceBoard from './components/EvidenceBoard'
import PersonalityQuiz from './components/PersonalityQuiz'
import MiniGame from './components/MiniGame'
import FinalReport from './components/FinalReport'
import { sections } from './data/investigationData'

/* Soft light that follows the mouse (desktop / fine pointers only). */
function CursorGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.4 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    setEnabled(true)
    const move = (e) => {
      x.set(e.clientX - 200)
      y.set(e.clientY - 200)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[400px] w-[400px] rounded-full bg-accent/[0.07] blur-3xl"
    />
  )
}

export default function App() {
  const [current, setCurrent] = useState(0)
  const [maxReached, setMaxReached] = useState(0)

  const go = useCallback((i) => {
    const next = Math.max(0, Math.min(sections.length - 1, i))
    setCurrent(next)
    setMaxReached((m) => Math.max(m, next))
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const next = () => go(current + 1)

  const screens = [
    <CaseIntro key="case" onBegin={next} />,
    <InvestigationBrief key="brief" onNext={next} />,
    <EvidenceBoard key="evidence" onNext={next} />,
    <PersonalityQuiz key="analysis" onNext={next} />,
    <MiniGame key="game" onNext={next} />,
    <FinalReport key="report" onRestart={() => go(0)} />,
  ]

  return (
    <SoundProvider>
      <div className="relative min-h-[100svh]">
        <CursorGlow />
        <ProgressIndicator current={current} maxReached={maxReached} onNavigate={go} />
        <div className="relative z-[2]">
          <AnimatePresence mode="wait">{screens[current]}</AnimatePresence>
        </div>
        <div className="scanline" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </div>
    </SoundProvider>
  )
}
