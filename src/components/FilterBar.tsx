'use client'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  museums: string[]
  activeMuseum: string
  activeStatus: string
  onMuseumChange: (m: string) => void
  onStatusChange: (s: string) => void
  count: number
  total: number
  onRefresh: () => void
  loading: boolean
  fetchedAt: string | null
  view: 'grid' | 'map'
  onViewChange: (v: 'grid' | 'map') => void
}

export default function FilterBar({
  museums, activeMuseum, activeStatus,
  onMuseumChange, onStatusChange,
  count, total, onRefresh, loading, fetchedAt,
  view, onViewChange,
}: FilterBarProps) {
  const timeStr = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className={styles.bar}>
      <div className={styles.top}>
        <div className={styles.leftGroup}>
          <div className={styles.statusPills}>
            {['All', 'Ongoing', 'Upcoming'].map(s => (
              <button
                key={s}
                className={`${styles.pill} ${activeStatus === s ? styles.pillActive : ''}`}
                onClick={() => onStatusChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightGroup}>
          {timeStr && <span className={styles.updated}>Updated {timeStr}</span>}

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => onViewChange('grid')}
              title="Grid view"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
            <button
              className={`${styles.viewBtn} ${view === 'map' ? styles.viewBtnActive : ''}`}
              onClick={() => onViewChange('map')}
              title="Map view"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1C5.015 1 3 3.015 3 5.5c0 3.5 4.5 8.5 4.5 8.5S12 9 12 5.5C12 3.015 9.985 1 7.5 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <circle cx="7.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
          </div>

          <button className={styles.refreshBtn} onClick={onRefresh} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={loading ? styles.spinning : ''}>
              <path d="M12.5 7A5.5 5.5 0 1 1 9.5 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9.5 1v2.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className={styles.museumScroll}>
        {['All', ...museums].map(m => (
          <button
            key={m}
            className={`${styles.museumBtn} ${activeMuseum === m ? styles.museumBtnActive : ''}`}
            onClick={() => onMuseumChange(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className={styles.countLine}>
        <span>{view === 'grid' ? `${count} of ${total} exhibitions` : `${total} exhibitions across ${museums.length} museums`}</span>
      </div>
    </div>
  )
}
