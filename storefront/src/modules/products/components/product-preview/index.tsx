import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreview({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const variant = product.variants?.[0]

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block bg-white border border-[#e7e7e7] hover:shadow-lg transition-all no-underline w-full max-w-[220px] mx-auto"
    >
      {/* КАРТИНКА - квадратна та компактна */}
      <div className="relative aspect-square overflow-hidden p-2 flex items-center justify-center bg-white">
        <Thumbnail
          thumbnail={product.thumbnail}
          size="full"
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Button */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform bg-[#222529] py-2 text-center z-10">
          <span className="text-white text-[10px] font-bold uppercase tracking-tight">
            Швидкий перегляд
          </span>
        </div>
      </div>

      {/* ІНФО - зменшені шрифти як у Porto */}
      <div className="p-3 pt-0 flex flex-col items-center text-center">
        <span className="text-[9px] text-gray-400 uppercase font-bold mb-1 tracking-tighter">
          {product.collection?.title || "Schneider Electric"}
        </span>

        <h3 className="text-[12px] font-bold text-[#222529] mb-2 line-clamp-2 h-[32px] overflow-hidden leading-tight">
          {product.title}
        </h3>

        <div className="text-[14px] font-bold text-[#0088cc]">
          {variant?.calculated_price && (
            <PreviewPrice price={variant.calculated_price as any} />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}