'use client'
import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Exhibition } from '@/lib/types'
import ExhibitionCard from './ExhibitionCard'
import FilterBar from './FilterBar'
import styles from './ExhibitionsGrid.module.css'

// Lazy-load the map (Leaflet is client-only and large)
const MapView = lazy(() => import('./MapView'))

export default function ExhibitionsGrid() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)
  const [activeMuseum, setActiveMuseum] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [view, setView] = useState<'grid' | 'map'>('grid')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/exhibitions')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch')
      setExhibitions(data.exhibitions)
      setFetchedAt(data.fetchedAt)
      setActiveMuseum('All')
      setActiveStatus('All')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const museums = useMemo(() => [...new Set(exhibitions.map(e => e.museum))].sort(), [exhibitions])

  const filtered = useMemo(() => exhibitions.filter(e => {
    if (activeMuseum !== 'All' && e.museum !== activeMuseum) return false
    if (activeStatus !== 'All' && e.status !== activeStatus) return false
    return true
  }), [exhibitions, activeMuseum, activeStatus])

  // When user clicks "filter to this museum" from map popup, switch to grid view
  const handleMuseumSelectFromMap = (museum: string) => {
    setActiveMuseum(museum)
    setView('grid')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingInner}>
          <div className={styles.spinner} />
          <p>Consulting the museums of Paris…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorTitle}>Could not load exhibitions</p>
        <p className={styles.errorMsg}>{error}</p>
        <button className={styles.retryBtn} onClick={fetchData}>Try again</button>
      </div>
    )
  }

  return (
    <>
      <FilterBar
        museums={museums}
        activeMuseum={activeMuseum}
        activeStatus={activeStatus}
        onMuseumChange={setActiveMuseum}
        onStatusChange={setActiveStatus}
        count={filtered.length}
        total={exhibitions.length}
        onRefresh={fetchData}
        loading={loading}
        fetchedAt={fetchedAt}
        view={view}
        onViewChange={setView}
      />

      {view === 'map' ? (
        <div className={styles.mapWrapper}>
          <Suspense fallback={
            <div className={styles.mapPlaceholder}>
              <div className={styles.spinner} />
              <p>Loading map…</p>
            </div>
          }>
            <MapView
              exhibitions={exhibitions}
              activeMuseum={activeMuseum}
              onMuseumSelect={handleMuseumSelectFromMap}
            />
          </Suspense>
          <p className={styles.mapHint}>
            Click a pin to see exhibitions · Numbers show exhibition count · Use "Filter to this museum →" to switch to grid view
          </p>
        </div>
      ) : (
        <main className={styles.grid}>
          {filtered.length === 0 ? (
            <p className={styles.empty}>No exhibitions match your filters.</p>
          ) : (
            filtered.map((ex, i) => <ExhibitionCard key={i} exhibition={ex} />)
          )}
        </main>
      )}
    </>
  )
}
