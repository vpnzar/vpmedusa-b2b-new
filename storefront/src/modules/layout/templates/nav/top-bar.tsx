import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TopBar = () => {
  return (
    <div className="w-full bg-[#f4f4f4] border-b border-gray-200 py-2 text-[11px] font-semibold text-[#777] uppercase tracking-wider">
      <div className="content-container flex justify-between items-center">
        <div className="flex gap-x-4">
          <span>Безкоштовна доставка від 2000 грн</span>
        </div>
        <div className="flex gap-x-5 items-center">
          <LocalizedClientLink href="/about" className="hover:text-[#0088cc]">
            Про нас
          </LocalizedClientLink>
          <LocalizedClientLink href="/contact" className="hover:text-[#0088cc]">
            Контакти
          </LocalizedClientLink>
          <div className="border-l border-gray-300 h-3 mx-1"></div>
          <span className="cursor-pointer">UA / UAH</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar