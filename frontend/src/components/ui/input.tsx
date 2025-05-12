// src/components/ui/input.tsx
'use client'

import React, { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={
          `w-full px-3 py-2 rounded bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition ` +
          className
        }
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
