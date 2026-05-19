export type ExhibitionStatus = 'Ongoing' | 'Upcoming'

export type ExhibitionCategory =
  | 'Painting'
  | 'Sculpture'
  | 'Photography'
  | 'Design'
  | 'Contemporary'
  | 'Retrospective'
  | 'Mixed Media'

export interface Exhibition {
  title: string
  museum: string
  artist: string | null
  dates: string
  startDate: string
  endDate: string
  status: ExhibitionStatus
  description: string
  url: string | null
  category: ExhibitionCategory
}

export interface MuseumLocation {
  name: string
  lat: number
  lng: number
  arrondissement: string
  address: string
}
