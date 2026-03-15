"use client"

import { useState, useEffect } from "react"
import { searchClient } from "../../../../lib/search-client" // створимо цей файл нижче
import { MagnifyingGlass } from "@medusajs/icons"

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])

    useEffect(() => {
        const search = async () => {
            if (query.length > 2) {
                try {
                    // Додаємо тип : any для res
                    const res: any = await searchClient.index("products").search(query)
                    setResults(res.hits)
                } catch (err) {
                    console.error("Search error:", err)
                }
            } else {
                setResults([])
            }
        }

        search()
    }, [query])

    return (
        <div className="content-container py-12">
            <div className="relative w-full max-w-lg mx-auto mb-8">
                <MagnifyingGlass className="absolute left-3 top-3 text-ui-fg-muted" />
                <input
                    type="search"
                    placeholder="Пошук кабелю, автомата..."
                    className="w-full pl-10 pr-4 py-2 border rounded-rounded outline-none focus:border-ui-fg-base"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
                {results.map((product: any) => (
                    <div key={product.id} className="border p-4 rounded-rounded">
                        <h3 className="txt-compact-medium-plus">{product.title}</h3>
                        <p className="txt-small-regular text-ui-fg-subtle">{product.description}</p>
                        {/* Тут додамо ціну та кнопку пізніше */}
                    </div>
                ))}
            </div>
        </div>
    )
}