import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections" // Використовуємо твою функцію
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Electrica Shop | Головна",
  description: "Найкращі електротовари Schneider Electric та інших брендів.",
}

export default async function HomePage(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) notFound()

  // Отримуємо колекції за допомогою listCollections
  const { collections } = await listCollections({
    fields: "*products", // завантажуємо продукти для кожної колекції
  })

  return (
    <>
      {/* 1. Твій банер (має з'явитися зараз) */}
      <Hero />

      <div className="py-12">
        {/* 2. Блок з колекціями товарів */}
        <FeaturedProducts region={region} collections={collections} />
      </div>
    </>
  )
}