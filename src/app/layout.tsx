import './globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import React from 'react'

export const metadata: Metadata = {
  title: 'PhishAware',
  description: 'Learn about phishing and cybersecurity',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon128.png" />
        
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          href="/fonts/your-main-font.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
