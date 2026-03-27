"use client"

import React, { useEffect, useState } from "react"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SideMenuProps {
  isStatic?: boolean
}

const SideMenu: React.FC<SideMenuProps> = ({ isStatic = true }) => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(
          `${baseUrl}/store/product-categories?parent_category_id=null&include_descendants_tree=true`,
          {
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
              "Content-Type": "application/json",
            },
          }
        )
        if (!response.ok) throw new Error("Backend unreachable")
        const data = await response.json()
        setCategories(data.product_categories || [])
      } catch (e) {
        console.error("SideMenu Error:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (isLoading) return <div className="p-4 text-sm text-gray-500 font-sans">Завантаження...</div>

  return (
    <div className="w-full border border-gray-200 rounded-md bg-white shadow-sm overflow-visible font-sans">
      <div className="bg-gray-100 px-5 py-4 border-b">
        <Text className="font-bold text-gray-900 uppercase text-sm tracking-tight">КАТАЛОГ ТОВАРІВ</Text>
      </div>

      <nav className="flex flex-col">
        <ul className="flex flex-col m-0 p-0 list-none">
          {categories.map((item) => (
            <li key={item.id} className="group relative border-b last:border-0 border-gray-100 list-none">
              <LocalizedClientLink
                href={`/${item.handle}`}
                className="relative flex items-center px-5 py-3.5 text-[14px] text-gray-700 group-hover:bg-[#0088cc] group-hover:text-white transition-all font-semibold"
              >
                <i className={clx(item.metadata?.icon || "fa-solid fa-bolt", "w-6 mr-2 text-gray-400 group-hover:text-white transition-colors text-center")}></i>
                <span className={clx("flex-grow", { "text-red-600": item.metadata?.is_featured === "true" })}>{item.name}</span>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-50 group-hover:opacity-100 transition-all ml-2"></i>
              </LocalizedClientLink>

              {/* МЕГАМЕНЮ */}
              {item.category_children && item.category_children.length > 0 && (
                <div className="megamenu-panel shadow-2xl absolute left-full top-0 hidden group-hover:block z-50 ml-[1px]">
                  <div className="flex gap-x-8 min-h-[300px] w-[700px] bg-white border border-gray-200 p-6 text-left">
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      {item.category_children.map((sub: any) => (
                        <div key={sub.id} className="text-left">
                          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3 uppercase text-[11px] tracking-wider">
                            {/* ПОСИЛАННЯ ДЛЯ ЗАГОЛОВКА ПІДКАТЕГОРІЇ */}
                            <LocalizedClientLink href={`/${sub.handle}`} className="hover:text-[#0088cc]">
                              {sub.name}
                            </LocalizedClientLink>
                          </h4>
                          <ul className="space-y-2 p-0 m-0 list-none">
                            {sub.category_children?.map((subItem: any) => (
                              <li key={subItem.id} className="p-0 m-0 list-none">
                                <LocalizedClientLink href={`/${subItem.handle}`} className="text-gray-600 hover:text-[#0088cc] text-sm transition-colors block">
                                  {subItem.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                            {/* ПЕРЕГЛЯНУТИ ВСЕ */}
                            <li className="list-none pt-2 border-t border-gray-50 mt-2">
                              <LocalizedClientLink href={`/${sub.handle}`} className="text-[10px] text-gray-400 hover:text-[#0088cc] uppercase font-bold tracking-tighter">
                                ПЕРЕГЛЯНУТИ ВСЕ {sub.name}
                              </LocalizedClientLink>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* БАНЕР */}
                    {item.metadata?.banner_url && (
                      <div className="w-1/3 relative bg-gray-50 rounded overflow-hidden">
                        <img src={item.metadata.banner_url} alt={item.name} className="object-cover h-full w-full" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default SideMenu