import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock framer-motion to render simple DOM elements in tests
vi.mock('framer-motion', () => {
	const React = require('react')
	return {
		motion: new Proxy({}, {
			get(_, prop) {
				// Return a simple functional component that renders the corresponding HTML tag
				return (props: any) => {
					const Tag = String(prop)
					return React.createElement(Tag, props, props.children)
				}
			}
		})
	}
})

// Mock sonner Toaster to avoid DOM complexities
vi.mock('sonner', () => ({ Toaster: () => null }))
