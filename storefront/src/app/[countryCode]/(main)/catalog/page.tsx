import { Metadata } from "next"
// Імпортуємо наш новий шаблон прямо
import BaseProductsTemplate from "@modules/store/templates/base-products-template"

export const metadata: Metadata = {
  title: "Каталог | Магазин",
  description: "Огляд усіх товарів нашого каталогу.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    sortBy?: any // Ставимо any, щоб TS не заважав жити
    page?: string
  }>
}

export default async function CatalogPage(props: Props) {
  const { countryCode } = await props.params
  const searchParams = await props.searchParams // Витягуємо всі параметри

  return (
    <BaseProductsTemplate
      sortBy={searchParams.sortBy}
      page={searchParams.page}
      countryCode={countryCode}
      // Передаємо інші параметри, якщо вони потрібні шаблону
      viewMode={(searchParams as any).view || "grid"}
      limit={(searchParams as any).limit || "12"}
    />
  )
}