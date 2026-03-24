"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Оновлюємо мапу: тепер у нас CATALOG замість STORE
const staticNames: Record<string, string> = {
    catalog: "КАТАЛОГ",
    cart: "КОШИК",
    account: "ПРОФІЛЬ",
}

const Breadcrumbs = () => {
    const pathname = usePathname()
    const [resolvedNames, setResolvedNames] = useState<Record<string, string>>({})

    // Сегменти без мовних префіксів
    const segments = pathname
        .split("/")
        .filter(s => s && !["uk", "en", "ua"].includes(s))

    useEffect(() => {
        const fetchNames = async () => {
            // Шукаємо сегменти, назви яких ми ще не знаємо
            const unknownSegments = segments.filter(s => !staticNames[s] && !resolvedNames[s])

            for (const handle of unknownSegments) {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?handle=${handle}`,
                        {
                            headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
                        }
                    )
                    const data = await response.json()
                    // Medusa 2.0 повертає масив product_categories
                    const category = data.product_categories?.[0]
                    if (category) {
                        setResolvedNames(prev => ({ ...prev, [handle]: category.name.toUpperCase() }))
                    }
                } catch (e) {
                    console.error("Error fetching category name", e)
                }
            }
        }

        fetchNames()
    }, [pathname, segments.length]) // Додаємо залежність від довжини сегментів

    if (segments.length === 0) return null

    return (
        <div className="bg-[#f4f4f4] border-b border-gray-200">
            <div className="porto-container py-2.5 flex items-center gap-2 text-[11px] uppercase font-bold tracking-tight">
                <LocalizedClientLink href="/" className="text-[#999] hover:text-[#0155b5] transition-colors">
                    ГОЛОВНА
                </LocalizedClientLink>

                {segments.map((segment, index) => {
                    // ТУТ КЛЮЧОВА ЗМІНА: 
                    // Оскільки URL пласкі, посилання — це просто назва сегмента
                    const href = `/${segment}`

                    const isLast = index === segments.length - 1
                    const displayName = resolvedNames[segment] || staticNames[segment] || segment.replace(/-/g, " ").toUpperCase()

                    return (
                        <div key={segment} className="flex items-center gap-2">
                            <span className="text-[#ccc] font-normal">/</span>
                            {isLast ? (
                                <span className="text-[#222529]">{displayName}</span>
                            ) : (
                                <LocalizedClientLink href={href} className="text-[#999] hover:text-[#0155b5] transition-colors">
                                    {displayName}
                                </LocalizedClientLink>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Breadcrumbs