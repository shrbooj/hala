import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import Screen, { Eyebrow } from './Screen'
import { useSound } from '../sound'
import { quiz } from '../data/investigationData'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const pad = (n) => String(n).padStart(2, '0')
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

function computeResults(answers) {
  const totals = {}
  quiz.meters.forEach((m) => (totals[m.key] = quiz.baseScore))
  answers.forEach((optIndex, qIndex) => {
    const opt = quiz.questions[qIndex]?.options[optIndex]
    if (!opt) return
    Object.entries(opt.scores).forEach(([k, v]) => {
      if (k in totals) totals[k] += v
    })
  })
  const pcts = {}
  Object.keys(totals).forEach((k) => (pcts[k] = clamp(Math.round(totals[k]), 3, 100)))

  const risky = ['chaotic', 'problematic', 'suspicious'].filter((k) => k in pcts)
  const avg = risky.length ? risky.reduce((s, k) => s + pcts[k], 0) / risky.length : 50
  const threat = [...quiz.threatLevels].reverse().find((t) => avg >= t.min) || quiz.threatLevels[0]
  return { pcts, threat }
}

function CountUp({ to, delay = 0 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.3,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [to, delay])
  return <span className="tabular-nums">{val}</span>
}

function Analyzing() {
  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-20 text-center"
    >
      <div className="relative h-14 w-14">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-white/10 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
        <span className="absolute inset-[18px] rounded-full bg-accent/60 blur-[2px]" />
      </div>
      <p className="mt-8 font-mono text-xs tracking-[0.22em] text-paper/80">ANALYZING SUBJECT</p>
      <p className="tag mt-2 blink">please hold</p>
    </motion.div>
  )
}

function Results({ answers, onRetake, onNext }) {
  const { play } = useSound()
  const { pcts, threat } = computeResults(answers)

  useEffect(() => {
    play('good')
  }, [play])

  return (
    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <div className="glass rounded-3xl p-6 sm:p-9">
        <div className="mb-6 flex items-center justify-between">
          <span className="tag">Report / auto-generated</span>
          <span className="tag text-accent">Complete</span>
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">{quiz.resultTitle}</h3>

        <div className="mt-8 space-y-6">
          {quiz.meters.map((m, i) => (
            <div key={m.key}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-lg sm:text-xl">{m.label}</span>
                <span className="font-mono text-lg text-accent sm:text-xl">
                  <CountUp to={pcts[m.key]} delay={0.2 + i * 0.25} />%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${pcts[m.key]}%` }}
                  transition={{ duration: 1.3, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + quiz.meters.length * 0.25 + 1, type: 'spring', stiffness: 220, damping: 18 }}
          className="mt-9 rounded-2xl border border-white/10 bg-black/30 p-5 text-center"
        >
          <div className="tag mb-2">Threat level</div>
          <div className="font-display text-3xl font-bold sm:text-4xl">
            <span className="mr-2">{threat.icon}</span>
            {threat.label}
          </div>
          <p className="mt-3 text-sm text-paper/65 sm:text-base">&ldquo;{threat.verdict}&rdquo;</p>
        </motion.div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => {
            play('tap')
            onRetake()
          }}
          className="btn-ghost"
        >
          <RotateCcw size={14} /> Retake
        </button>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            play('open')
            onNext()
          }}
          className="btn-primary group"
        >
          {quiz.button}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function PersonalityQuiz({ onNext }) {
  const { play } = useSound()
  const total = quiz.questions.length
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('quiz') // quiz | analyzing | results
  const [picked, setPicked] = useState(null)
  const lockRef = useRef(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  const choose = (optIndex) => {
    if (lockRef.current) return
    lockRef.current = true
    play('tap')
    setPicked(optIndex)
    const next = [...answers]
    next[step] = optIndex
    setAnswers(next)

    later(() => {
      setPicked(null)
      if (step + 1 < total) {
        setStep(step + 1)
        lockRef.current = false
      } else {
        setPhase('analyzing')
        later(() => {
          setPhase('results')
          lockRef.current = false
        }, 1900)
      }
    }, 420)
  }

  const goBack = () => {
    if (lockRef.current || step === 0) return
    play('tap')
    setStep(step - 1)
  }

  const retake = () => {
    timers.current.forEach(clearTimeout)
    lockRef.current = false
    setAnswers([])
    setStep(0)
    setPicked(null)
    setPhase('quiz')
  }

  const q = quiz.questions[step]

  return (
    <Screen>
      <Eyebrow>Subject Analysis</Eyebrow>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{quiz.title}</h2>
      <p className="mt-4 max-w-xl text-base text-paper/60 sm:text-lg">{quiz.subtitle}</p>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {phase === 'quiz' && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  QUESTION {pad(step + 1)}
                </span>
                <span className="tag">
                  {pad(step + 1)} / {pad(total)}
                </span>
              </div>
              <div className="mb-6 h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${((step + (picked !== null ? 1 : 0)) / total) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{q.prompt}</h3>

              <div className="mt-7 grid gap-3">
                {q.options.map((opt, i) => {
                  const selected = picked === i || (picked === null && answers[step] === i)
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => choose(i)}
                      className={`glass flex min-h-[60px] items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors sm:px-5 ${
                        selected ? 'border-accent/60 bg-accent/10' : 'hover:border-white/20'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-colors ${
                          selected
                            ? 'border-accent bg-accent text-ink'
                            : 'border-white/15 bg-white/[0.04] text-paper/70'
                        }`}
                      >
                        {LETTERS[i]}
                      </span>
                      <span className="text-base sm:text-lg">{opt.text}</span>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-6 h-10">
                {step > 0 && (
                  <button
                    onClick={goBack}
                    className="inline-flex min-h-[40px] items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-paper/50 transition hover:text-paper"
                  >
                    <ArrowLeft size={14} /> PREVIOUS QUESTION
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'analyzing' && <Analyzing />}
          {phase === 'results' && <Results answers={answers} onRetake={retake} onNext={onNext} />}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
