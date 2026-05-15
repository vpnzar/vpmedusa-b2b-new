'use client'

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TopBar = () => (
    <div className="w-full bg-[#f4f4f4] border-b border-gray-200 py-2 hidden md:block">
        <div className="content-container flex justify-between items-center text-[11px] font-semibold text-gray-500 uppercase tracking-tight">
            <div>БЕЗКОШТОВНА ДОСТАВКА ВІД 2000 ГРН</div>
            <div className="flex items-center gap-x-6">
                <nav className="flex items-center gap-x-4">
                    <LocalizedClientLink href="/about-us" className="hover:text-[#0088cc]">ПРО НАС</LocalizedClientLink>
                    <LocalizedClientLink href="/contact" className="hover:text-[#0088cc]">КОНТАКТИ</LocalizedClientLink>
                </nav>
                <div className="flex items-center gap-x-4 border-l pl-4 border-gray-300">
                    <span className="cursor-pointer hover:text-[#0088cc]">UA / UAH</span>
                </div>
            </div>
        </div>
    </div>
)

export default TopBar