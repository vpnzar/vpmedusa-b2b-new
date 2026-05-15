import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "@modules/products/components/product-price"

export default function ProductPreview({
  product,
  region,
  viewMode = "grid",
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  viewMode?: "grid" | "list" | "price"
}) {
  // 1. SKU та ціна (Metadata)
  const sku = product.variants?.[0]?.sku || product.handle?.split('-').pop()?.toUpperCase()
  const metadataPrice = product.metadata?.ціна ? `${String(product.metadata.ціна)} грн` : null

  // --- РЕЖИМ ПРАЙСУ ---
  if (viewMode === "price") {
    const cleanName = (product.metadata?.назва as string) || product.title
    return (
      <LocalizedClientLink href={`/products/${product.handle}`} className="w-full">
        <div className="flex items-center justify-between py-1.5 border-b border-ui-border-base hover:bg-blue-50/40 px-4 transition-colors gap-x-4 min-h-[42px]">
          <div className="w-32 shrink-0">
            <span className="text-[11px] font-mono text-ui-fg-muted uppercase tracking-tighter">{sku}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[12px] font-medium text-ui-fg-base uppercase truncate block font-sans">
              {String(cleanName)}
            </span>
          </div>
          <div className="text-right shrink-0 min-w-[90px]">
            <span className="text-[13px] font-bold text-blue-700 font-sans">
              {metadataPrice || "—"}
            </span>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  // --- РЕЖИМ СПИСКУ (Рядки з фото) ---
  if (viewMode === "list") {
    return (
      <LocalizedClientLink href={`/products/${product.handle}`} className="group w-full block">
        <div className="flex gap-4 items-center border-b border-ui-border-base pb-4 hover:bg-gray-50 transition-colors">
          <div className="w-24 h-24 flex-shrink-0 bg-ui-bg-subtle rounded-md overflow-hidden relative">
            <Thumbnail thumbnail={product.thumbnail} size="square" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-ui-fg-muted uppercase font-bold tracking-widest">{sku}</span>
            <h3 className="text-sm font-bold text-ui-fg-base group-hover:text-blue-600 uppercase line-clamp-2 font-sans">
              {product.title}
            </h3>
            <div className="mt-2 text-blue-700 font-bold text-sm">
              {metadataPrice || (product.variants?.[0] && <PreviewPrice product={product} variant={product.variants[0]} />)}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  // --- СТАНДАРТНИЙ РЕЖИМ (GRID) ---
  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block w-full">
      <div className="flex flex-col border border-transparent group-hover:border-ui-border-base rounded-lg p-2 transition-all h-full bg-white">

        {/* КЛЮЧОВИЙ ФІКС: aspect-square обмежує розмір фото */}
        <div className="relative w-full aspect-square bg-ui-bg-subtle rounded-md overflow-hidden mb-3">
          <Thumbnail thumbnail={product.thumbnail} size="square" />
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-y-1">
            <span className="text-[10px] text-ui-fg-muted uppercase font-mono tracking-tight">{sku}</span>
            <span className="text-sm font-semibold text-ui-fg-base uppercase line-clamp-2 font-sans min-h-[40px]">
              {product.title}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-ui-border-base pt-2">
            <span className="text-[10px] text-ui-fg-muted uppercase font-bold font-sans">Ціна</span>
            <div className="text-sm font-bold text-blue-700 font-sans">
              {metadataPrice || (product.variants?.[0] && <PreviewPrice product={product} variant={product.variants[0]} />)}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}