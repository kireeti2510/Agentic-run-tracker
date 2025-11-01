import './globals.css'
import React from 'react'
import ClientShell from '../components/ClientShell'

export const metadata = {
  title: 'Agentic Run Tracker',
  description: 'Dashboard to browse and manage runs, agents, projects and datasets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex flex-col md:flex-row">
          <ClientShell />
          <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  )
}
