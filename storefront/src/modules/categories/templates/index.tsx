import { Fragment } from "react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  // 1. Збираємо батьків у правильному порядку (від старшого до молодшого)
  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (cat: any) => {
    if (cat.parent_category) {
      parents.unshift(cat.parent_category) // додаємо в початок масиву
      getParents(cat.parent_category)
    }
  }
  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />

      <div className="w-full">
        {/* 2. Оновлений блок Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-ui-fg-subtle flex-wrap">
          <LocalizedClientLink href="/" className="hover:text-black">
            Головна
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store" className="hover:text-black">
            Каталог
          </LocalizedClientLink>

          {parents.map((parent) => (
            <Fragment key={parent.id}>
              <span>/</span>
              <LocalizedClientLink
                className="hover:text-black"
                // ТУТ МІНЯЄМО: прибираємо /categories/
                href={`/${parent.handle}`}
              >
                {parent.name}
              </LocalizedClientLink>
            </Fragment>
          ))}
          <span>/</span>
          <span className="text-ui-fg-base font-medium">{category.name}</span>
        </nav>

        {/* Заголовок категорії */}
        <div className="flex flex-row mb-8 text-3xl-semi gap-4">
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>

        {category.description && (
          <div className="mb-8 text-base-regular text-ui-fg-subtle">
            <p>{category.description}</p>
          </div>
        )}

        {/* Список підкатегорій (якщо є) */}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8 p-4 bg-ui-bg-subtle rounded-lg">
            <span className="text-xs uppercase text-ui-fg-muted mb-3 block">Підкатегорії:</span>
            <ul className="grid grid-cols-1 small:grid-cols-3 gap-4">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/${c.handle}`} // ТУТ ТЕЖ ПРИБИРАЄМО /categories/
                    className="text-base hover:text-ui-fg-interactive underline decoration-ui-border-strong"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}