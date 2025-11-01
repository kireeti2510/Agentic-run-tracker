"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
const MotionDiv: any = (motion as any).div

export default function RecordModal({ open, onClose, onSave, initial }: any) {
  const [form, setForm] = useState<any>({})
  useEffect(() => { setForm(initial || {}) }, [initial])

  function handleChange(k: string, v: any) {
    setForm((s: any) => ({ ...s, [k]: v }))
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <MotionDiv 
        layout 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative z-10 w-full max-w-2xl bg-white rounded-lg p-4 md:p-6 shadow-lg my-8"
      >
        <h3 className="text-lg md:text-xl font-medium mb-4">Edit Record</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
          {Object.keys(form).slice(0, 20).map((k) => (
            <div key={k} className="flex flex-col">
              <label className="text-xs md:text-sm text-gray-600 mb-1 font-medium">{k}</label>
              <input 
                value={form[k] ?? ''} 
                onChange={(e) => handleChange(k, e.target.value)} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(form)} 
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </MotionDiv>
    </div>
  )
}
