import { motion } from 'framer-motion'

const STACK = [
  { category: 'Core', items: ['React', 'TypeScript', 'JavaScript'] },
  {
    category: 'Styling & UI',
    items: ['Material UI', 'Tailwind CSS', 'Framer Motion', 'Styled-components'],
  },
  { category: 'Backend', items: ['Node.js', 'Express', 'TypeORM', 'PostgreSQL'] },
  { category: 'APIs & IA', items: ['OpenAI API', 'Claude API', 'REST', 'WebSocket'] },
  { category: 'Tooling', items: ['Git', 'GitHub Actions', 'n8n', 'Postman', 'Vite'] },
  {
    category: 'Práticas',
    items: ['Clean Code', 'Design Systems', 'Componentização', 'Metodologias Ágeis'],
  },
]

const EXPERIENCE = [
  {
    role: 'Desenvolvedor Front-end Pleno',
    company: 'Grupo All Discovery',
    period: 'Abr 2025 — Atualmente',
    description:
      'Desenvolvimento de uma plataforma SaaS para análise patrimonial, inteligência jurídica e automação de processos. Interfaces em React + TypeScript + Material UI, fluxos de autenticação com OTP via SMS, integrações com APIs financeiras, veiculares e jurídicas, e funcionalidades com OpenAI para relatórios estratégicos. Também atuo no backend com Node.js, Express, TypeORM e PostgreSQL.',
  },
  {
    role: 'Desenvolvedor React',
    company: 'Moderniza Group',
    period: 'Dez 2022 — Abr 2024',
    description:
      'Braço direito no projeto principal da empresa: integração do ERP interno com módulo de e-commerce. Construí plataforma de configuração visual (estilo WordPress), módulo de cobrança automática (faturas e pagamentos), componentes reutilizáveis em React e APIs REST com PostgreSQL. Liderei apresentações e produzi documentações técnicas para alinhamento entre times.',
  },
  {
    role: 'Desenvolvedor Front-end React',
    company: 'Moderniza Group',
    period: 'Jul 2022 — Nov 2022',
    description:
      'Estágio onde desenvolvi componentes React reutilizáveis, integrei APIs REST e evoluí interfaces com foco em performance, responsividade e acessibilidade.',
  },
  {
    role: 'Desenvolvedor Web',
    company: 'CRT Comunicação',
    period: 'Dez 2021 — Mai 2022',
    description:
      'E-mail marketing, landing pages otimizadas para conversão e sites WordPress. Integração entre WordPress e ferramentas externas com validações via Postman.',
  },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2
        style={{
          color: 'var(--text-muted)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function HirePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        padding: '32px 24px',
        maxWidth: 760,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent), #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            L
          </div>
          <div>
            <h1 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 600, margin: '0 0 3px' }}>
              Lucca Dias Soncini
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
              Desenvolvedor Front-end · Arujá, SP · 23 anos
            </p>
          </div>
        </div>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 14,
            lineHeight: 1.7,
            margin: 0,
            maxWidth: 620,
          }}
        >
          Desenvolvedor front-end com experiência desde os 17 anos. Atuei em e-commerce, ERP e
          plataformas SaaS, com foco em arquitetura, componentização e IA aplicada a produtos.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: '✅ Aberto a oportunidades', accent: true },
            { label: 'Freelance & CLT', accent: false },
            { label: '4 anos de experiência', accent: false },
            { label: 'Inglês Intermediário', accent: false },
          ].map(({ label, accent }) => (
            <span
              key={label}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 20,
                border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: accent
                  ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                  : 'var(--surface)',
                color: accent ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* stack */}
      <Section title="Stack">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STACK.map(({ category, items }) => (
            <div key={category} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span
                style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 110, flexShrink: 0 }}
              >
                {category}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {items.map(item => (
                  <span
                    key={item}
                    style={{
                      fontSize: 12,
                      padding: '3px 8px',
                      borderRadius: 6,
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* experience */}
      <Section title="Experiência">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCE.map((exp, i) => (
            <div
              key={exp.company + exp.period}
              style={{
                display: 'flex',
                gap: 16,
                paddingBottom: i < EXPERIENCE.length - 1 ? 24 : 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  paddingTop: 5,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                  }}
                />
                {i < EXPERIENCE.length - 1 && (
                  <div
                    style={{ width: 1, flex: 1, backgroundColor: 'var(--border)', marginTop: 6 }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 4,
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: 'var(--text)',
                        fontSize: 14,
                        fontWeight: 600,
                        margin: '0 0 2px',
                      }}
                    >
                      {exp.role}
                    </p>
                    <p style={{ color: 'var(--accent)', fontSize: 13, margin: 0 }}>{exp.company}</p>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>
                    {exp.period}
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    lineHeight: 1.65,
                    margin: '8px 0 0',
                  }}
                >
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* contact */}
      <Section title="Contato">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 10,
          }}
        >
          {[
            {
              label: 'Email',
              value: 'luccadiassoncini@gmail.com',
              href: 'mailto:luccadiassoncini@gmail.com',
            },
            {
              label: 'LinkedIn',
              value: 'Lucca Soncini',
              href: 'https://www.linkedin.com/in/lucca-soncini/',
            },
            {
              label: 'GitHub',
              value: 'github.com/Luccasoncini',
              href: 'https://github.com/Luccasoncini',
            },
          ].map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {label}
              </span>
              <span style={{ color: 'var(--text)', fontSize: 13 }}>{value}</span>
            </a>
          ))}
        </div>
      </Section>
    </motion.div>
  )
}
