import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

const MUSEUMS = [
  "Louvre",
  "Musée d'Orsay",
  "Centre Pompidou",
  "Palais de Tokyo",
  "Musée Rodin",
  "Fondation Louis Vuitton",
  "Grand Palais",
  "Musée de l'Orangerie",
  "Musée Picasso",
  "Jeu de Paume",
]

export async function GET() {
  try {
    const prompt = `You are a Paris art & culture expert. Search the web for current and upcoming exhibitions (as of May 2026) at these Paris museums and galleries: ${MUSEUMS.join(', ')}.

Return ONLY a valid JSON array (no markdown, no backticks, no preamble) with 12-16 exhibitions.

Each object must have exactly these keys:
- "title": exhibition name
- "museum": museum name (use the exact names from the list above)
- "artist": main artist or curator name, or null if group show
- "dates": date range string e.g. "12 Apr – 30 Jun 2026"
- "startDate": ISO date string e.g. "2026-04-12"
- "endDate": ISO date string e.g. "2026-06-30"
- "status": "Ongoing" or "Upcoming"
- "description": 2-3 sentence description
- "url": official URL if available, else null
- "category": one of "Painting", "Sculpture", "Photography", "Design", "Contemporary", "Retrospective", "Mixed Media"

Return only the JSON array. No other text.`

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let raw = textBlock.text.trim().replace(/```json|```/g, '').trim()
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')
    if (start === -1 || end === -1) {
      return NextResponse.json({ error: 'Could not parse exhibitions data' }, { status: 500 })
    }
    raw = raw.slice(start, end + 1)

    const exhibitions = JSON.parse(raw)
    return NextResponse.json({ exhibitions, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch exhibitions' }, { status: 500 })
  }
}
