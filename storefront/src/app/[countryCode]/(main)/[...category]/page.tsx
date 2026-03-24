import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle } from "@lib/data/categories"
import { StoreTemplate } from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// У Next.js 15 params та searchParams — це Promise
type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const data = await getCategoryByHandle(params.category).catch(() => null)

  const category = Array.isArray(data) ? data[0] : (data as any)?.product_categories?.[0] || data

  if (!category) notFound()

  return {
    title: `${category.name} | Porto B2B`,
    description: category.description,
  }
}

export default async function CategoryPage(props: Props) {
  // Обов'язково додаємо await для params та searchParams
  const params = await props.params
  const searchParams = await props.searchParams

  const { sortBy, page } = searchParams

  const data = await getCategoryByHandle(params.category).catch(() => null)

  // Універсальна перевірка на структуру даних Medusa
  const category = Array.isArray(data) ? data[0] : (data as any)?.product_categories?.[0] || data

  if (!category) notFound()

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      category={category}
    />
  )
}