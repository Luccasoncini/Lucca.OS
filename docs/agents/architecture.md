# Agents Architecture

O Lucca.OS usa três agents autônomos que rodam via GitHub Actions.

## dev-agent

**Trigger:** Issue com label `agent:build`

**Fluxo:**

1. Lê o título e corpo da issue
2. Injeta contexto do projeto (`ai/context/`)
3. Chama Claude Sonnet para gerar o código
4. Cria branch `feat/...` com os arquivos gerados
5. Faz commit com mensagem no padrão conventional commits
6. Abre PR com descrição gerada pela IA
7. Comenta na issue com o link do PR

**Quando usar:**
Para features bem descritas que seguem padrões já estabelecidos no projeto.

---

## review-agent

**Trigger:** Todo PR aberto ou atualizado

**Fluxo:**

1. Extrai o diff completo do PR
2. Chama Claude Sonnet para revisar
3. Posta o review como comentário no PR

**O que revisa:**

- Correctness
- Legibilidade
- Performance (React-specific)
- Tipagem TypeScript
- Convenções do projeto

---

## context-agent

**Trigger:** Manual ou via workflow quando `ai/context/` muda

**Fluxo:**

1. Recebe input em texto livre descrevendo a mudança
2. Chama Claude Haiku para estruturar em JSON
3. Atualiza o arquivo correspondente em `ai/context/`

**Quando usar:**
Ao adicionar um novo projeto, experiência ou skill ao portfólio.

---

## Secrets necessários no GitHub

| Secret              | Descrição                   |
| ------------------- | --------------------------- |
| `ANTHROPIC_API_KEY` | Chave da API do Claude      |
| `VERCEL_TOKEN`      | Token de deploy do Vercel   |
| `VERCEL_ORG_ID`     | ID da organização no Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto no Vercel     |
