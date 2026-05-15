export const dynamic = "force-dynamic"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories || !Array.isArray(product_categories)) {
    return []
  }

  return product_categories.map((category) => ({
    category: category.handle.split("/"),
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const handle = params.category[params.category.length - 1]

  const data = (await getCategoryByHandle([handle]).catch(() => null)) as any
  const category = data?.product_categories?.[0]

  if (!category) return notFound()

  return {
    title: `${category.name} | Porto B2B`,
    description: category.description || `Купити ${category.name} в нашому магазині`,
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const cleanCategoryArray = params.category.filter(c => c !== "categories")
  const handle = cleanCategoryArray[cleanCategoryArray.length - 1]

  if (!handle) return notFound()

  // Отримуємо дані паралельно
  const [data, categoriesResponse] = await Promise.all([
    getCategoryByHandle([handle]).catch(() => null) as any,
    listCategories().catch(() => [])
  ])

  const category = data?.product_categories?.[0]

  if (!category) {
    return notFound()
  }

  /**
   * КРИТИЧНО: Medusa v2 може повертати або масив, або об'єкт { product_categories: [] }.
   * Робимо перевірку, щоб клієнтський компонент не "впав" через спробу замапити не масив.
   */
  const allCategories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse as any)?.product_categories || []

  return (
    <CategoryTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      category={category}
      allCategories={allCategories}
    />
  )
}