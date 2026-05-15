import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

// src/modules/products/components/product-preview/price.tsx

export default function PreviewPrice({ price }: { price: any }) {
  if (!price) return null

  return (
    <div className="flex flex-col text-ui-fg-muted">
      {price.price_type === "sale" && (
        <Text className="line-through text-ui-fg-muted">
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
      >
        {/* ВАЖЛИВО: Використовуй .calculated_price, це готовий рядок "100.00 грн" */}
        {typeof price.calculated_price === 'string'
          ? price.calculated_price
          : price.calculated_amount}
      </Text>
    </div>
  )
}