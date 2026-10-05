import { motion } from 'framer-motion'

/* Word-by-word blur/fade-in. `delay` is the start delay in seconds. */
export default function TextReveal({ text, delay = 0, stagger = 0.06, className = '', as = 'span' }) {
  const Tag = motion[as] || motion.span
  const words = String(text).split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * stagger, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
