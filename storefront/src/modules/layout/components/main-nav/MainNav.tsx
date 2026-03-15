import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TopBar from "./top-bar"
import MainNav from "@modules/layout/components/main-nav/MainNav"
import { MagnifyingGlass } from "@medusajs/icons"

export default async function Nav() {
    const regions = await listRegions()

    return (
        <div className="sticky top-0 inset-x-0 z-50 group">
            <header className="relative bg-white">
                {/* 1. Верхня тонка панель (вже працює) */}
                <TopBar />

                {/* 2. Середня частина (Logo, Search, Cart) */}
                <div className="content-container flex items-center justify-between py-5 flex-wrap md:flex-nowrap gap-y-4">

                    {/* Логотип */}
                    <div className="flex-1 basis-0">
                        <LocalizedClientLink
                            href="/"
                            className="text-2xl font-black uppercase tracking-tighter"
                        >
                            <span className="text-[#222529]">ELECTRO</span>
                            <span className="text-[#0088cc]">MARKET</span>
                        </LocalizedClientLink>
                    </div>

                    {/* Пошук у стилі Porto (з синьою рамкою) */}
                    <div className="order-last md:order-none w-full md:flex-1 md:max-w-[500px] flex items-center border-2 border-[#0088cc] rounded-full px-4 py-2">
                        <input
                            type="text"
                            placeholder="Пошук товарів Schneider, Hager..."
                            className="w-full text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                        />
                        <button title="Search">
                            <MagnifyingGlass className="text-[#222529] w-5 h-5 hover:text-[#0088cc] transition-colors" />
                        </button>
                    </div>

                    {/* Права частина: Телефон + Кошик */}
                    <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                        <div className="hidden xl:flex flex-col text-right leading-tight">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Консультація</span>
                            <a href="tel:+380991234567" className="text-sm font-extrabold text-[#222529] hover:text-[#0088cc]">
                                (099) 123-45-67
                            </a>
                        </div>

                        <Suspense fallback={<div className="w-6 h-6 bg-gray-100 animate-pulse rounded-full" />}>
                            <CartButton />
                        </Suspense>
                    </div>
                </div>

                {/* 3. Нижня синя смужка (MainNav) */}
                <MainNav />
            </header>
        </div>
    )
}