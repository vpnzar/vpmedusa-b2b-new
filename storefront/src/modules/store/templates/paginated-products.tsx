import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export default async function PaginatedProducts({
  sortBy,
  page,
  categoryId,
  collectionId,
  typeId,
  tagId,
  id,
  countryCode,
  viewMode = "grid",
  limit = 12,
}: {
  sortBy?: SortOptions
  page: number
  categoryId?: string
  collectionId?: string
  typeId?: string
  tagId?: string
  id?: string
  countryCode: string
  viewMode?: "grid" | "list" | "price"
  limit?: number
}) {
  const pageNumber = Number(page) || 1

  // Отримуємо region один раз тут
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: any = {
    limit: limit,
  }

  if (categoryId) queryParams["category_id"] = categoryId
  if (collectionId) queryParams["collection_id"] = collectionId
  if (typeId) queryParams["type_id"] = typeId
  if (tagId) queryParams["tag_id"] = tagId
  if (id) queryParams["id"] = id

  try {
    const {
      response: { products, count },
    } = await listProductsWithSort({
      page: pageNumber,
      queryParams,
      sortBy,
      countryCode,
    })

    const totalPages = Math.ceil(count / limit)

    if (products.length === 0) {
      return (
        <div className="py-20 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">У цій категорії поки немає товарів</p>
        </div>
      )
    }

    // ЛОГІКА КЛАСІВ ДЛЯ СІТКИ (Універсальна)
    const listClassName =
      viewMode === "grid"
        ? "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full"
        : "flex flex-col w-full gap-y-4"

    return (
      <>
        <ul className={listClassName}>
          {products.map((p) => (
            <li key={p.id}>
              <ProductPreview
                product={p as any}
                region={region}
                viewMode={viewMode}
              />
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              data-testid="product-pagination"
              page={pageNumber}
              totalPages={totalPages}
            />
          </div>
        )}
      </>
    )
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error occurred"
    console.error("CRITICAL ERROR IN PAGINATED PRODUCTS:", errorMessage)

    return (
      <div className="py-20 text-center border-2 border-dashed border-red-200 bg-red-50">
        <p className="text-red-600 font-bold uppercase tracking-widest">
          Помилка завантаження товарів
        </p>
        <p className="text-sm text-red-400 mt-2">{errorMessage}</p>
      </div>
    )
  }
}