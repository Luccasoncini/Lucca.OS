# lucca.os

> Portfólio interativo com IA. Uma interface de chat que substitui páginas estáticas — tudo passa pela conversa.

**[→ lucca-os.vercel.app](https://lucca-os.vercel.app)**

---

## O problema com portfólios tradicionais

Portfólios estáticos mostram o que você fez. Não mostram como você pensa, como você toma decisões, ou como é trabalhar com você.

O Lucca.OS resolve isso com uma interface de chat alimentada por Claude (Anthropic), onde qualquer pessoa pode conversar diretamente com a IA treinada com minha experiência real — projetos, stack, decisões técnicas, disponibilidade para contratação.

## O que tem aqui

**Interface**

- Chat com streaming em tempo real via Claude Sonnet
- Partículas 3D interativas que reorganizam em formações conforme o contexto (nebulosa → anéis → grid → hélice)
- Boot sequence estilo terminal ao carregar
- Status bar com intenção detectada, modelo ativo, feed de commits ao vivo e relógio
- `⌘K` command palette com atalhos de navegação
- Tema dark/light
- Persistência de conversa via localStorage

**Painel de Projetos**

- Drawer lateral com cards detalhados de todos os projetos
- Abre via intent detectada na conversa ou pelo `⌘K`
- Cards com tipo (pessoal / empresa / freelance), stack, período e links

**Contato**

- Formulário de contato inline integrado ao EmailJS
- Aparece contextualmente quando a intenção de contato é detectada
- Download de CV direto pelo chat ou pelo `⌘K`

**IA**

- Detecção de intenção (contato, projetos, contratação) que muda o visual e abre painéis em tempo real
- Botões de ação contextuais após cada resposta
- Sugestões iniciais para guiar a conversa
- Escopo estrito: só responde sobre minha carreira e projetos

**Infraestrutura**

- `dev-agent`: lê issues com label `agent:build`, gera código com Claude e abre PR automaticamente
- `review-agent`: revisa cada PR com Claude e posta comentário de code review
- Commits semânticos enforçados com commitlint + husky
- CI/CD via GitHub Actions
- Google Analytics 4 para métricas de visitantes
- SEO completo: JSON-LD (Person schema), Open Graph, Twitter Card, sitemap, robots.txt

## Stack

| Camada    | Tecnologia                           |
| --------- | ------------------------------------ |
| UI        | React 19 + TypeScript                |
| 3D        | Three.js + React Three Fiber         |
| Animações | Framer Motion                        |
| Estado    | Zustand                              |
| IA        | Claude API (Anthropic) com streaming |
| Contato   | EmailJS                              |
| Analytics | Google Analytics 4                   |
| Build     | Vite 8                               |
| Deploy    | Vercel                               |
| Qualidade | ESLint, Prettier, commitlint, husky  |

## Rodando localmente

```bash
git clone https://github.com/luccasoncini/lucca-os
cd lucca-os
npm install
```

Crie um `.env` na raiz:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Opcional — necessário para o formulário de contato funcionar
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

```bash
npm run dev
```

Acesse `http://localhost:5173`.

> A chave da API Anthropic é necessária para o chat funcionar. Você pode obter uma em [console.anthropic.com](https://console.anthropic.com).

## Agents

### dev-agent

Cria código a partir de issues do GitHub. Para usar:

1. Abra uma issue descrevendo o que precisa ser feito
2. Adicione a label `agent:build`
3. O agent lê a issue, gera o código com Claude, cria uma branch e abre um PR

### review-agent

Dispara automaticamente em todo PR aberto ou atualizado. Claude analisa o diff e posta um comentário de code review com observações sobre qualidade, segurança e sugestões.

## Estrutura

```
src/
├── components/
│   ├── 3d/          # Background3D — sistema de partículas
│   └── ui/          # TopBar, StatusBar, BootSequence, CommandPalette,
│                    # ActionButtons, ProjectPanel, ContactForm
├── data/
│   └── projects.ts  # Lista de projetos com metadados
├── features/
│   └── ai-assistant/ # Chat principal
├── hooks/
│   ├── useGithubActivity.ts # Feed de commits ao vivo
│   └── useIsMobile.ts
├── services/
│   └── ai.service.ts # Integração Claude API + system prompt
├── store/
│   └── ui.store.ts   # Estado global (tema, intent, comandos)
└── utils/
    └── intent.ts     # Detecção de intenção e action buttons

agents/
├── dev-agent/        # Geração de código via issues
└── review-agent/     # Code review automático

.github/workflows/
├── agent-dev.yml
└── agent-review.yml

public/
├── robots.txt
└── sitemap.xml
```

## Licença

MIT — fique à vontade para se inspirar, mas o conteúdo (experiência, projetos, dados pessoais) é meu.
