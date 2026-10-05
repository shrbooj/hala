import { motion } from 'framer-motion'

/* Shared page wrapper: consistent padding + transition between screens. */
export default function Screen({ children, className = '', center = false }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-5xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 ${
        center ? 'flex min-h-[100svh] flex-col justify-center' : ''
      } ${className}`}
    >
      {children}
    </motion.main>
  )
}

export function Eyebrow({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--accent))]" />
      <span className="tag">{children}</span>
    </div>
  )
}
