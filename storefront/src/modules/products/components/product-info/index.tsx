import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type ProductInfoProps = {
    product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
    // Беремо SKU з першого варіанту товару
    const sku = product.variants?.[0]?.sku

    return (
        <div id="product-info" className="flex flex-col gap-y-4">
            {/* Назва товару - uppercase додаємо в className */}
            <Heading level="h2" className="text-3xl leading-10 text-ui-fg-base uppercase">
                {product.title}
            </Heading>

            <div className="flex flex-col gap-y-2 border-y border-ui-border-base py-4">
                {/* Артикул (SKU з Medusa) */}
                {sku && (
                    <Text className="text-medium text-ui-fg-subtle">
                        <span className="font-semibold text-ui-fg-base">Артикул:</span> {sku}
                    </Text>
                )}

                {/* Статус товару (Синхронізація з BAS) */}
                <div className="flex items-center gap-x-2">
                    <span
                        className={`h-3 w-3 rounded-full ${product.status === "published" ? "bg-green-500" : "bg-red-500"
                            }`}
                    ></span>
                    <Text className="text-medium text-ui-fg-subtle">
                        {product.status === "published"
                            ? "Активний (в наявності)"
                            : "Архівний (немає в наявності)"}
                    </Text>
                </div>
            </div>

            {/* Опис товару */}
            <Text className="text-medium text-ui-fg-subtle" style={{ whiteSpace: "pre-line" }}>
                {product.description}
            </Text>
        </div>
    )
}

export default ProductInfo