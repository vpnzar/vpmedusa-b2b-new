"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  onlySort?: boolean
  isSidebar?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, onlySort, isSidebar }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  // 1. ВАРІАНТ ДЛЯ ВЕРХНЬОЇ ПАНЕЛІ (Тільки селект)
  if (onlySort) {
    return <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
  }

  // 2. ВАРІАНТ ДЛЯ САЙДБАРУ (Porto Style)
  return (
    <div className="porto-sidebar-box">
      {/* СЕРІЯ */}
      <div className="flex flex-col mb-6">
        <h3 className="porto-sidebar-title">Серія</h3>
        <ul className="flex flex-col gap-2">
          <li className="porto-filter-item font-bold text-[#0088cc]">Asfora</li>
          <li className="porto-filter-item">Sedna</li>
          <li className="porto-filter-item">Unica</li>
        </ul>
      </div>

      {/* КОЛІР */}
      <div className="flex flex-col mb-6">
        <h3 className="porto-sidebar-title">Колір</h3>
        <div className="flex flex-col gap-3">
          {['Білий', 'Алюміній', 'Антрацит', 'Сталь', 'Бронза', 'Кремовий'].map(color => (
            <label key={color} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 border-[#ccc] rounded-none accent-[#0088cc] cursor-pointer"
              />
              <span className="porto-filter-item">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ЗАХИСТ */}
      <div className="flex flex-col">
        <h3 className="porto-sidebar-title">Захист</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 border-[#ccc] rounded-none accent-[#0088cc]" />
            <span className="porto-filter-item">IP20</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 border-[#ccc] rounded-none accent-[#0088cc]" />
            <span className="porto-filter-item">IP44</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default RefinementList