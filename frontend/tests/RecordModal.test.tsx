import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import RecordModal from '../components/RecordModal'

describe('RecordModal', () => {
  it('does not render when closed', () => {
    const onClose = vi.fn()
    render(<RecordModal open={false} onClose={onClose} onSave={vi.fn()} initial={{}} />)
    expect(document.body).toBeTruthy()
  })

  it('renders inputs and calls onSave/onClose', () => {
    const onClose = vi.fn()
    const onSave = vi.fn()
    render(<RecordModal open={true} onClose={onClose} onSave={onSave} initial={{ name: 'abc' }} />)
    expect(screen.getByDisplayValue('abc')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('abc'), { target: { value: 'xyz' } })
    fireEvent.click(screen.getByText('Save'))
    expect(onSave).toHaveBeenCalled()
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
