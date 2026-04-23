import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { askLucca, type Message } from '@/services/ai.service'
import { ActionButtons } from '@/components/ui/ActionButtons'
import { detectIntent, ACTION_BUTTONS, type Intent } from '@/utils/intent'
import { useUIStore } from '@/store/ui.store'

const SUGGESTIONS = [
  { icon: '💼', text: 'Quero contratar você. Me conta sobre seu perfil.' },
  { icon: '🚀', text: 'Quais projetos você já desenvolveu?' },
  { icon: '🛠', text: 'Qual sua stack principal?' },
  { icon: '🤖', text: 'Como funciona a IA desse portfólio?' },
  { icon: '📬', text: 'Como entro em contato com você?' },
  { icon: '⚡', text: 'O que te diferencia de outros devs?' },
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{
            backgroundColor: 'var(--text-muted)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            display: 'block',
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function LuccaAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), #a855f7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      L
    </div>
  )
}

export function AIAssistant() {
  const { intent, setIntent } = useUIStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMessage]

    setIntent(detectIntent(text))
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStarted(true)

    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    await askLucca(newMessages, chunk => {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: updated[updated.length - 1].content + chunk,
        }
        return updated
      })
    })

    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px 32px',
                gap: 36,
              }}
            >
              {/* avatar + heading */}
              <div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: 'backOut' }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: 'linear-gradient(135deg, var(--accent), #a855f7)',
                    boxShadow: '0 0 48px color-mix(in srgb, var(--accent) 25%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 26,
                    fontWeight: 700,
                  }}
                >
                  L
                </motion.div>

                <div style={{ textAlign: 'center' }}>
                  <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      color: 'var(--text)',
                      fontSize: 36,
                      fontWeight: 600,
                      letterSpacing: '-0.5px',
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    Oi, eu sou o{' '}
                    <span
                      style={{
                        background: 'linear-gradient(90deg, var(--accent), #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Lucca
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}
                  >
                    Desenvolvedor front-end · React · TypeScript · IA
                  </motion.p>
                </div>
              </div>

              {/* suggestion cards */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{
                  width: '100%',
                  maxWidth: 560,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 8,
                }}
              >
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.text}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    onClick={() => send(s.text)}
                    style={{
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-muted)',
                      padding: '12px 14px',
                      borderRadius: 12,
                      fontSize: 13,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.color = 'var(--text)'
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.backgroundColor = 'var(--surface)'
                    }}
                  >
                    <span style={{ fontSize: 15, lineHeight: 1.3 }}>{s.icon}</span>
                    <span>{s.text}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '24px 24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div
                style={{
                  maxWidth: 640,
                  margin: '0 auto',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                      }}
                    >
                      {msg.role === 'assistant' && <LuccaAvatar />}

                      <div
                        style={{
                          maxWidth: '78%',
                          minWidth: 0,
                          overflow: 'hidden',
                          wordBreak: 'break-word',
                          padding: '10px 14px',
                          borderRadius:
                            msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          fontSize: 14,
                          lineHeight: 1.6,
                          ...(msg.role === 'user'
                            ? {
                                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                                color: '#fff',
                                whiteSpace: 'pre-wrap',
                              }
                            : {
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                color: 'var(--text)',
                              }),
                        }}
                      >
                        {msg.role === 'user' ? (
                          msg.content
                        ) : msg.content ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>{children}</p>
                              ),
                              h2: ({ children }) => (
                                <h2
                                  style={{
                                    color: 'var(--text)',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    margin: '12px 0 6px',
                                  }}
                                >
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3
                                  style={{
                                    color: 'var(--text)',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    margin: '10px 0 4px',
                                  }}
                                >
                                  {children}
                                </h3>
                              ),
                              strong: ({ children }) => (
                                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul
                                  style={{
                                    margin: '4px 0 8px',
                                    paddingLeft: 18,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                  }}
                                >
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol
                                  style={{
                                    margin: '4px 0 8px',
                                    paddingLeft: 18,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                  }}
                                >
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => <li style={{ lineHeight: 1.5 }}>{children}</li>,
                              code: ({ children, className }) => {
                                const isInline = !className
                                return isInline ? (
                                  <code
                                    style={{
                                      backgroundColor: 'var(--surface-2)',
                                      border: '1px solid var(--border)',
                                      borderRadius: 4,
                                      padding: '1px 5px',
                                      fontSize: 12,
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <code style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                    {children}
                                  </code>
                                )
                              },
                              pre: ({ children }) => (
                                <pre
                                  style={{
                                    backgroundColor: 'var(--surface-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 8,
                                    padding: '10px 12px',
                                    overflowX: 'auto',
                                    margin: '6px 0 10px',
                                    fontSize: 12,
                                    fontFamily: 'monospace',
                                    lineHeight: 1.6,
                                    maxWidth: '100%',
                                  }}
                                >
                                  {children}
                                </pre>
                              ),
                              hr: () => (
                                <hr
                                  style={{
                                    border: 'none',
                                    borderTop: '1px solid var(--border)',
                                    margin: '10px 0',
                                  }}
                                />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : loading && i === messages.length - 1 ? (
                          <TypingDots />
                        ) : null}
                      </div>

                      {msg.role === 'user' && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          👤
                        </div>
                      )}
                    </div>

                    {msg.role === 'assistant' &&
                      !loading &&
                      i === messages.length - 1 &&
                      ACTION_BUTTONS[intent as Intent].length > 0 && (
                        <ActionButtons
                          buttons={ACTION_BUTTONS[intent as Intent]}
                          onMessage={send}
                        />
                      )}
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* input bar — normal flow, not absolute */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '12px 24px 20px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '10px 14px',
              transition: 'border-color 0.15s',
            }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {started && (
              <motion.button
                onClick={() => {
                  setMessages([])
                  setStarted(false)
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title="Nova conversa"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  fontSize: 15,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#ef4444'
                  e.currentTarget.style.color = '#ef4444'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                ↺
              </motion.button>
            )}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder={
                loading ? 'Lucca está digitando...' : 'Pergunte algo sobre mim ou meus projetos...'
              }
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
            <motion.button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: 'none',
                background:
                  input.trim() && !loading
                    ? 'linear-gradient(135deg, var(--accent), #7c3aed)'
                    : 'var(--border)',
                color: '#fff',
                fontSize: 16,
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
                opacity: !input.trim() || loading ? 0.5 : 1,
              }}
            >
              ↑
            </motion.button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Powered by Claude Sonnet
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
