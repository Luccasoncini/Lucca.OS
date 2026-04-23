import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { askLucca } from '@/services/ai.service'

const DEMOS = [
  {
    id: 'explain-project',
    label: '📦 Explique um projeto',
    prompt: 'Explique o Lucca.OS como se eu fosse um recrutador técnico que não conhece o projeto.',
  },
  {
    id: 'debug',
    label: '🐛 Simule um debug',
    prompt:
      'Simule um processo de debug de um bug de performance em React onde um componente re-renderiza infinitamente.',
  },
  {
    id: 'code-review',
    label: '🔍 Faça um code review',
    prompt:
      'Faça um code review construtivo de um componente React hipotético que usa useEffect para buscar dados, sem React Query, sem tratamento de erro e sem loading state.',
  },
  {
    id: 'architecture',
    label: '🏗 Decida uma arquitetura',
    prompt:
      'Como você estruturaria o estado global de um app de e-commerce com carrinho, autenticação e filtros de produto? Justifique cada decisão.',
  },
]

export function PlaygroundPage() {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  async function runDemo(demo: (typeof DEMOS)[0]) {
    if (loading) return
    setActiveDemo(demo.id)
    setOutput('')
    setLoading(true)

    await askLucca([{ role: 'user', content: demo.prompt }], chunk => {
      setOutput(prev => prev + chunk)
    })

    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        flex: 1,
        padding: '32px 24px',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div>
        <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>
          Playground
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Clique em um demo para ver como eu penso e respondo em situações reais.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
        }}
      >
        {DEMOS.map(demo => (
          <motion.button
            key={demo.id}
            onClick={() => runDemo(demo)}
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              border: `1px solid ${activeDemo === demo.id ? 'var(--accent)' : 'var(--border)'}`,
              backgroundColor:
                activeDemo === demo.id
                  ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))'
                  : 'var(--surface)',
              color: activeDemo === demo.id ? 'var(--text)' : 'var(--text-muted)',
              fontSize: 13,
              textAlign: 'left',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              opacity: loading && activeDemo !== demo.id ? 0.5 : 1,
            }}
          >
            {demo.label}
          </motion.button>
        ))}
      </div>

      {(output || loading) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px 24px',
            color: 'var(--text)',
            fontSize: 14,
            lineHeight: 1.7,
            minHeight: 120,
          }}
        >
          {loading && !output && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    display: 'block',
                  }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p style={{ margin: '0 0 10px', lineHeight: 1.7 }}>{children}</p>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    color: 'var(--text)',
                    fontSize: 16,
                    fontWeight: 600,
                    margin: '16px 0 8px',
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
                    margin: '12px 0 6px',
                  }}
                >
                  {children}
                </h3>
              ),
              strong: ({ children }) => (
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>
              ),
              ul: ({ children }) => (
                <ul style={{ margin: '6px 0 10px', paddingLeft: 20 }}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol style={{ margin: '6px 0 10px', paddingLeft: 20 }}>{children}</ol>
              ),
              li: ({ children }) => (
                <li style={{ lineHeight: 1.6, marginBottom: 4 }}>{children}</li>
              ),
              code: ({ children, className }) =>
                !className ? (
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
                  <code style={{ fontFamily: 'monospace', fontSize: 12 }}>{children}</code>
                ),
              pre: ({ children }) => (
                <pre
                  style={{
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    overflowX: 'auto',
                    margin: '8px 0 12px',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    lineHeight: 1.6,
                  }}
                >
                  {children}
                </pre>
              ),
              hr: () => (
                <hr
                  style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }}
                />
              ),
            }}
          >
            {output}
          </ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  )
}
