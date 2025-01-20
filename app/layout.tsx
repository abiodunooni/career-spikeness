import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nebula Load Balance Demo',
  description: 'How to create a load balance on Nebula',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
