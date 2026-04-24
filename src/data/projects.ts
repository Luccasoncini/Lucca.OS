export type ProjectType = 'pessoal' | 'empresa' | 'freelance'

export interface Project {
  id: string
  name: string
  period: string
  description: string
  tags: string[]
  type: ProjectType
  link?: string
  linkLabel?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'lucca-os',
    name: 'Lucca.OS',
    period: '2026',
    description:
      'Este portfólio. IA integrada com streaming, partículas 3D interativas, agents autônomos via GitHub Actions e CI/CD automatizado.',
    tags: ['React', 'TypeScript', 'Claude API', 'Three.js', 'Framer Motion'],
    type: 'pessoal',
    link: 'https://github.com/luccasoncini/Lucca.OS',
    linkLabel: 'GitHub',
  },
  {
    id: 'all-discovery',
    name: 'Plataforma SaaS Jurídica',
    period: '2025 — atual',
    description:
      'SaaS para análise patrimonial e inteligência jurídica. Arquitetura de combos dinâmica definida do zero, relatórios gerados com IA e autenticação OTP.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'OpenAI'],
    type: 'empresa',
  },
  {
    id: 'moderniza',
    name: 'ERP + E-commerce',
    period: '2022 — 2024',
    description:
      'Integração profunda entre ERP e e-commerce com sincronização em tempo real. Plataforma visual que deu autonomia total ao cliente para editar sem depender de dev.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    type: 'empresa',
  },
  {
    id: 'garimpeiros',
    name: 'Garimpeiros da Picanha',
    period: '2024',
    description:
      'Plataforma educacional para técnicos de reparo de celular com membership no YouTube. +400 membros ativos. Um dos primeiros projetos desenvolvidos com IA como copiloto.',
    tags: ['WordPress', 'WhatsApp'],
    type: 'freelance',
    link: 'https://garimpeirosdapicanha.com.br',
    linkLabel: 'Ver site',
  },
  {
    id: 'pwj',
    name: 'PWJ Esquadrias',
    period: '2024',
    description:
      'Site institucional para fabricante de esquadrias de alumínio, fornecedor de Cyrela, EZTEC e Gafisa. Foco em portfólio B2B de alto padrão.',
    tags: ['WordPress', 'PHP'],
    type: 'freelance',
    link: 'https://pwj.com.br',
    linkLabel: 'Ver site',
  },
  {
    id: 'soncini',
    name: 'Soncini Engenharia',
    period: '2024',
    description:
      'Site para consultoria de engenharia de condomínios com 30 anos de mercado. Galeria de obras, estatísticas de credibilidade e formulário de contato.',
    tags: ['WordPress', 'PHP'],
    type: 'freelance',
    link: 'https://soncini.eng.br',
    linkLabel: 'Ver site',
  },
]

export const TYPE_COLORS: Record<ProjectType, string> = {
  pessoal: '#6366f1',
  empresa: '#34d399',
  freelance: '#f59e0b',
}

export const TYPE_LABELS: Record<ProjectType, string> = {
  pessoal: 'pessoal',
  empresa: 'empresa',
  freelance: 'freelance',
}
