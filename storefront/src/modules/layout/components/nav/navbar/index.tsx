import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { BarsThree } from "@medusajs/icons"
import SearchSwitcher from "./search-switcher"

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-[100] w-full bg-[#0155b5] shadow-md border-b border-[#014a9c]">
            <div className="porto-container flex items-stretch justify-between h-[55px] p-0">

                {/* ЛІВА ЧАСТИНА */}
                <div className="flex items-stretch">

                    <LocalizedClientLink
                        href="/store"
                        className="group bg-[#014a9c] hover:bg-[#003e83] transition-colors flex items-center px-6 cursor-pointer min-w-[240px] h-full overflow-hidden no-underline"
                    >
                        <div className="flex items-center justify-center gap-3 w-full h-full">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 text-white group-hover:text-[#f9d759] transition-colors"
                            >
                                <path
                                    d="M3 6H21M3 12H21M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <span className="text-[14px] font-bold uppercase tracking-tight text-white group-hover:text-[#f9d759] transition-colors leading-none mt-[1px]">
                                Каталог товарів
                            </span>
                        </div>
                    </LocalizedClientLink>

                    {/* НАВІГАЦІЯ */}
                    <div className="hidden lg:flex items-center gap-8 ml-8">
                        <LocalizedClientLink
                            href="/"
                            className="text-white text-[13px] font-bold uppercase tracking-wider hover:text-[#f9d759] transition-colors"
                        >
                            Головна
                        </LocalizedClientLink>

                        {/* АКЦІЇ: Прибрав active-yellow, тепер колір змінюється лише при hover */}
                        <LocalizedClientLink
                            href="/sale"
                            className="text-white text-[13px] font-bold uppercase tracking-wider hover:text-[#f9d759] transition-colors"
                        >
                            Акції
                        </LocalizedClientLink>

                        <LocalizedClientLink
                            href="/about"
                            className="text-white text-[13px] font-bold uppercase tracking-wider hover:text-[#f9d759] transition-colors"
                        >
                            Про нас
                        </LocalizedClientLink>
                    </div>
                </div>

                {/* ПРАВА ЧАСТИНА */}
                <div className="flex items-center gap-4 pr-4 text-white">
                    <SearchSwitcher />
                    <CartButton />
                </div>
            </div>
        </nav>
    )
}

export default Navbar