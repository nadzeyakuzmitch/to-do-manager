import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'To Do Manager',
  description: 'Manage you task with ease',
}

/* This is the main page, general app configuration is here */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This script is necessary for FontAwesome Icons to work */}
        <script src="https://kit.fontawesome.com/f74168ccc8.js" aria-hidden crossOrigin="anonymous"></script>
        {children}
      </body>
    </html>
  )
}
