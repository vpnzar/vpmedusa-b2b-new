"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const staticNames: Record<string, string> = {
    catalog: "КАТАЛОГ",
    cart: "КОШИК",
    account: "ПРОФІЛЬ",
    categories: "КАТЕГОРІЇ",
}

const Breadcrumbs = () => {
    const pathname = usePathname()
    const [resolvedNames, setResolvedNames] = useState<Record<string, string>>({})

    // Використовуємо useMemo, щоб сегменти не перераховувалися постійно
    const segments = useMemo(() => {
        return pathname
            .split("/")
            .filter(s => s && !["uk", "en", "ua"].includes(s))
    }, [pathname])

    useEffect(() => {
        let isMounted = true; // Запобігає оновленню стану, якщо компонент розмонтовано

        const fetchNames = async () => {
            const unknownSegments = segments.filter(s => !staticNames[s] && !resolvedNames[s])

            for (const handle of unknownSegments) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
                    if (!backendUrl) continue

                    const response = await fetch(
                        `${backendUrl}/store/product-categories?handle=${handle}`,
                        {
                            headers: {
                                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                                "Content-Type": "application/json"
                            }
                        }
                    ).catch(() => null) // Перехоплюємо помилку мережі відразу

                    if (!response || !response.ok) continue

                    const data = await response.json().catch(() => null)
                    const category = data?.product_categories?.[0]

                    if (isMounted && category) {
                        setResolvedNames(prev => ({ ...prev, [handle]: category.name.toUpperCase() }))
                    }
                } catch (e) {
                    console.warn("Breadcrumbs skip:", handle)
                }
            }
        }

        fetchNames()
        return () => { isMounted = false }
    }, [segments])

    if (segments.length === 0) return null

    return (
        <div className="bg-[#f4f4f4] border-b border-gray-200">
            <div className="porto-container py-2.5 flex items-center gap-2 text-[11px] uppercase font-bold tracking-tight">
                <LocalizedClientLink href="/" className="text-[#999] hover:text-[#0155b5] transition-colors">
                    ГОЛОВНА
                </LocalizedClientLink>

                {segments.map((segment, index) => {
                    const path = segments.slice(0, index + 1).join("/")
                    const href = `/${path}`
                    const isLast = index === segments.length - 1
                    const displayName = resolvedNames[segment] || staticNames[segment] || segment.replace(/-/g, " ").toUpperCase()

                    return (
                        <div key={path} className="flex items-center gap-2">
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