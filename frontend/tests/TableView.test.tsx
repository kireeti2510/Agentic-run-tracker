import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TableView from '../components/TableView'

describe('TableView', () => {
  const data = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
  it('renders columns and rows and responds to actions', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<TableView table="agent" data={data} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('agent')).toBeInTheDocument()
    // find Edit and Delete buttons
    const editBtns = screen.getAllByText('Edit')
    const delBtns = screen.getAllByText('Delete')
    expect(editBtns.length).toBe(2)
    fireEvent.click(editBtns[0])
    expect(onEdit).toHaveBeenCalled()
    fireEvent.click(delBtns[1])
    expect(onDelete).toHaveBeenCalled()
  })
})
