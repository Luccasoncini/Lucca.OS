import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/ui.store'

interface Command {
  id: string
  icon: string
  label: string
  category: string
  message?: string
  href?: string
  action?: 'reset' | 'theme'
}

const COMMANDS: Command[] = [
  {
    id: 'hire',
    icon: '💼',
    label: 'Contratar Lucca',
    category: 'Conversar',
    message: 'Quero te contratar. Me conta sobre seu perfil.',
  },
  {
    id: 'projects',
    icon: '🚀',
    label: 'Ver projetos',
    category: 'Conversar',
    message: 'Quais projetos você desenvolveu?',
  },
  {
    id: 'stack',
    icon: '🛠',
    label: 'Ver stack técnica',
    category: 'Conversar',
    message: 'Qual sua stack principal?',
  },
  {
    id: 'contact',
    icon: '📬',
    label: 'Entrar em contato',
    category: 'Conversar',
    message: 'Como entro em contato com você?',
  },
  {
    id: 'differentials',
    icon: '⚡',
    label: 'Diferenciais',
    category: 'Conversar',
    message: 'O que te diferencia de outros devs?',
  },
  { id: 'reset', icon: '↺', label: 'Nova conversa', category: 'Sistema', action: 'reset' },
  { id: 'theme', icon: '◐', label: 'Alternar tema', category: 'Sistema', action: 'theme' },
  {
    id: 'github',
    icon: '⌥',
    label: 'Abrir GitHub',
    category: 'Links',
    href: 'https://github.com/luccasoncini',
  },
  {
    id: 'linkedin',
    icon: '🔗',
    label: 'Abrir LinkedIn',
    category: 'Links',
    href: 'https://www.linkedin.com/in/lucca-soncini/',
  },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { toggleTheme, setQueuedMessage, requestReset } = useUIStore()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const filtered = COMMANDS.filter(
    cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase()),
  )

  // Focus and reset when opening — use setTimeout to avoid sync setState in effect
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      setQuery('')
      setSelected(0)
      inputRef.current?.focus()
    }, 0)
    return () => clearTimeout(id)
  }, [open])

  // Scroll selected item into view
  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(s => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(s => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        execute(filtered[selected])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered, selected]) // eslint-disable-line

  function execute(cmd: Command | undefined) {
    if (!cmd) return
    onClose()
    if (cmd.href) {
      window.open(cmd.href, '_blank')
      return
    }
    if (cmd.action === 'theme') {
      toggleTheme()
      return
    }
    if (cmd.action === 'reset') {
      requestReset()
      return
    }
    if (cmd.message) {
      setQueuedMessage(cmd.message)
    }
  }

  const categories = [...new Set(filtered.map(c => c.category))]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '18%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 61,
              width: '100%',
              maxWidth: 560,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* search input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  setSelected(0)
                }}
                placeholder="Digite um comando..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: 15,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '2px 6px',
                  fontFamily: 'monospace',
                }}
              >
                ESC
              </span>
            </div>

            {/* command list */}
            <div ref={listRef} style={{ maxHeight: 360, overflowY: 'auto', padding: '8px 0' }}>
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: '20px 16px',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  Nenhum comando encontrado
                </div>
              )}
              {categories.map(category => (
                <div key={category}>
                  <div
                    style={{
                      padding: '6px 16px 4px',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {category}
                  </div>
                  {filtered
                    .filter(c => c.category === category)
                    .map(cmd => {
                      const idx = filtered.indexOf(cmd)
                      const isSelected = idx === selected
                      return (
                        <div
                          key={cmd.id}
                          ref={el => {
                            itemRefs.current[idx] = el
                          }}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '9px 16px',
                            cursor: 'pointer',
                            backgroundColor: isSelected
                              ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                              : 'transparent',
                            borderLeft: isSelected
                              ? '2px solid var(--accent)'
                              : '2px solid transparent',
                            transition: 'all 0.1s',
                          }}
                        >
                          <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>
                            {cmd.icon}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                            }}
                          >
                            {cmd.label}
                          </span>
                          {cmd.href && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
                          )}
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>

            {/* footer */}
            <div
              style={{
                padding: '8px 16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: 16,
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
              }}
            >
              <span>↑↓ navegar</span>
              <span>↵ executar</span>
              <span>ESC fechar</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
