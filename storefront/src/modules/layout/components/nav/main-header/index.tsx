// src/modules/layout/components/nav/main-header/index.tsx
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { MagnifyingGlass, User, Phone } from "@medusajs/icons"

const MainHeader = () => {
    return (
        <div className="bg-white">
            <div className="content-container flex items-center justify-between py-4 h-[90px] gap-x-8">

                {/* Логотип - фіксуємо розмір */}
                <LocalizedClientLink href="/" className="flex-shrink-0 w-[150px]">
                    <img src="/logo.png" alt="Logo" className="h-auto w-full object-contain" />
                </LocalizedClientLink>

                {/* Пошук - Porto Style (центруємо і обмежуємо ширину) */}
                <div className="flex-grow max-w-[500px] relative hidden md:block">
                    <div className="flex items-center bg-white rounded-full px-5 py-2 border-[2px] border-[#e7e7e7] focus-within:border-[#0088cc] transition-all">
                        <input
                            type="text"
                            placeholder="Пошук..."
                            className="w-full bg-transparent outline-none text-[13px] text-gray-500 font-normal py-1"
                        />
                        <button className="ml-2 text-gray-800">
                            <MagnifyingGlass className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Права частина: Телефон + Іконки */}
                <div className="flex items-center gap-x-6 flex-shrink-0">
                    <div className="hidden lg:flex items-center gap-x-3 border-r pr-6 border-gray-200">
                        <Phone className="w-8 h-8 text-[#222529]" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Дзвоніть нам</span>
                            <span className="text-[16px] font-bold text-[#222529] whitespace-nowrap leading-tight">+123 4567 890</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-5">
                        <LocalizedClientLink href="/account" className="hover:text-[#0088cc]">
                            <User className="w-7 h-7" />
                        </LocalizedClientLink>
                        <CartButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader