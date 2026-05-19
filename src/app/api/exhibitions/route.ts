import { NextResponse } from 'next/server'
import type { Exhibition, ExhibitionCategory } from '@/lib/types'

export const revalidate = 3600

const PARIS_API =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records'

interface ParisRecord {
  title?: string
  lead_text?: string
  description?: string
  date_start?: string
  date_end?: string
  address_name?: string
  url?: string
  qfap_tags?: string
  category?: string
}

interface ParisApiResponse {
  results: ParisRecord[]
}

function deriveCategory(qfap_tags?: string, category?: string): ExhibitionCategory {
  const text = `${qfap_tags ?? ''} ${category ?? ''}`.toLowerCase()
  if (text.includes('photo')) return 'Photography'
  if (text.includes('sculpture')) return 'Sculpture'
  if (text.includes('design')) return 'Design'
  if (text.includes('contemporain') || text.includes('contemporary')) return 'Contemporary'
  if (text.includes('retrospective') || text.includes('rétrospective')) return 'Retrospective'
  if (text.includes('peinture') || text.includes('dessin') || text.includes('painting')) return 'Painting'
  return 'Mixed Media'
}

function formatDateRange(start?: string, end?: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return `From ${fmt(start)}`
  if (end) return `Until ${fmt(end)}`
  return 'Dates TBD'
}

function mapToExhibition(record: ParisRecord): Exhibition {
  const now = new Date()
  const startDate = record.date_start ? record.date_start.slice(0, 10) : ''
  const endDate = record.date_end ? record.date_end.slice(0, 10) : ''
  const status = record.date_start && new Date(record.date_start) > now ? 'Upcoming' : 'Ongoing'

  return {
    title: record.title ?? 'Untitled',
    museum: record.address_name ?? 'Paris',
    artist: null,
    dates: formatDateRange(record.date_start, record.date_end),
    startDate,
    endDate,
    status,
    description: record.lead_text ?? record.description ?? '',
    url: record.url ?? null,
    category: deriveCategory(record.qfap_tags, record.category),
  }
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      where: 'qfap_tags like "%Expo%"',
      limit: '50',
      order_by: 'date_start',
    })

    const res = await fetch(`${PARIS_API}?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Paris API returned ${res.status}`)
    }

    const data: ParisApiResponse = await res.json()
    const exhibitions = data.results.map(mapToExhibition)

    return NextResponse.json({ exhibitions, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch exhibitions' }, { status: 500 })
  }
}
