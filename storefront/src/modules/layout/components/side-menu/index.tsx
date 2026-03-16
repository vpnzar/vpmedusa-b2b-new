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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/product-categories?parent_category_id=null&include_descendants_tree=true`,
          {
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
              "Content-Type": "application/json",
            },
          }
        )
        const data = await response.json()
        setCategories(data.product_categories || [])
      } catch (e) {
        console.error("Помилка завантаження категорій:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500 font-sans">Завантаження...</div>
  }

  return (
    <div className="w-full border border-gray-200 rounded-md bg-white shadow-sm overflow-visible font-sans">
      {/* ШАПКА КАТАЛОГУ */}
      <div className="bg-gray-100 px-5 py-4 border-b">
        <Text className="font-bold text-gray-900 uppercase text-sm tracking-tight">
          КАТАЛОГ ТОВАРІВ
        </Text>
      </div>

      <nav className="flex flex-col">
        <ul className="flex flex-col m-0 p-0 list-none">
          {categories.map((item) => (
            <li key={item.id} className="group relative border-b last:border-0 border-gray-100 list-none">

              <LocalizedClientLink
                href={`/categories/${item.handle}`}
                className="relative flex items-center px-5 py-3.5 text-[14px] text-gray-700 group-hover:bg-[#0088cc] group-hover:text-white transition-all font-semibold"
              >
                {/* 1. ДИНАМІЧНА ІКОНКА (береться з метаданих 'icon') */}
                <i className={clx(
                  item.metadata?.icon || "fa-solid fa-bolt",
                  "w-6 mr-2 text-gray-400 group-hover:text-white transition-colors text-center"
                )}></i>

                {/* 2. НАЗВА (можна виділити, якщо is_featured: true) */}
                <span className={clx("flex-grow", {
                  "text-red-600": item.metadata?.is_featured === "true"
                })}>
                  {item.name}
                </span>

                <i className="fa-solid fa-chevron-right text-[10px] opacity-50 group-hover:opacity-100 transition-all ml-2"></i>
              </LocalizedClientLink>

              {/* ПАНЕЛЬ МЕГАМЕНЮ */}
              {item.category_children && item.category_children.length > 0 && (
                <div className="megamenu-panel shadow-2xl">
                  <div className="flex gap-x-8 min-h-[300px] w-full bg-white text-black text-left">

                    {/* СІТКА ПІДКАТЕГОРІЙ */}
                    <div className="flex-1 grid grid-cols-2 gap-8 text-left">
                      {item.category_children.map((sub: any) => (
                        <div key={sub.id} className="text-left">
                          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3 uppercase text-[11px] tracking-wider text-left">
                            {sub.name}
                          </h4>
                          <ul className="space-y-2 p-0 m-0 list-none text-left">
                            {sub.category_children?.map((subItem: any) => (
                              <li key={subItem.id} className="p-0 m-0 list-none text-left">
                                <LocalizedClientLink
                                  href={`/categories/${subItem.handle}`}
                                  className="text-gray-600 hover:text-[#0088cc] text-sm transition-colors block text-left"
                                >
                                  {subItem.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                            {(!sub.category_children || sub.category_children.length === 0) && (
                              <li className="list-none text-left">
                                <LocalizedClientLink
                                  href={`/categories/${sub.handle}`}
                                  className="text-[10px] text-gray-400 hover:text-[#0088cc] uppercase"
                                >
                                  Переглянути все
                                </LocalizedClientLink>
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* 3. ДИНАМІЧНИЙ БАНЕР (береться з метаданих 'banner_url') */}
                    {item.metadata?.banner_url && (
                      <div className="w-1/3 relative bg-gray-50 rounded overflow-hidden">
                        <img
                          src={item.metadata.banner_url}
                          alt={item.name}
                          className="object-cover h-full w-full"
                        />
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