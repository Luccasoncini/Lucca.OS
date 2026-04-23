import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Case {
  id: string
  title: string
  context: string
  problem: string
  hypothesis: string
  decision: string
  result: string
  tags: string[]
}

const CASES: Case[] = [
  {
    id: 'virtual-scroll',
    title: 'Tabela com 50k linhas — sem travar o browser',
    context:
      'Dashboard financeiro precisava exibir extrato completo de transações. O produto cresceu e a tabela chegou a 50 mil linhas.',
    problem:
      'A renderização de 50k linhas de uma vez travava o browser por 8 segundos. Usuários reclamavam que a página "morria" ao abrir o relatório.',
    hypothesis:
      'Se eu renderizar apenas as linhas visíveis na viewport (virtualização), o DOM fica pequeno independente do tamanho dos dados.',
    decision:
      'Implementei virtualização com TanStack Virtual. O DOM mantém ~30 linhas renderizadas independente do tamanho da lista. Nenhuma lib de tabela pronta — queriam controle total sobre o layout.',
    result:
      'Tempo de renderização caiu de 8s para 60ms. Scroll suave em 60fps mesmo com filtros aplicados. Zero reclamação de performance após o deploy.',
    tags: ['Performance', 'React', 'Virtualização'],
  },
  {
    id: 'state-management',
    title: 'Redux vs Zustand — por que troquei depois de 2 anos',
    context:
      'Produto com 3 anos de Redux. Time cresceu, features ficaram mais complexas, e o tempo de onboarding de novos devs chegou a 3 semanas só para entender o estado.',
    problem:
      'Redux estava resolvendo o problema, mas o custo de manutenção era alto. Cada feature nova exigia actions, reducers, selectors e testes para tudo isso. Boilerplate estava matando velocidade.',
    hypothesis:
      'Se o estado for mais próximo dos componentes que o consomem e a API for mais simples, o time entrega mais rápido sem abrir mão de previsibilidade.',
    decision:
      'Migração incremental para Zustand. Comecei pelos módulos menos críticos, mantendo Redux no core financeiro. Criamos convenções de nomenclatura para os stores e documentamos os padrões no Storybook.',
    result:
      'Tempo de onboarding caiu de 3 semanas para 4 dias para a parte de estado. Velocidade de entrega de features aumentou ~35%. O módulo Redux ainda existe — não migramos o que não precisava ser migrado.',
    tags: ['Arquitetura', 'Estado', 'DX'],
  },
  {
    id: 'design-tokens',
    title: 'Por que o dark mode quebrou em produção (e o que aprendi)',
    context:
      'Implementamos dark mode em uma semana. Funcionou perfeitamente em desenvolvimento. Em produção, 30% dos usuários relataram elementos invisíveis ou com contraste zero.',
    problem:
      'Tokens de cor estavam hardcoded em alguns componentes antigos. O dark mode CSS variável funcionava para os novos, mas os componentes legados ignoravam o tema.',
    hypothesis:
      'O problema não é o dark mode. É a ausência de um sistema de tokens. Sem tokens, cada dev escolhe sua própria cor e o tema fica inconsistente.',
    decision:
      'Pausamos o dark mode. Fizemos um audit completo de todas as ocorrências de cores hardcoded (eram 847). Criamos tokens semânticos — não `#111` mas `color.text.primary`. Depois reativamos o tema.',
    result:
      'Dark mode reativado 3 semanas depois, sem nenhum relato de bug visual. O audit revelou também 12 componentes com problemas de acessibilidade de contraste que corrigimos junto.',
    tags: ['CSS', 'Design System', 'Acessibilidade'],
  },
  {
    id: 'micro-frontend',
    title: 'Micro-frontend: quando vale e quando não vale',
    context:
      'Empresa com 4 times de produto, cada um com sua stack preferida. Proposta de micro-frontend surgiu para "deixar cada time independente".',
    problem:
      'Pressão para adotar micro-frontend sem avaliar o custo. Alguns times queriam Vue, outros React, outros Angular. A liderança achava que micro-frontend resolvia o problema de autonomia.',
    hypothesis:
      'Micro-frontend resolve problema de deploy e autonomia de times grandes. Para times menores, o overhead de infraestrutura e a perda de consistência de UX custam mais do que valem.',
    decision:
      'Propus mono-repo com React em todos os times + design system compartilhado. Times continuaram autônomos no nível de feature, não de stack. Cada time tem seu próprio pacote, deploy independente via GitHub Actions.',
    result:
      'Arquitetura mais simples, UX consistente, onboarding de novos devs mais rápido. A proposta de micro-frontend foi descartada. Um dos times que insistia em Vue migrou para React em 2 meses por conta própria.',
    tags: ['Arquitetura', 'Times', 'Decisão técnica'],
  },
]

function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: '3px 8px',
        borderRadius: 20,
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      {tag}
    </span>
  )
}

export function ThinkingPage() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ flex: 1, padding: '32px 24px', maxWidth: 760, margin: '0 auto', width: '100%' }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>
          Thinking
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Problemas reais, decisões reais. Como chego na solução.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CASES.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 14,
              backgroundColor: 'var(--surface)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpen(prev => (prev === c.id ? null : c.id))}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '18px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                textAlign: 'left',
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: 'var(--text)',
                    fontSize: 15,
                    fontWeight: 500,
                    margin: '0 0 8px',
                    lineHeight: 1.4,
                  }}
                >
                  {c.title}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.tags.map(t => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
              </div>
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 18,
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: open === c.id ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ↓
              </span>
            </button>

            <AnimatePresence>
              {open === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '0 20px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: 13,
                        lineHeight: 1.7,
                        margin: '16px 0 0',
                      }}
                    >
                      {c.context}
                    </p>

                    {[
                      { label: '🔴 Problema', content: c.problem },
                      { label: '🟡 Hipótese', content: c.hypothesis },
                      { label: '🔵 Decisão', content: c.decision },
                      { label: '🟢 Resultado', content: c.result },
                    ].map(({ label, content }) => (
                      <div key={label}>
                        <p
                          style={{
                            color: 'var(--accent)',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            margin: '0 0 5px',
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.7, margin: 0 }}
                        >
                          {content}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
