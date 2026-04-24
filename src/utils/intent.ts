export type Intent = 'contact' | 'projects' | 'hire' | 'default'

export interface ActionButton {
  label: string
  icon: string
  href?: string
  message?: string
  variant?: 'default' | 'accent'
  download?: string
}

const PATTERNS: Record<Intent, RegExp> = {
  contact: /contato|email|linkedin|whatsapp|telefone|mensagem|falar|chamar/i,
  hire: /contratar|contrat|disponível|disponibilidade|vaga|oportunidade|hire|trabalhar|remoto|freelance|clt|salário|pretensão/i,
  projects:
    /projeto|lucca\.?os|moderniza|all discovery|portfólio|desenvolveu|trabalhou|fez|criou|construiu/i,
  default: /.*/,
}

export const ACTION_BUTTONS: Record<Intent, ActionButton[]> = {
  contact: [
    {
      label: 'LinkedIn',
      icon: '🔗',
      href: 'https://www.linkedin.com/in/lucca-soncini/',
      variant: 'accent',
    },
    { label: 'Gmail', icon: '📧', href: 'mailto:luccadiassoncini@gmail.com' },
    { label: 'WhatsApp', icon: '💬', href: 'https://wa.me/5511989785140' },
  ],
  hire: [
    {
      label: 'Baixar CV',
      icon: '📄',
      href: '/curriculo-lucca-soncini.pdf',
      download: 'Curriculo-Lucca-Soncini.pdf',
      variant: 'accent',
    },
    {
      label: 'LinkedIn',
      icon: '🔗',
      href: 'https://www.linkedin.com/in/lucca-soncini/',
    },
    { label: 'Mandar email', icon: '📧', href: 'mailto:luccadiassoncini@gmail.com' },
  ],
  projects: [
    { label: 'GitHub', icon: '⌥', href: 'https://github.com/luccasoncini', variant: 'accent' },
    {
      label: 'Como foi o Lucca.OS?',
      icon: '🤖',
      message:
        'Me conta mais sobre como o Lucca.OS foi desenvolvido e quais foram os maiores desafios.',
    },
    {
      label: 'Qual seu projeto favorito?',
      icon: '❤️',
      message: 'Qual foi o projeto que você mais gostou de desenvolver e por quê?',
    },
  ],
  default: [],
}

export function detectIntent(text: string): Intent {
  if (PATTERNS.contact.test(text)) return 'contact'
  if (PATTERNS.hire.test(text)) return 'hire'
  if (PATTERNS.projects.test(text)) return 'projects'
  return 'default'
}
