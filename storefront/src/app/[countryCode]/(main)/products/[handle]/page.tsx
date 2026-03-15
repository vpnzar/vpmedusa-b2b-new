import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

// Функція для отримання контенту зі Strapi
async function getStrapiData(sku: string) {
  if (!sku) return null
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(
      `http://localhost:1337/api/product-contents?filters[SKU][$eq]=${sku}&populate=*`,
      {
        // Змінено на no-store, щоб бачити зміни в Strapi миттєво без очистки кешу
        cache: 'no-store',
        signal: controller.signal
      }
    )
    clearTimeout(timeoutId)

    const json = await res.json()
    return json.data?.[0] || null
  } catch (e) {
    console.log(`[Strapi] Skip/Error for SKU ${sku}`)
    return null
  }
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )
    if (!countryCodes) return []

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country as string,
        queryParams: { limit: 100, fields: "handle" },
      })
      return { country, products: response.products }
    })

    const countryProducts = await Promise.all(promises)
    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country as string,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    return []
  }
}

function getImagesForVariant(product: HttpTypes.StoreProduct, selectedVariantId?: string) {
  const productImages = product.images || []
  if (!selectedVariantId || !product.variants) return productImages
  const variant = product.variants.find((v) => v.id === selectedVariantId)
  if (!variant?.images?.length) return productImages
  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return productImages.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])
  if (!product) return { title: "Product Not Found" }
  return { title: `${product.title} | Store` }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const region = await getRegion(params.countryCode)

  if (!region) notFound()

  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  })

  const pricedProduct = response.products[0]
  if (!pricedProduct) notFound()

  // Логіка Strapi
  let strapiImages: any[] = []
  const sku = pricedProduct.variants?.[0]?.sku

  if (sku) {
    const strapiContent = await getStrapiData(sku)

    if (strapiContent) {
      const assets = strapiContent.attributes?.Images?.data || strapiContent.Images?.data || strapiContent.Images

      if (assets && Array.isArray(assets)) {
        strapiImages = assets.map((img: any) => ({
          id: String(img.id),
          url: img.attributes?.url
            ? `http://localhost:1337${img.attributes.url}`
            : `http://localhost:1337${img.url}`,
        }))
      }
    }
  }

  const finalImages = strapiImages.length > 0
    ? strapiImages
    : getImagesForVariant(pricedProduct, searchParams.v_id)

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      images={finalImages as any}
    />
  )
}