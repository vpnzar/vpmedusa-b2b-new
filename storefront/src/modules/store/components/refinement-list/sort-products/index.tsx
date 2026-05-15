"use client"

import { ChangeEvent } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions = [
  { value: "created_at", label: "Останні надходження" },
  { value: "price_asc", label: "Ціна: Низька -> Висока" },
  { value: "price_desc", label: "Ціна: Висока -> Низька" },
]

const SortProducts = ({
  sortBy,
  setQueryParams,
  "data-testid": dataTestId,
}: SortProductsProps) => {

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQueryParams("sortBy", e.target.value)
  }

  return (
    <div className="flex items-center gap-2" data-testid={dataTestId}>
      <select
        value={sortBy}
        onChange={handleChange}
        className="porto-select-custom w-full cursor-pointer appearance-none bg-no-repeat"
        style={{
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.2em'
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortProducts