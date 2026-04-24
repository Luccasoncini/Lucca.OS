import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/ui.store'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useGithubActivity } from '@/hooks/useGithubActivity'

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
  const isMobile = useIsMobile()
  const color = INTENT_COLORS[intent] ?? '#64748b'
  const { commits, latest } = useGithubActivity('luccasoncini/Lucca.OS')
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#34d399' }}>
          <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
          connected
        </span>

        {!isMobile && (
          <>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>model: claude-sonnet-4-6</span>

            {latest && (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <span style={{ color: 'var(--border)' }}>|</span>
                <button
                  onClick={() => setOpen(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: open ? 'var(--accent)' : 'var(--text-muted)',
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    padding: '0 4px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => !open && (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  last push: {latest} ↑
                </button>

                <AnimatePresence>
                  {open && commits.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        bottom: 28,
                        left: 0,
                        width: 340,
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 12px 6px',
                          borderBottom: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 10, color: 'var(--accent)' }}>⌥</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          luccasoncini/Lucca.OS — últimos commits
                        </span>
                      </div>

                      {commits.map(commit => (
                        <div
                          key={commit.sha}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '7px 12px',
                            borderBottom: '1px solid var(--border)',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              'var(--surface-2)')
                          }
                          onMouseLeave={e =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')
                          }
                        >
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 10,
                              color: 'var(--accent)',
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {commit.sha}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              fontSize: 11,
                              color: 'var(--text)',
                              lineHeight: 1.4,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {commit.message}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: 'var(--text-muted)',
                              flexShrink: 0,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {commit.timeAgo}
                          </span>
                        </div>
                      ))}

                      <div
                        style={{
                          padding: '6px 12px',
                          textAlign: 'right',
                        }}
                      >
                        <a
                          href="https://github.com/luccasoncini/Lucca.OS/commits/main"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 10,
                            color: 'var(--accent)',
                            textDecoration: 'none',
                          }}
                        >
                          ver todos no GitHub →
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {!isMobile && (
          <>
            <span>lucca.os v1.0.0</span>
            <span style={{ color: 'var(--border)' }}>|</span>
          </>
        )}
        <Clock />
      </div>
    </div>
  )
}
