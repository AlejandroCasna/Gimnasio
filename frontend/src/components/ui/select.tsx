// src/components/ui/select.tsx
'use client'

import React, { SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={
          `w-full px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition ` +
          className
        }
        {...props}
      />
    )
  }
)

Select.displayName = 'Select'
