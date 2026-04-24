import { motion } from 'framer-motion'
import type { ActionButton } from '@/utils/intent'

interface ActionButtonsProps {
  buttons: ActionButton[]
  onMessage: (text: string) => void
}

export function ActionButtons({ buttons, onMessage }: ActionButtonsProps) {
  if (!buttons.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4, paddingLeft: 42 }}
    >
      {buttons.map(btn =>
        btn.href ? (
          <a
            key={btn.label}
            href={btn.href}
            target={btn.download ? '_self' : '_blank'}
            rel="noreferrer"
            download={btn.download}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 12,
              textDecoration: 'none',
              border: `1px solid ${btn.variant === 'accent' ? 'var(--accent)' : 'var(--border)'}`,
              backgroundColor:
                btn.variant === 'accent'
                  ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                  : 'var(--surface)',
              color: btn.variant === 'accent' ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor =
                btn.variant === 'accent' ? 'var(--accent)' : 'var(--border)'
              e.currentTarget.style.color =
                btn.variant === 'accent' ? 'var(--accent)' : 'var(--text-muted)'
            }}
          >
            <span>{btn.icon}</span>
            {btn.label}
          </a>
        ) : (
          <button
            key={btn.label}
            onClick={() => btn.message && onMessage(btn.message)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 12,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <span>{btn.icon}</span>
            {btn.label}
          </button>
        ),
      )}
    </motion.div>
  )
}
