import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ConfirmDialog from '../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('does not render when closed', () => {
    render(<ConfirmDialog open={false} onClose={vi.fn()} onConfirm={vi.fn()} title="t" body="b" />)
    expect(document.body).toBeTruthy()
  })

  it('renders and calls handlers', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()
    render(<ConfirmDialog open={true} onClose={onClose} onConfirm={onConfirm} title="t" body="b" />)
    expect(screen.getByText('t')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalled()
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
