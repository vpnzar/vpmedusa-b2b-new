import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { HttpTypes } from "@medusajs/types"

export const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  category,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  category?: HttpTypes.StoreProductCategory
}) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    // 1. Головний контейнер з відступами та центруванням (Porto style)
    <div className="flex flex-col py-6 pb-12 bg-white">
      <div className="content-container flex flex-col small:flex-row gap-x-8">

        {/* 2. ЛІВИЙ САЙДБАР (Sidebar Left - 25% ширини) */}
        <aside className="w-full small:w-[25%] shrink-0">
          <div className="sticky top-[100px]">
            {/* Тут твій RefinementList (фільтри, ціна, категорії) */}
            <RefinementList sortBy={sortBy || "created_at"} />
          </div>
        </aside>

        {/* 3. ОСНОВНИЙ КОНТЕНТ (3 колонки товарів - 75% ширини) */}
        <main className="w-full">
          <div className="flex flex-col w-full">

            {/* Заголовок та сортування */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h1 className="text-xl font-bold uppercase text-[#222529]">
                {category ? category.name : "Магазин"}
              </h1>
              {/* Тут можна додати кількість знайдених товарів */}
            </div>

            {/* СІТКА ТОВАРІВ */}
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sortBy || "created_at"}
                page={pageNumber}
                countryCode={countryCode}
                categoryId={category?.id}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}