import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// 1. Правильна типізація пропсів для Next.js 15
interface CategoryPageProps {
    params: Promise<{
        handle: string
        countryCode: string
    }>
    searchParams: Promise<{
        sortBy?: SortOptions
        page?: string
    }>
}

// 2. Генерація метаданих (SEO)
export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
    const { handle } = await props.params
    const category = await getCategoryByHandle([handle]).catch(() => null)

    if (!category) return { title: "Категорія" }

    return {
        title: `${category.name} | ТОВ КТС Груп`,
        description: category.description || `Купити ${category.name} в Україні. Офіційний дилер.`,
    }
}

// 3. Основний компонент сторінки
export default async function CategoryPage(props: CategoryPageProps) {
    const [params, searchParams, allCategories] = await Promise.all([
        props.params,
        props.searchParams,
        listCategories(),
    ])

    const { handle, countryCode } = params
    const { sortBy, page } = searchParams

    const result = await getCategoryByHandle([handle]).catch((err) => {
        console.error("💥 Помилка API Medusa:", err.message)
        return null
    })

    const category = Array.isArray(result) ? result[0] : result

    if (!category) {
        return notFound()
    }

    return (
        <CategoryTemplate
            category={category}
            allCategories={allCategories}
            sortBy={sortBy}
            page={page}
            countryCode={countryCode}
            // ПЕРЕДАЄМО РОЗПАКОВАНІ searchParams СЮДИ
            searchParams={searchParams}
        />
    )
}