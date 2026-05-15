import { 
  MedusaRequest, // Змінили тут
  MedusaResponse 
} from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// Міняємо DELETE на GET, щоб можна було просто відкрити в браузері
export const GET = async (
  req: MedusaRequest, // І тут
  res: MedusaResponse
) => {
  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT
  )

  try {
    const products = await productModuleService.listProducts(
      {}, 
      { select: ["id"] }
    )
    
    const productIds = products.map((p) => p.id)

    if (productIds.length > 0) {
      await productModuleService.deleteProducts(productIds)
    }

    res.json({
      message: `✅ Успішно видалено ${productIds.length} товарів.`,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Помилка очищення", error: error.message })
  }
}