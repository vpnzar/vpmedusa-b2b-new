import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const DELETE = async (
  req: AuthenticatedMedusaRequest, 
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
      // У Medusa 2.0 метод очікує масив ID або селектор
      await productModuleService.deleteProducts(productIds)
    }

    res.json({
      message: `Deleted ${productIds.length} products`,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Error clearing products", error: error.message })
  }
}