// frontend/src/components/ui/combobox.tsx
'use client'

import React, { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ChevronsUpDown } from 'lucide-react'

export interface Option {
  id:   number
  name: string
}

interface UIComboboxProps {
  options:      Option[]
  /** valor seleccionado, o null si no hay nada */
  value:        Option | null
  /** callback al cambiar, recibe Option o null */
  onChange:     (opt: Option | null) => void
  placeholder?: string
  allowNew?:    boolean
}

export default function UICombobox({
  options,
  value,
  onChange,
  placeholder = '',
  allowNew    = true,
}: UIComboboxProps) {
  const [query, setQuery] = useState('')

  // Filtra por nombre
  const filtered = query === ''
    ? options
    : options.filter(o =>
        o.name.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <Combobox<Option>
      value={value ?? undefined}              // combobox espera Option|undefined
      onChange={opt => onChange(opt ?? null)} // convierte undefined→null
      nullable
    >
      <div className="relative">
        <Combobox.Input
          className="w-full rounded bg-zinc-800 py-2 pl-3 pr-10 text-white placeholder:text-zinc-400 outline-none"
          displayValue={(opt: Option) => opt?.name ?? ''}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown className="h-5 w-5 text-zinc-400" />
        </Combobox.Button>

        {(filtered.length > 0 || (allowNew && query)) && (
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-zinc-900 py-1 text-white shadow-lg ring-1 ring-black/20 z-10">

            {/* 1) “Crear nuevo” */}
            {allowNew && query && !options.some(o => o.name === query) && (
              <Combobox.Option
                key="__new__"
                value={{ id: -1, name: query }}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${active ? 'bg-zinc-700' : ''}`
                }
              >
                Crear “{query}”
              </Combobox.Option>
            )}

            {/* 2) Opciones existentes */}
            {filtered.map(opt => (
              <Combobox.Option
                key={opt.id}
                value={opt}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${active ? 'bg-zinc-700' : ''}`
                }
              >
                {({ selected }: { selected: boolean }) => (
                  <span className={selected ? 'font-semibold' : undefined}>
                    {opt.name}
                  </span>
                )}
              </Combobox.Option>
            ))}

            {/* 3) Sin coincidencias */}
            {filtered.length === 0 && !allowNew && (
              <div className="px-4 py-2 text-zinc-500">No hay coincidencias</div>
            )}

          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
