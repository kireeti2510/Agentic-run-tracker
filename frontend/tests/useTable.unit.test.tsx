import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../lib/api', () => ({
  fetchTable: async () => ({ data: [{ id: 1 }], meta: { total: 1 } }),
  createRow: async () => ({ ok: true }),
  updateRow: async () => ({ ok: true }),
  deleteRow: async () => ({ ok: true }),
}))

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { useTable } from '../hooks/useTable'
import * as api from '../lib/api'

describe('useTable hook', () => {
  let qc: QueryClient
  beforeEach(() => {
    vi.resetAllMocks()
    qc = new QueryClient()
  })

  function Wrapper({ children }: any) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }

  it('fetches table data via test component', async () => {
    function TestComp() {
      const { query } = useTable('agent')
      if (query.isLoading) return <div>loading</div>
      return <div data-testid="count">{query.data.data.length}</div>
    }
    render(<Wrapper><TestComp/></Wrapper>)
    const el = await screen.findByTestId('count')
    expect(el.textContent).toBe('1')
  })
})
