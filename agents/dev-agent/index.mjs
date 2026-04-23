import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const issueNumber = process.env.ISSUE_NUMBER
const issueTitle = process.env.ISSUE_TITLE
const issueBody = process.env.ISSUE_BODY || ''
const repo = process.env.REPO

const projectsContext = readFileSync('ai/context/projects.json', 'utf-8')
const skillsContext = readFileSync('ai/context/skills.json', 'utf-8')

const systemPrompt = `Você é um agente de desenvolvimento especializado em React e TypeScript.

Você vai receber uma issue do GitHub e deve:
1. Analisar o que precisa ser implementado
2. Retornar um JSON com os arquivos a criar/modificar e o conteúdo de cada um
3. Também retornar a mensagem de commit no formato conventional commits

Contexto do projeto:
- Stack: React, TypeScript, Vite, Tailwind
- Skills: ${skillsContext}
- Projetos: ${projectsContext}

Retorne APENAS um JSON válido no formato:
{
  "branchName": "feat/nome-da-feature",
  "commitMessage": "feat(scope): descrição curta",
  "prTitle": "feat(scope): título do PR",
  "prBody": "## O que esse PR faz\\n\\n...",
  "files": [
    {
      "path": "src/features/...",
      "content": "..."
    }
  ]
}`

async function runDevAgent() {
  console.log(`Processing issue #${issueNumber}: ${issueTitle}`)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Issue #${issueNumber}: ${issueTitle}\n\n${issueBody}`,
      },
    ],
    system: systemPrompt,
  })

  const responseText = message.content[0].text
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Agent did not return valid JSON')

  const plan = JSON.parse(jsonMatch[0])

  execSync(`git checkout -b ${plan.branchName}`)

  for (const file of plan.files) {
    const dir = file.path.substring(0, file.path.lastIndexOf('/'))
    if (dir) mkdirSync(dir, { recursive: true })
    writeFileSync(file.path, file.content)
    console.log(`Created: ${file.path}`)
  }

  execSync(`git add ${plan.files.map(f => f.path).join(' ')}`)
  execSync(`git commit -m "${plan.commitMessage}"`)
  execSync(`git push origin ${plan.branchName}`)

  const prResponse = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: plan.prTitle,
      body: `${plan.prBody}\n\n---\n*PR gerado automaticamente pelo [dev-agent](../agents/dev-agent/) — Issue #${issueNumber}*`,
      head: plan.branchName,
      base: 'main',
    }),
  })

  if (!prResponse.ok) {
    throw new Error(`GitHub API error: ${prResponse.status}`)
  }

  const pr = await prResponse.json()
  console.log(`PR created: ${pr.html_url}`)

  await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      body: `🤖 **Dev Agent** criou o PR para essa issue: ${pr.html_url}`,
    }),
  })
}

runDevAgent().catch(err => {
  console.error(err)
  process.exit(1)
})
