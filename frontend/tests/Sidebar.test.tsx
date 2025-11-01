import React from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from '../components/Sidebar'

describe('Sidebar', () => {
  it('renders nav items', () => {
    render(<Sidebar />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Tables/i)).toBeInTheDocument()
  })
})
