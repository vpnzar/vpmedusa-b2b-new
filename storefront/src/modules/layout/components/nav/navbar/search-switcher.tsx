"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlass } from "@medusajs/icons"

export default function SearchSwitcher() {
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 150)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (!isSticky) return null

    return (
        <div className="flex items-center animate-in fade-in duration-200">
            <form
                action="/search"
                method="GET"
                className="flex items-center bg-white rounded-full px-4 py-1.5 border-none shadow-inner transition-all"
            >
                <input
                    type="text"
                    name="q"
                    placeholder="Пошук..."
                    className="bg-transparent border-none text-[12px] text-gray-800 focus:ring-0 w-[150px] lg:w-[200px] p-0 outline-none"
                />
                <button type="submit" className="ml-2 text-[#222529] hover:text-[#0155b5]">
                    <MagnifyingGlass className="w-4 h-4" />
                </button>
            </form>
            <div className="ml-4 w-[1px] h-4 bg-white/20 hidden md:block"></div>
        </div>
    )
}