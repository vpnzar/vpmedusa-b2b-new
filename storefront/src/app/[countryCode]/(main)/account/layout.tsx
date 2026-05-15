import { Metadata } from "next"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="relative bg-[#fff]">
        {props.children}
      </main>
      <Footer />
    </>
  )
}