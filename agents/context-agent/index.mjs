/**
 * Context Agent — atualiza os arquivos de contexto da IA (ai/context/)
 * Disparado manualmente ou via workflow quando projetos/skills mudam.
 */
import { writeFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const input = process.env.CONTEXT_INPUT
const contextType = process.env.CONTEXT_TYPE // projects | skills | experiences

if (!input || !contextType) {
  console.error('CONTEXT_INPUT and CONTEXT_TYPE env vars are required')
  process.exit(1)
}

const filePath = `ai/context/${contextType}.json`

const systemPrompt = `Você é um agente responsável por manter o contexto da IA do Lucca.OS atualizado.

Dado um input em texto livre descrevendo uma atualização de ${contextType},
retorne APENAS o JSON atualizado válido para o arquivo ${filePath}.

Mantenha o mesmo schema dos dados existentes.`

async function updateContext() {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: input }],
    system: systemPrompt,
  })

  const responseText = message.content[0].text
  const jsonMatch = responseText.match(/[\[{][\s\S]*[\]}]/)
  if (!jsonMatch) throw new Error('Agent did not return valid JSON')

  JSON.parse(jsonMatch[0])

  writeFileSync(filePath, jsonMatch[0])
  console.log(`Updated: ${filePath}`)
}

updateContext().catch(err => {
  console.error(err)
  process.exit(1)
})
