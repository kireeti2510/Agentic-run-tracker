import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock API to return tables
vi.mock('../lib/api', () => ({ listTables: async () => ['agent', 'project'] }))

import DashboardClient from '../components/DashboardClient'

describe('DashboardClient', () => {
  it('renders dashboard content via client provider', async () => {
    render(<DashboardClient />)
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument()
  })
})
