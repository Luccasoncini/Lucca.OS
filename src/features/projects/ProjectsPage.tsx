import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: string
  title: string
  description: string
  problem: string
  solution: string
  impact: string
  techs: string[]
  year: number
  link?: string
  github?: string
}

const PROJECTS: Project[] = [
  {
    id: 'lucca-os',
    title: 'Lucca.OS',
    description: 'Portfólio interativo que funciona como um sistema operacional de desenvolvedor.',
    problem:
      'Portfólios tradicionais não transmitem como um desenvolvedor pensa. São estáticos, genéricos e não mostram processo.',
    solution:
      'Sistema com IA integrada (Claude API), agents autônomos que automatizam commits e PRs, e uma estrutura de código que é em si parte do portfólio.',
    impact:
      'Visitantes interagem com a IA e entendem o raciocínio técnico. Devs que entram no repo veem commits semânticos, PRs automáticos e agents documentados.',
    techs: ['React', 'TypeScript', 'Claude API', 'GitHub Actions', 'Framer Motion', 'Zustand'],
    year: 2026,
    github: 'https://github.com/lucca/lucca-os',
  },
  {
    id: 'erp-module',
    title: 'Módulo de Faturamento ERP',
    description:
      'Refatoração completa do módulo de faturamento de um ERP legado com 50k+ usuários.',
    problem:
      'Interface construída em 2015 sem componentização. Tempo médio de uma operação de faturamento era 4 minutos. Alta taxa de erro de usuário.',
    solution:
      'Redesenho do fluxo reduzindo etapas de 7 para 3, sistema de validação em tempo real e componentização completa em React + TypeScript.',
    impact:
      'Tempo médio de operação caiu de 4min para 45s. Taxa de erro reduziu 78%. Adoção subiu de 60% para 94% do time financeiro.',
    techs: ['React', 'TypeScript', 'React Query', 'Zod', 'Radix UI'],
    year: 2025,
  },
  {
    id: 'realtime-dashboard',
    title: 'Dashboard Analítico em Tempo Real',
    description:
      'Plataforma de monitoramento com WebSockets para dados de e-commerce em tempo real.',
    problem:
      'Time de operações precisava de dados ao vivo mas o sistema atualizava a cada 30 minutos via polling. Decisões eram tomadas com informação velha.',
    solution:
      'Arquitetura com WebSocket + React Query para sincronização optimista, virtualização de listas longas e sistema de alertas configurável.',
    impact:
      'Latência de dados de 30min para 200ms. Dashboard suporta 500+ métricas simultâneas sem degradação de performance.',
    techs: ['React', 'TypeScript', 'WebSocket', 'React Query', 'Recharts', 'TanStack Virtual'],
    year: 2025,
  },
  {
    id: 'design-system',
    title: 'Design System Interno',
    description: 'Sistema de design do zero para padronizar UI entre 4 produtos da empresa.',
    problem:
      'Quatro produtos com quatro implementações diferentes do mesmo botão. Inconsistência visual, bugs duplicados, retrabalho constante entre times.',
    solution:
      'Design system com Storybook, tokens de design, testes de acessibilidade automatizados e publicação via npm privado.',
    impact:
      '40% de redução no tempo de desenvolvimento de novas features. Zero regressão visual após rollout para todos os times.',
    techs: ['React', 'TypeScript', 'Storybook', 'Radix UI', 'CSS Modules', 'Vitest'],
    year: 2024,
  },
]

function TechBadge({ tech }: { tech: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: '3px 8px',
        borderRadius: 6,
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      {tech}
    </span>
  )
}

function ProjectCard({
  project,
  onClick,
  isSelected,
}: {
  project: Project
  onClick: () => void
  isSelected: boolean
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: 'var(--surface)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, margin: 0 }}>
          {project.title}
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>
          {project.year}
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.techs.slice(0, 4).map(t => (
          <TechBadge key={t} tech={t} />
        ))}
        {project.techs.length > 4 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 4px' }}>
            +{project.techs.length - 4}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'sticky',
        top: 72,
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 600, margin: '0 0 4px' }}>
            {project.title}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{project.year}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '4px 10px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          ✕
        </button>
      </div>

      {[
        { label: '🔴 Problema', content: project.problem },
        { label: '🟡 Solução', content: project.solution },
        { label: '🟢 Impacto', content: project.impact },
      ].map(({ label, content }) => (
        <div key={label}>
          <p
            style={{
              color: 'var(--accent)',
              fontSize: 12,
              fontWeight: 600,
              margin: '0 0 6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </p>
          <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {content}
          </p>
        </div>
      ))}

      <div>
        <p
          style={{
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: 600,
            margin: '0 0 10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Stack
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.techs.map(t => (
            <TechBadge key={t} tech={t} />
          ))}
        </div>
      </div>

      {(project.github || project.link) && (
        <div style={{ display: 'flex', gap: 8 }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-2)',
                color: 'var(--text-muted)',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              GitHub →
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                color: '#fff',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Ver projeto →
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null)

  function toggle(project: Project) {
    setSelected(prev => (prev?.id === project.id ? null : project))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ flex: 1, padding: '32px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>
          Projetos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Clique em um projeto para ver o problema, decisão e impacto.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selected ? '1fr 380px' : '1fr',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}
        >
          {PROJECTS.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => toggle(p)}
              isSelected={selected?.id === p.id}
            />
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <ProjectDetail key={selected.id} project={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
