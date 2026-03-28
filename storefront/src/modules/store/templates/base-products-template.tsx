import React, { Suspense } from "react"
// Перевір, чи ці компоненти реально існують за цими шляхами
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
    sortBy?: any
    page?: any
    countryCode: string
    category?: any
    allCategories?: any[]
    limit?: any
    viewMode?: "grid" | "list" | "price"
}) {
    // Безпечна конвертація параметрів
    const pageNumber = typeof page === "string" ? parseInt(page) : (Number(page) || 1)
    const currentLimit = typeof limit === "string" ? parseInt(limit) : (Number(limit) || 12)
    const currentSort = sortBy || "created_at"

    return (
        <div className="flex flex-col py-6 pb-12 bg-white">
            <div className="content-container flex flex-col small:flex-row gap-x-6">

                <aside className="w-full small:w-[20%] shrink-0">
                    <div className="sticky top-[100px]">
                        {/* Переконайся, що RefinementList експортується як default */}
                        {RefinementList && <RefinementList sortBy={currentSort as any} />}
                    </div>
                </aside>

                <main className="w-full small:w-[80%]">
                    <div className="flex flex-col w-full">

                        {/* Додаємо вертикальні крихти навіть для каталогу */}
                        <SmartBreadcrumbs
                            category={category || { name: "Магазин", handle: "catalog" }}
                            allCategories={allCategories || []}
                        />

                        <h1 className="text-[24px] font-bold uppercase text-[#222529] mb-4">
                            {category ? category.name : "Каталог товарів"}
                        </h1>

                        <ProductToolbar
                            sortBy={currentSort}
                            limit={String(currentLimit)}
                            currentView={viewMode || "grid"}
                        />

                        {/* Підкатегорії */}
                        {category?.category_children && category.category_children.length > 0 && (
                            <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-[10px] uppercase tracking-widest text-ui-fg-muted mb-4 block font-bold">
                                    ШВИДКИЙ ВИБІР:
                                </span>
                                <ul className="flex flex-wrap gap-2">
                                    {category.category_children.map((c: any) => (
                                        <li key={c.id}>
                                            <a
                                                href={`/${c.handle}`}
                                                className="px-4 py-1.5 bg-white border border-ui-border-base rounded-full text-sm hover:border-blue-500 transition-all block font-medium shadow-sm"
                                            >
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
                            {PaginatedProducts ? (
                                <PaginatedProducts
                                    sortBy={currentSort as any}
                                    page={pageNumber}
                                    countryCode={countryCode}
                                    categoryId={category?.id}
                                    limit={currentLimit}
                                    viewMode={viewMode || "grid"}
                                />
                            ) : (
                                <div>Помилка завантаження товарів</div>
                            )}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    )
}