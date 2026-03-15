import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TopBar from "./top-bar"
import MainNav from "@modules/layout/components/main-nav/MainNav" // Твій синій навігатор
import { MagnifyingGlass } from "@medusajs/icons"

export default async function Nav() {
    const regions = await listRegions()

    return (
        <div className="sticky top-0 inset-x-0 z-50 group">
            <header className="relative bg-white border-b border-ui-border-base">
                <TopBar />

                {/* Середня частина: Logo, Search, Contact, Cart */}
                <nav className="content-container flex items-center justify-between py-5 gap-x-8">
                    <div className="flex-1 basis-0">
                        <LocalizedClientLink
                            href="/"
                            className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase font-bold text-2xl"
                            data-testid="nav-store-link"
                        >
                            <span className="text-[#222529]">ELECTRO</span>
                            <span className="text-[#0088cc]">MARKET</span>
                        </LocalizedClientLink>
                    </div>

                    {/* Великий Пошук як у Porto */}
                    <div className="hidden lg:flex flex-1 max-w-[500px] w-full items-center border-2 border-[#0088cc] rounded-full px-4 py-1.5">
                        <input
                            type="text"
                            placeholder="Пошук товарів..."
                            className="w-full text-sm outline-none bg-transparent text-gray-700"
                        />
                        <MagnifyingGlass className="text-[#222529] w-5 h-5 cursor-pointer" />
                    </div>

                    <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                        <div className="hidden xl:flex flex-col text-right">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Питання?</span>
                            <a href="tel:+380991234567" className="text-sm font-bold text-[#222529]">099 123 45 67</a>
                        </div>

                        <Suspense fallback={<div className="w-6 h-6 bg-gray-100 animate-pulse rounded-full" />}>
                            <CartButton />
                        </Suspense>
                    </div>
                </nav>

                {/* Синя смужка MainNav */}
                <MainNav />
            </header>
        </div>
    )
}