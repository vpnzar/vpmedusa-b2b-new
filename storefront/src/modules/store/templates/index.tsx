import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import PaginatedProducts from "./paginated-products"
import SmartBreadcrumbs from "@modules/common/components/breadcrumbs"
import ProductToolbar from "@modules/store/components/product-toolbar"


export default function BaseProductsTemplate({
  sortBy,
  page,
  countryCode,
  category,
  allCategories,
  limit,
  viewMode,
}: {
  sortBy?: any // Тепер це не string, а правильний тип Medusa
  page?: any
  countryCode: string
  category?: any
  allCategories?: any[]
  limit?: any
  viewMode?: "grid" | "list" | "price"
}) {
  const pageNumber = typeof page === "string" ? parseInt(page) : (page || 1)
  const currentLimit = typeof limit === "string" ? parseInt(limit) : (limit || 12)
  const currentSort = (sortBy as any) || "created_at" // Явне приведення

  return (
    <div className="flex flex-col py-6 pb-12 bg-white">
      <div className="content-container flex flex-col small:flex-row gap-x-6">

        <aside className="w-full small:w-[20%] shrink-0">
          <div className="sticky top-[100px]">
            <RefinementList sortBy={currentSort} />
          </div>
        </aside>

        <main className="w-full small:w-[80%]">
          <div className="flex flex-col w-full">

            <SmartBreadcrumbs
              category={category}
              allCategories={allCategories || []}
            />

            <h1 className="text-[24px] font-bold uppercase text-[#222529] mb-4">
              {category ? category.name : "Магазин"}
            </h1>

            <ProductToolbar
              sortBy={currentSort}
              limit={String(currentLimit)}
              currentView={viewMode || "grid"}
            />

            {/* Швидкий вибір підкатегорій */}
            {category?.category_children && category.category_children.length > 0 && (
              <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-widest text-ui-fg-muted mb-4 block font-bold">
                  ШВИДКИЙ ВИБІР:
                </span>
                <ul className="flex flex-wrap gap-2">
                  {category.category_children.map((c: any) => (
                    <li key={c.id}>
                      <a href={`/${c.handle}`} className="px-4 py-1.5 bg-white border border-ui-border-base rounded-full text-sm hover:border-blue-500 transition-all block font-medium shadow-sm">
                        {c.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Suspense
              key={`${currentSort}-${currentLimit}-${pageNumber}-${viewMode}`}
              fallback={<SkeletonProductGrid />}
            >
              <PaginatedProducts
                sortBy={currentSort}
                page={pageNumber}
                countryCode={countryCode}
                categoryId={category?.id}
                limit={currentLimit}
                viewMode={viewMode || "grid"}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}