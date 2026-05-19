import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paris Exhibitions',
  description: "Current & upcoming exhibitions across Paris's top museums and galleries",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
