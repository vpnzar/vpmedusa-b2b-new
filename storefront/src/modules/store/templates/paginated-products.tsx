import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export default async function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  productsIds,
}: {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
}) {
  const region = await getRegion(countryCode)
  if (!region) return null

  // Використовуємо Record<string, any>, щоб TS не сварився на назви полів Medusa
  const queryParams: Record<string, any> = {
    limit: 12,
  }

  if (collectionId) queryParams["collection_id"] = [collectionId]
  if (categoryId) queryParams["category_id"] = [categoryId]
  if (productsIds) queryParams["id"] = productsIds
  if (sortBy) queryParams["order"] = sortBy

  const { response: { products, count } } = await listProductsWithSort({
    page,
    queryParams: queryParams as any,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / 12)

  return (
    <div className="w-full">
      {/* СІТКА: 
          - gap-3 робить відступи меншими (як у Porto)
          - lg:grid-cols-4 ПРИМУСОВО робить 4 колонки
      */}
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {products.map((p) => (
          <li key={p.id} className="flex justify-center">
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center border-t border-[#e7e7e7] pt-6">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}