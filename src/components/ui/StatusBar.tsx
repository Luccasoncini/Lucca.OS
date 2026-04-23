import { useState, useEffect } from 'react'
import { useUIStore } from '@/store/ui.store'

function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span>
      {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

const INTENT_LABELS: Record<string, string> = {
  default: 'idle',
  contact: 'contact',
  projects: 'projects',
  hire: 'hire',
}

const INTENT_COLORS: Record<string, string> = {
  default: '#64748b',
  contact: '#6366f1',
  projects: '#a855f7',
  hire: '#34d399',
}

export function StatusBar() {
  const { intent } = useUIStore()
  const color = INTENT_COLORS[intent] ?? '#64748b'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 24,
        backgroundColor: 'color-mix(in srgb, var(--surface) 95%, transparent)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'monospace',
        letterSpacing: '0.03em',
        userSelect: 'none',
      }}
    >
      {/* left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#34d399' }}>
          <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
          connected
        </span>

        <span style={{ color: 'var(--border)' }}>|</span>

        <span>model: claude-sonnet-4-6</span>
      </div>

      {/* center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
            transition: 'all 0.4s',
          }}
        />
        <span style={{ color, transition: 'color 0.4s' }}>
          intent: {INTENT_LABELS[intent] ?? 'idle'}
        </span>
      </div>

      {/* right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>lucca.os v1.0.0</span>

        <span style={{ color: 'var(--border)' }}>|</span>

        <Clock />
      </div>
    </div>
  )
}
