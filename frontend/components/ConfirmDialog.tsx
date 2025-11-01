"use client"
import React from 'react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, body }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-50 bg-white rounded-lg p-4 md:p-6 shadow-xl max-w-md w-full">
        <h3 className="font-medium text-lg md:text-xl mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-6">{body}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
