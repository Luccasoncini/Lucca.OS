import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const canSubmit = name.trim() && email.trim() && message.trim() && status === 'idle'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setStatus('sending')

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: name, from_email: email, message, reply_to: email },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 12px',
    color: 'var(--text)',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        marginTop: 8,
        marginLeft: 42,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '16px 18px',
        maxWidth: '78%',
      }}
    >
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: 12,
          fontFamily: 'monospace',
          margin: '0 0 12px',
          letterSpacing: '0.03em',
        }}
      >
        {'>'} enviar mensagem direta
      </p>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <p style={{ color: '#34d399', fontFamily: 'monospace', fontSize: 13, margin: 0 }}>
              Mensagem enviada! Responderei em breve.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Nome"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            <textarea
              placeholder="Mensagem..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 72,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />

            {status === 'error' && (
              <p style={{ color: '#ef4444', fontSize: 12, margin: 0, fontFamily: 'monospace' }}>
                Erro ao enviar. Tente pelo Gmail ou WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                alignSelf: 'flex-end',
                background: canSubmit
                  ? 'linear-gradient(135deg, var(--accent), #7c3aed)'
                  : 'var(--border)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                fontFamily: 'inherit',
                padding: '7px 18px',
                cursor: canSubmit ? 'pointer' : 'default',
                opacity: canSubmit ? 1 : 0.6,
                transition: 'all 0.15s',
              }}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
