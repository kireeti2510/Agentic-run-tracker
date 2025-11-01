"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTable } from '../../../hooks/useTable'
import TableView from '../../../components/TableView'
import RecordModal from '../../../components/RecordModal'
import ConfirmDialog from '../../../components/ConfirmDialog'
import Topbar from '../../../components/Topbar'
import { Toaster, toast } from 'sonner'

const queryClient = new QueryClient()

function TablePageContent({ params }: any) {
  const table = params.table
  const [page, setPage] = useState(1)
  const { query, create, update, remove } = useTable(table, page, 20)
  const [selected, setSelected] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function onEdit(row: any) {
    setSelected(row)
    setOpen(true)
  }

  function onDelete(row: any) {
    setSelected(row)
    setConfirmOpen(true)
  }

  async function handleSave(form: any) {
    try {
      if (form && selected) {
        const id = Object.values(selected)[0]
        await update.mutateAsync({ id: String(id), payload: form })
        toast.success('Updated')
      } else {
        await create.mutateAsync(form)
        toast.success('Created')
      }
      setOpen(false)
    } catch (e) { toast.error('Save failed') }
  }

  async function handleConfirmDelete() {
    try {
      const id = Object.values(selected)[0]
      await remove.mutateAsync(String(id))
      toast.success('Deleted')
      setConfirmOpen(false)
    } catch (e) { toast.error('Delete failed') }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <Topbar />
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold capitalize">{table}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {query.data?.data?.length || 0} records
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => { setSelected({}); setOpen(true) }} 
            className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            + New Record
          </button>
        </div>
      </div>
      {query.isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <TableView table={table} data={query.data?.data ?? []} onEdit={onEdit} onDelete={onDelete} />
          
          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Page {page}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!query.data?.data || query.data.data.length < 20}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
      <RecordModal open={open} onClose={() => setOpen(false)} onSave={handleSave} initial={selected} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Confirm delete" body="This action cannot be undone." />
    </div>
  )
}

export default function TablePage({ params }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <TablePageContent params={params} />
    </QueryClientProvider>
  )
}
