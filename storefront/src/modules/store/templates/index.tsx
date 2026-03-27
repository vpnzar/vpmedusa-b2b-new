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
  // Визначаємо номер сторінки
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="flex flex-col py-6 pb-12 bg-white">
      {/* Контейнер Porto: обмежена ширина, центрування */}
      <div className="content-container flex flex-col small:flex-row gap-x-6">

        {/* ЛІВИЙ САЙДБАР (20% ширини) */}
        <aside className="w-full small:w-[20%] shrink-0">
          <div className="sticky top-[100px]">
            <RefinementList sortBy={sortBy || "created_at"} />
          </div>
        </aside>

        {/* ОСНОВНИЙ КОНТЕНТ (80% ширини) */}
        <main className="w-full small:w-[80%]">
          <div className="flex flex-col w-full">

            {/* Заголовок категорії або Магазину */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h1 className="text-xl font-bold uppercase text-[#222529]">
                {category ? category.name : "Каталог"}
              </h1>
            </div>

            {/* Сітка товарів (буде 4 колонки завдяки PaginatedProducts) */}
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