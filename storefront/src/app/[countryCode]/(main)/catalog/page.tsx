import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { StoreTemplate } from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Каталог | Магазин",
  description: "Огляд усіх товарів нашого каталогу.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function CatalogPage(props: Props) {
  const { countryCode } = await props.params
  const { sortBy, page } = await props.searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}