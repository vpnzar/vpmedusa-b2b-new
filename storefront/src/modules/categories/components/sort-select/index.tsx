"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function SortSelect({ sortBy }: { sortBy: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams)
        params.set("sortBy", e.target.value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center gap-x-2">
            <span className="text-[10px] uppercase text-ui-fg-muted font-bold whitespace-nowrap">Сортувати:</span>
            <select
                value={sortBy}
                onChange={handleChange}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer py-0 pr-8 outline-none"
            >
                <option value="created_at">Новинки</option>
                <option value="price_asc">Найдешевші</option>
                <option value="price_desc">Найдорожчі</option>
            </select>
        </div>
    )
}