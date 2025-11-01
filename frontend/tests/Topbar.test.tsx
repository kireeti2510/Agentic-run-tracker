import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Topbar from '../components/Topbar'

describe('Topbar', () => {
  it('renders title and triggers toggle', () => {
    const onToggle = vi.fn()
    render(<Topbar onToggleDark={onToggle} />)
    expect(screen.getByText(/Agentic Run Tracker/i)).toBeInTheDocument()
    const btn = screen.getByLabelText(/Toggle dark mode/i)
    fireEvent.click(btn)
    expect(onToggle).toHaveBeenCalled()
  })
})
