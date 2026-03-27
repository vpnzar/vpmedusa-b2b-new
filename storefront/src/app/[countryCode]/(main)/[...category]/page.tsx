import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { StoreTemplate } from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

/**
 * ЦЕ ТОЙ КОД, ЯКИЙ «ВИПАДАВ»: 
 * Допомагає Next.js зрозуміти всі існуючі шляхи категорій при збірці
 */
export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  return product_categories.map((category) => ({
    category: category.handle.split("/"),
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  // Беремо останній елемент масиву (наприклад 'elektroinstrument' з ['ua', 'elektroinstrument'])
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

  // Фільтруємо масив, щоб виключити випадкове потрапляння 'categories' в шлях
  const cleanCategoryArray = params.category.filter(c => c !== "categories")
  const handle = cleanCategoryArray[cleanCategoryArray.length - 1]

  if (!handle) return notFound()

  const data = (await getCategoryByHandle([handle]).catch(() => null)) as any
  const category = data?.product_categories?.[0]

  if (!category) {
    return notFound()
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      category={category}
    />
  )
}