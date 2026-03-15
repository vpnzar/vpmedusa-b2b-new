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
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div className="bg-white border border-[#e7e7e7] p-4 transition-all hover:shadow-2xl relative overflow-hidden">
        <div className="relative aspect-square mb-4">
          <Thumbnail thumbnail={product.thumbnail} size="full" />

          {/* Hover Button */}
          <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform bg-[#222529] py-3 text-center">
            <span className="text-white text-[11px] font-bold uppercase tracking-widest">
              Додати в кошик
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] text-gray-400 uppercase font-bold mb-1">
            {product.collection?.title || "Schneider Electric"}
          </span>
          <h3 className="text-[14px] font-semibold text-[#222529] mb-2 line-clamp-2">
            {product.title}
          </h3>
          {variant?.calculated_price && (
            <PreviewPrice price={variant.calculated_price as any} />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}