"use client"

import { Heading } from "@medusajs/ui"
import Image from "next/image"
import SideMenu from "@modules/layout/components/side-menu"

const Hero = () => {
  return (
    <div className="content-container flex flex-col lg:flex-row gap-x-6 py-8 bg-white min-h-[550px]">

      {/* Ліва колонка - 25% ширини */}
      <aside className="hidden lg:block w-1/4">
        <SideMenu isStatic={true} />
      </aside>

      {/* Права колонка - Банер 75% ширини */}
      <div className="w-full lg:w-3/4 h-[500px] relative rounded-lg overflow-hidden shadow-md border border-gray-100 bg-gray-50">
        <Image
          src="/hero-image.jpg"
          alt="Main Banner"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 75vw"
        />

        {/* Контент поверх банера */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-16 bg-gradient-to-r from-white/40 to-transparent">
          <p className="text-blue-700 font-bold uppercase tracking-[0.2em] text-xs mb-3">
            Professional Equipment
          </p>
          <Heading
            level="h1"
            className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6"
          >
            Schneider <br /> & Hager Systems
          </Heading>

          <button className="bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-4 px-10 rounded-full w-fit transition-all shadow-lg active:scale-95">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero