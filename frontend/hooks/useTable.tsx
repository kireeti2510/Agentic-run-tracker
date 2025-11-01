import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTable, createRow, updateRow, deleteRow } from '../lib/api'

export function useTable(table: string, page = 1, limit = 20) {
  const qc = useQueryClient()
  const qKey = [table, page, limit]

  // Use explicit generics to satisfy TypeScript and v5 signature
  const query = useQuery<any, Error, any, (string | number)[]>({ queryKey: qKey, queryFn: () => fetchTable(table, page, limit), keepPreviousData: true } as any)

  const create = useMutation({ mutationFn: (payload: any) => createRow(table, payload), onSuccess: () => qc.invalidateQueries({ queryKey: [table] }) })

  const update = useMutation({ mutationFn: ({ id, payload }: any) => updateRow(table, id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: [table] }) })

  const remove = useMutation({ mutationFn: (id: string) => deleteRow(table, id), onSuccess: () => qc.invalidateQueries({ queryKey: [table] }) })

  return { query, create, update, remove }
}
