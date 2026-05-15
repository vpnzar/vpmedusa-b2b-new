import { notFound } from "next/navigation"
import { Suspense } from "react"
import SmartBreadcrumbs from "@modules/common/components/breadcrumbs"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import SortSelect from "../components/sort-select"
import ViewModeControl from "../components/view-mode-control"

export default function CategoryTemplate({
  category,
  allCategories,
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  category: any
  allCategories: HttpTypes.StoreProductCategory[]
  sortBy?: string
  page?: string
  countryCode: string
  searchParams?: any
}) {
  // 1. Витягуємо параметри виду та ліміту
  const viewMode = (searchParams?.view as "grid" | "list" | "price") || "grid"
  const limit = searchParams?.limit || "12"

  const pageNumber = page ? parseInt(page) : 1

  // ФІКС: Примусово кажемо, що це SortOptions через as any
  const sort = (sortBy || "created_at") as any

  if (!category || !countryCode) notFound()

  return (
    <div className="flex flex-col py-6 content-container bg-white">
      <div className="flex flex-col small:flex-row gap-x-8">

        {/* Фільтри зліва */}
        <aside className="w-full small:w-[250px] shrink-0">
          <RefinementList sortBy={sort} />
        </aside>

        <div className="w-full">
          {/* Вертикальні крихти */}
          <SmartBreadcrumbs category={category} allCategories={allCategories} />

          <h1 className="text-[24px] font-bold uppercase text-[#222529] mb-4">
            {category.name}
          </h1>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between border-b border-ui-border-base pb-4">

              {/* Кнопки перемикання виду */}
              <ViewModeControl currentView={viewMode} />

              <div className="flex items-center gap-x-6">
                <SortSelect sortBy={sort} />

                {/* Селект кількості товарів */}
                <div className="hidden small:flex items-center gap-x-2">
                  <span className="text-[10px] uppercase text-ui-fg-muted font-bold whitespace-nowrap font-sans">
                    Показати:
                  </span>
                  <select
                    className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer py-0 outline-none font-sans"
                    defaultValue={limit}
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Швидкий вибір підкатегорій */}
          {category.category_children && category.category_children.length > 0 && (
            <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[10px] uppercase tracking-widest text-ui-fg-muted mb-4 block font-bold font-sans">
                ШВИДКИЙ ВИБІР:
              </span>
              <ul className="flex flex-wrap gap-2">
                {category.category_children?.map((c: any) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/${c.handle}`}
                      className="px-4 py-1.5 bg-white border border-ui-border-base rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm block font-medium"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Список товарів */}
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              viewMode={viewMode}
              limit={parseInt(limit)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}