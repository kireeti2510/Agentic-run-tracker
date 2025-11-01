import { vi, describe, it, expect, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('api wrapper', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
  })

  it('listTables calls GET /api/meta/tables and returns array', async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: { tables: ['a', 'b'] } })
    ;(axios as any).create = vi.fn().mockReturnValue({ get: mockGet })
    const { listTables } = await import('../lib/api')
    const res = await listTables()
    expect(res).toEqual(['a', 'b'])
  })

  it('fetchTable returns data and meta', async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: { data: [{ id: 1 }], meta: { total: 1 } } })
    ;(axios as any).create = vi.fn().mockReturnValue({ get: mockGet })
    const { fetchTable } = await import('../lib/api')
    const res = await fetchTable('agent')
    expect(res.data).toHaveLength(1)
    expect(res.meta.total).toBe(1)
  })

  it('createRow posts payload', async () => {
    const payload = { Name: 'x' }
    const mockPost = vi.fn().mockResolvedValue({ data: { ok: true, data: { id: 5 } } })
    ;(axios as any).create = vi.fn().mockReturnValue({ post: mockPost })
    const { createRow } = await import('../lib/api')
    const res = await createRow('agent', payload)
    expect(res.ok).toBe(true)
    expect(mockPost.mock.calls[0][0]).toMatch(/\/api\/agent$/)
  })
})
