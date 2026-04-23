import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const diff = readFileSync('full_diff.txt', 'utf-8')
const changedFiles = readFileSync('changed_files.txt', 'utf-8').trim()

const prTitle = process.env.PR_TITLE
const prBody = process.env.PR_BODY || ''
const prNumber = process.env.PR_NUMBER
const repo = process.env.REPO

const systemPrompt = `Você é um revisor de código sênior especializado em React, TypeScript e boas práticas de frontend.

Seu trabalho é revisar Pull Requests com foco em:
- Correctness: o código faz o que diz que faz?
- Legibilidade: outro dev entenderia em 5 minutos?
- Performance: algum problema óbvio de re-render, vazamento de memória, etc?
- Tipagem: TypeScript está sendo usado corretamente?
- Convenções: segue os padrões do projeto?

Seja direto e específico. Cite linhas quando relevante.
Se o PR estiver bom, diga isso claramente — não invente problemas.
Formate a resposta em Markdown.`

const userPrompt = `## PR #${prNumber}: ${prTitle}

**Descrição:**
${prBody}

**Arquivos alterados:**
${changedFiles}

**Diff completo:**
\`\`\`diff
${diff.slice(0, 15000)}
\`\`\`

Faça o code review desse PR.`

async function runReview() {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const review = message.content[0].text

  const comment = `## 🤖 AI Code Review

${review}

---
*Revisão automatizada pelo [review-agent](../agents/review-agent/) usando Claude Sonnet*`

  const response = await fetch(
    `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: comment }),
    },
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  console.log(`Review posted to PR #${prNumber}`)
}

runReview().catch(err => {
  console.error(err)
  process.exit(1)
})
