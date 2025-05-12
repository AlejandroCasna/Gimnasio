'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Context para compartir la pestaña activa
interface TabsContext {
  value: string
  setValue: (v: string) => void
}
const _TabsContext = createContext<TabsContext | undefined>(undefined)

export function Tabs(props: { defaultValue: string; children: ReactNode }) {
  const { defaultValue, children } = props
  const [value, setValue] = useState(defaultValue)
  return (
    <_TabsContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </_TabsContext.Provider>
  )
}

export function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex space-x-4 border-b border-zinc-700 mb-4">{children}</div>
}

export function TabsTrigger(props: { value: string; children: ReactNode }) {
  const { value: contextValue, setValue } = useContext(_TabsContext)!
  const isActive = contextValue === props.value
  return (
    <button
      onClick={() => setValue(props.value)}
      className={`px-3 py-1 font-medium ${
        isActive ? 'text-white border-b-2 border-red-600' : 'text-zinc-400'
      }`}
    >
      {props.children}
    </button>
  )
}

export function TabsContent(props: { value: string; children: ReactNode }) {
  const { value: contextValue } = useContext(_TabsContext)!
  return contextValue === props.value ? <div>{props.children}</div> : null
}
