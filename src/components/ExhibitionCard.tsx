import { Exhibition } from '@/lib/types'
import styles from './ExhibitionCard.module.css'

const CATEGORY_COLORS: Record<string, string> = {
  Painting: '#4A6741',
  Sculpture: '#5C4A8C',
  Photography: '#2A5C7A',
  Design: '#7A4A2A',
  Contemporary: '#1A1612',
  Retrospective: '#6B4A1A',
  'Mixed Media': '#2A5C4A',
}

interface Props { exhibition: Exhibition }

export default function ExhibitionCard({ exhibition }: Props) {
  const categoryColor = CATEGORY_COLORS[exhibition.category] || '#1A1612'

  const card = (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.category} style={{ color: categoryColor, borderColor: `${categoryColor}30` }}>
          {exhibition.category}
        </span>
        <span className={`${styles.status} ${exhibition.status === 'Ongoing' ? styles.ongoing : styles.upcoming}`}>
          {exhibition.status === 'Ongoing' ? '● Ongoing' : '◌ Upcoming'}
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{exhibition.title}</h2>
        {exhibition.artist && (
          <p className={styles.artist}>{exhibition.artist}</p>
        )}
        <p className={styles.description}>{exhibition.description}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.museum}>{exhibition.museum}</span>
          <span className={styles.dates}>{exhibition.dates}</span>
        </div>
        {exhibition.url && (
          <span className={styles.arrow}>→</span>
        )}
      </div>
    </article>
  )

  if (exhibition.url) {
    return (
      <a href={exhibition.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {card}
      </a>
    )
  }
  return card
}
