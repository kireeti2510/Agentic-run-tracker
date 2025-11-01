import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the API module used by the dashboard
vi.mock('../lib/api', () => ({
  listTables: async () => ['agent', 'project', 'user'],
}))

import DashboardContent from '../app/_dashboard/DashboardContent'

describe('DashboardContent', () => {
  it('renders dashboard header and table list', async () => {
    const qc = new QueryClient()
    render(
      <QueryClientProvider client={qc}>
        <DashboardContent />
      </QueryClientProvider>
    )
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    // waits for the mocked data to appear
    await waitFor(() => {
      expect(screen.getByText(/Tables/i)).toBeInTheDocument()
      expect(screen.getByText(/agent/)).toBeInTheDocument()
    })
  })
})
