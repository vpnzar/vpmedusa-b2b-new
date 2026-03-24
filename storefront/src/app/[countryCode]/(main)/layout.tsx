import { Metadata } from "next"
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// У Next.js 15 Props для Layout мають Promise params
interface PageLayoutProps {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}

export default async function PageLayout(props: PageLayoutProps) {
  // Очікуємо параметри, щоб Next.js знав, у якому ми регіоні
  const params = await props.params
  const { countryCode } = params

  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart().catch(() => null)
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions().catch(() => ({ shipping_options: [] }))
    shippingOptions = shipping_options
  }

  return (
    <>
      <Nav />

      {/* Глобальні хлібні крихти */}
      <Breadcrumbs />

      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}

      <main className="relative">
        {props.children}
      </main>

      <Footer />
    </>
  )
}