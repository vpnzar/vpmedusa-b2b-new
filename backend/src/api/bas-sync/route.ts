import { 
  MedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { 
  IProductModuleService, 
  IPricingModuleService
} from "@medusajs/framework/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// --- 1. МЕТОД GET (Для перевірки через Postman/Браузер) ---
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const sku = req.query.sku as string

  if (!sku) return res.status(400).json({ message: "SKU is required" })

  try {
    const { data: variants } = await query.graph({
      entity: "variant",
      fields: ["sku", "product.title", "product.status", "price_set.prices.amount"],
      filters: { sku: [sku] },
    })
    return res.json({ success: true, variant: variants[0] || "Not found" })
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

// --- 2. МЕТОД POST (Для 1С / BAS) ---
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  return await syncLogic(req, res)
}

// --- 3. МЕТОД PUT (Для оновлення / REST стандартів) ---
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  return await syncLogic(req, res)
}

// --- СПІЛЬНА ЛОГІКА ДЛЯ POST ТА PUT ---
async function syncLogic(req: MedusaRequest, res: MedusaResponse) {
  const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  const pricingModuleService: IPricingModuleService = req.scope.resolve(Modules.PRICING)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  const authHeader = req.headers["x-bas-auth"]
  if (authHeader !== "SuperSecretBAS2024") {
    return res.status(401).json({ message: "Unauthorized BAS" })
  }

  const { sku, price, is_active, name } = req.body as any

  try {
    let variants = await productModuleService.listProductVariants(
      { sku: [sku] },
      { relations: ["product"] }
    )

    let variant = variants[0]

    // Створення або оновлення продукту
    if (!variant) {
      const productTitle = name || `Товар ${sku}`;
      const productHandle = sku.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 1000);

      await productModuleService.createProducts([
        {
          title: productTitle,
          handle: productHandle,
          status: is_active ? ("published" as any) : ("draft" as any),
          options: [{ title: "Default", values: ["Default"] }],
          variants: [{
            title: "Default Variant",
            sku: sku,
            options: { "Default": "Default" }
          }]
        }
      ])
      
      const newVariants = await productModuleService.listProductVariants(
        { sku: [sku] },
        { relations: ["product"] }
      )
      variant = newVariants[0]
    } else {
      await productModuleService.updateProducts(
        { id: variant.product.id },
        { 
          status: is_active ? ("published" as any) : ("draft" as any),
          title: name || variant.product.title
        }
      )
    }

    // Робота з цінами
    if (price !== undefined && variant) {
      const { data: result } = await query.graph({
        entity: "variant",
        fields: ["price_set.id"],
        filters: { id: variant.id },
      })

      let priceSetId = result[0]?.price_set?.id

      if (!priceSetId) {
        const priceSet = await pricingModuleService.createPriceSets({
          prices: [{ amount: price, currency_code: "uah", rules: {} }]
        })
        priceSetId = priceSet.id

        await link.create({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.PRICING]: { price_set_id: priceSetId }
        })
      } else {
        await pricingModuleService.updatePriceSets(priceSetId, {
          prices: [{ amount: price, currency_code: "uah" }]
        })
      }
    }

    return res.json({ success: true, sku, price })
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message })
  }
}