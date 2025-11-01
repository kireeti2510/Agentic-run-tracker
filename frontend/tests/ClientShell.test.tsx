import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientShell from '../components/ClientShell'

describe('ClientShell', () => {
  it('renders sidebar content', () => {
    render(<ClientShell />)
    expect(screen.getByText(/Agentic/i)).toBeInTheDocument()
  })
})
