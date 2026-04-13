import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productModule = req.scope.resolve(Modules.PRODUCT)
  const pricingModule = req.scope.resolve(Modules.PRICING)
  const inventoryModule = req.scope.resolve(Modules.INVENTORY)
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
   


  const LOCATION_ID = "sloc_01KN4THBKRNS690G51B42MAJXT"
  const SALES_CHANNEL_ID = "sc_01KMG3G9698BJH7W5ESGHPEKCM" // Твій RRC_UA
  
  const items = Array.isArray(req.body) ? req.body : [req.body]

  const report = {
    total: items.length,
    success: 0,
    failed: 0,
    details: [] as any[]
  }

  const skus = items.map(i => String(i.sku || "").trim()).filter(Boolean)
  const variants = await productModule.listProductVariants(
    { sku: skus },
    { relations: ["product"] }
  )
  const variantMap = new Map()
  variants.forEach(v => variantMap.set(v.sku, v))

  const categoryCache = new Map<string, string>()

  async function ensureCategoryTree(path: string): Promise<string | null> {
    if (!path) return null
    if (categoryCache.has(path)) return categoryCache.get(path)!

    const parts = path.split("/")
    let parent_id: string | null = null
    let lastId: string | null = null

    for (const partRaw of parts) {
      const part = partRaw.trim()
      if (!part) continue

      // Додали : string
      const key: string = `${parent_id || "root"}>${part}` 
      
      if (categoryCache.has(key)) {
        parent_id = categoryCache.get(key)!
        lastId = parent_id
        continue
      }

      const existing = await productModule.listProductCategories({
        name: [part],
        parent_category_id: parent_id ? [parent_id] : [null as any]
      })

      let category: any // Додали тип, щоб не було помилок на category.id
      if (existing.length > 0) {
        category = existing[0]
      } else {
        try {
          // Додали : any[] для created
          const created: any[] = await productModule.createProductCategories([{
            name: part,
            parent_category_id: parent_id,
            handle: `${part.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${parent_id ? parent_id.slice(-4) : 'root'}`
          }])
          category = created[0]
        } catch (catErr: any) {
          const byHandle = await productModule.listProductCategories({
            handle: [part.toLowerCase().replace(/[^a-z0-9]/g, '-')]
          })
          if (byHandle.length > 0) {
            category = byHandle[0]
          } else {
            throw catErr
          }
        }
      }

      categoryCache.set(key, category.id)
      parent_id = category.id
      lastId = category.id
    }

    categoryCache.set(path, lastId!)
    return lastId
  }

  for (const item of items) {
    const safeSku = String(item.sku || "").trim()
    
    if (!safeSku) {
      report.failed++
      report.details.push({ sku: "EMPTY", error: "Missing SKU in request" })
      continue
    }

    try {
      let variant = variantMap.get(safeSku)
      let productId: string
      const categoryId = await ensureCategoryTree(item.category)

      // 1. СТВОРЕННЯ АБО ПОШУК ТОВАРУ + КАНАЛ ПРОДАЖУ
      // 1. СТВОРЕННЯ АБО ПОШУК ТОВАРУ
      if (!variant) {
        const createdProducts = await productModule.createProducts([{
          title: item.name,
          handle: safeSku.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          subtitle: item.brand,
          status: "published" as any,
          category_ids: categoryId ? [categoryId] : [],
          // sales_channels видалено звідси, бо ProductModule їх не приймає
          options: [{ title: "Default", values: ["Default"] }],
          variants: [{
            title: "Default",
            sku: safeSku,
            options: { Default: "Default" },
            manage_inventory: true
          }]
        }])

        productId = createdProducts[0].id
        
        // Створюємо зв'язок з Sales Channel через Remote Link
        await remoteLink.create({
          [Modules.PRODUCT]: { product_id: productId },
          ["sales_channel"]: { sales_channel_id: SALES_CHANNEL_ID }
        })

        const newVariants = await productModule.listProductVariants({ product_id: [productId] })
        variant = newVariants[0]
      } else {
        productId = variant.product.id
        
        // Для існуючих товарів також примусово оновлюємо зв'язок (якщо його немає)
        await remoteLink.create({
          [Modules.PRODUCT]: { product_id: productId },
          ["sales_channel"]: { sales_channel_id: SALES_CHANNEL_ID }
        })
      }
      // 2. ОНОВЛЕННЯ ДАНИХ
      const existingProduct = await productModule.retrieveProduct(productId)
      await productModule.updateProducts(productId, {
        title: item.name,
        subtitle: item.brand,
        category_ids: categoryId ? [categoryId] : [],
        metadata: {
          ...(existingProduct.metadata || {}),
          rrc_price: item.price_rrc,
          brand: item.brand,
          series: item.series,
          attributes: item.attributes || {}
        }
      })

      // 3. ОТРИМАННЯ ЛІНКІВ
      const linkDataResults = await (remoteQuery as any)({
        entity: "variant",
        fields: ["id", "price_set.id", "inventory_items.inventory_item_id"],
        filters: { id: [variant.id] }
      })
      
      const linkData = linkDataResults[0]
      const priceSetId = linkData?.price_set?.id
      const inventoryItemId = linkData?.inventory_items?.[0]?.inventory_item_id

      // 4. ЦІНИ
      const finalPrice = (item.price_ecom && Number(item.price_ecom) > 0) 
        ? Number(item.price_ecom) 
        : Number(item.price_rrc)

      if (priceSetId) {
        await pricingModule.updatePriceSets(priceSetId, {
          prices: [{ currency_code: "uah", amount: finalPrice }]
        })
      } else {
        const ps = await pricingModule.createPriceSets([{
          prices: [{ currency_code: "uah", amount: finalPrice }]
        }])
        await remoteLink.create({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.PRICING]: { price_set_id: ps[0].id }
        })
      }

      // 5. ІНВЕНТАР (БЕЗ ДУБЛІКАТІВ)
      let invId = inventoryItemId
      
      if (!invId) {
        // Перевіряємо, чи такий SKU вже є в базі інвентарю
        const [existingInv] = await inventoryModule.listInventoryItems({ sku: [safeSku] })
        
        if (existingInv) {
          invId = existingInv.id
        } else {
          const createdInv = await inventoryModule.createInventoryItems([{ sku: safeSku, title: item.name }])
          invId = createdInv[0].id
        }
        
        // Лінкуємо
        await remoteLink.create({
          [Modules.PRODUCT]: { variant_id: variant.id },
          [Modules.INVENTORY]: { inventory_item_id: invId }
        })
      }

      // Оновлюємо залишки
      const levelPayload = {
        inventory_item_id: invId,
        location_id: LOCATION_ID,
        stocked_quantity: Number(item.inventory) || 0
      }

      const invLevels = await inventoryModule.listInventoryLevels({
        inventory_item_id: [invId],
        location_id: [LOCATION_ID]
      })

      if (invLevels.length > 0) {
        await inventoryModule.updateInventoryLevels([levelPayload])
      } else {
        await inventoryModule.createInventoryLevels([levelPayload])
      }

      report.success++
      report.details.push({ sku: safeSku, status: "OK", price: finalPrice, stock: item.inventory })

    } catch (error: any) {
      report.failed++
      report.details.push({ sku: safeSku, error: error.message })
    }
  }

 // Перед самим поверненням відповіді додаємо вивід у консоль
  console.log("\n=== SYNC REPORT ===");
  console.table({
    "Total Items": report.total,
    "Success": report.success,
    "Failed": report.failed
  });

  if (report.details.length > 0) {
    console.log("Details:");
    // Виведемо перші 10 SKU для контролю
    console.table(report.details.slice(0, 10).map(d => ({
      SKU: d.sku,
      Status: d.status || "ERROR",
      Price: d.price,
      Stock: d.stock,
      Error: d.error ? d.error.substring(0, 30) : ""
    })));
  }
  console.log("===================\n");

  return res.json({
    success: report.failed === 0,
    stats: {
      total: report.total,
      synced: report.success,
      failed: report.failed
    },
    results: report.details
  })
}
    
