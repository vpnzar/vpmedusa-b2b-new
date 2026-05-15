"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function ViewModeControl({ currentView }: { currentView: "grid" | "list" | "price" }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const setView = (mode: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("view", mode)
        // Оновлюємо URL, scroll: false щоб сторінка не стрибала вгору
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const activeClass = "bg-ui-bg-subtle text-ui-fg-base border-ui-border-strong"
    const inactiveClass = "bg-transparent text-ui-fg-muted"

    return (
        <div className="flex items-center gap-x-2">
            {/* Grid */}
            <button
                onClick={() => setView('grid')}
                className={`p-2 border rounded transition-colors ${currentView === 'grid' ? activeClass : inactiveClass}`}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="6" height="6" strokeWidth="1.5" /><rect x="11" y="3" width="6" height="6" strokeWidth="1.5" /><rect x="3" y="11" width="6" height="6" strokeWidth="1.5" /><rect x="11" y="11" width="6" height="6" strokeWidth="1.5" />
                </svg>
            </button>

            {/* List */}
            <button
                onClick={() => setView('list')}
                className={`p-2 border rounded transition-colors ${currentView === 'list' ? activeClass : inactiveClass}`}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M8 5H17M8 10H17M8 15H17M3 5H4M3 10H4M3 15H4" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {/* Price */}
            <button
                onClick={() => setView('price')}
                className={`p-2 border rounded transition-colors ${currentView === 'price' ? activeClass : inactiveClass}`}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M3 6H17M3 10H17M3 14H17" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    )
}