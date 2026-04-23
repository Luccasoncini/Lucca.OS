import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  { text: 'lucca.os v1.0.0', delay: 0, type: 'header' },
  { text: '─────────────────────────────────────', delay: 300, type: 'divider' },
  { text: '> initializing kernel...', delay: 700, type: 'cmd', result: 'OK' },
  { text: '> loading neural context...', delay: 1300, type: 'cmd', result: 'OK' },
  { text: '> connecting to claude-sonnet-4-6...', delay: 1900, type: 'cmd', result: 'OK' },
  { text: '> mounting filesystem...', delay: 2400, type: 'cmd', result: 'OK' },
  { text: '> starting interface...', delay: 2900, type: 'cmd', result: 'OK' },
  { text: '─────────────────────────────────────', delay: 3300, type: 'divider' },
  { text: 'system ready.', delay: 3700, type: 'ready' },
]

const TOTAL_DURATION = 4600

interface LineProps {
  text: string
  type: string
  result?: string
  charDelay?: number
}

function TerminalLine({ text, type, result, charDelay = 18 }: LineProps) {
  const instant = type === 'divider' || type === 'header'
  const [visible, setVisible] = useState(instant ? text.length : 0)

  useEffect(() => {
    if (instant) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisible(i)
      if (i >= text.length) clearInterval(interval)
    }, charDelay)
    return () => clearInterval(interval)
  }, [text, instant, charDelay])

  const color =
    type === 'header'
      ? '#a78bfa'
      : type === 'ready'
        ? '#34d399'
        : type === 'divider'
          ? '#374151'
          : '#94a3b8'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 22 }}>
      <span style={{ color, fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.02em' }}>
        {text.slice(0, visible)}
        {visible < text.length && type !== 'divider' && (
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 13,
              backgroundColor: '#6366f1',
              verticalAlign: 'middle',
              marginLeft: 1,
              animation: 'blink 0.7s step-end infinite',
            }}
          />
        )}
      </span>
      {result && visible >= text.length && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: 4,
            padding: '1px 6px',
          }}
        >
          {result}
        </motion.span>
      )}
    </div>
  )
}

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay),
    )

    const exitTimer = setTimeout(() => setExiting(true), TOTAL_DURATION)
    const completeTimer = setTimeout(onComplete, TOTAL_DURATION + 600)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#020617',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {LINES.map((line, i) =>
              visibleLines.includes(i) ? (
                <TerminalLine key={i} text={line.text} type={line.type} result={line.result} />
              ) : null,
            )}
          </div>

          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
