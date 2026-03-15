"use client"

import React from "react"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SideMenuProps {
  isStatic?: boolean
}

const SideMenu: React.FC<SideMenuProps> = ({ isStatic = false }) => {
  const menuItems = [
    {
      name: "Електротовари",
      handle: "electro",
      icon: "fa-solid fa-bolt",
      subcategories: [
        { title: "Schneider Electric", items: ["Asfora", "Sedna", "Unica"] },
        { title: "Hager", items: ["Вольта", "Вектор", "Автомати"] },
      ],
      banner: "https://m2.portotheme.com/media/wysiwyg/smartwave/porto/megamenu/menu-banner.jpg"
    },
    {
      name: "Розумний будинок",
      handle: "smart-home",
      icon: "fa-solid fa-lightbulb",
      subcategories: [
        { title: "KNX", items: ["Контролери", "Датчики"] },
        { title: "Живлення", items: ["Блоки живлення", "USB розетки"] },
      ]
    }
  ]

  if (isStatic) {
    return (
      <div className="w-full border border-gray-200 rounded-md bg-white shadow-sm overflow-visible font-sans">
        <div className="bg-gray-100 px-5 py-4 border-b">
          <Text className="font-bold text-gray-900 uppercase text-sm tracking-tight">
            КАТАЛОГ ТОВАРІВ
          </Text>
        </div>

        <nav className="flex flex-col">
          <ul className="flex flex-col m-0 p-0 list-none">
            {menuItems.map((item) => (
              <li key={item.handle} className="group relative border-b last:border-0 border-gray-100 list-none">

                <LocalizedClientLink
                  href={`/categories/${item.handle}`}
                  className="relative flex items-center px-5 py-3.5 text-[14px] text-gray-700 group-hover:bg-[#0088cc] group-hover:text-white transition-all font-semibold"
                >
                  {/* Іконка зліва */}
                  <i className={`${item.icon} w-6 mr-2 text-gray-400 group-hover:text-white transition-colors text-center`}></i>

                  {/* Назва */}
                  <span className="flex-grow">{item.name}</span>

                  {/* Стрілочка шеврон (маленька справа) */}
                  <i className="fa-solid fa-chevron-right text-[10px] opacity-50 group-hover:opacity-100 transition-all ml-2"></i>

                  {/* ТОЙ САМИЙ ЗАЛОМ (Білий трикутник) */}
                  {/* ВІН ТЕПЕР ВИЩЕ ЗА ВСІХ ЗАВДЯКИ z-[110] та -right-[1px] */}

                </LocalizedClientLink>

                {/* ПАНЕЛЬ МЕГАМЕНЮ */}
                <div className="megamenu-panel shadow-2xl">
                  <div className="flex gap-x-8 min-h-[300px] w-full bg-white">
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      {item.subcategories?.map((sub, idx) => (
                        <div key={idx}>
                          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3 uppercase text-[11px] tracking-wider">
                            {sub.title}
                          </h4>
                          <ul className="space-y-2 p-0 m-0 list-none">
                            {sub.items.map((subItem) => (
                              <li key={subItem} className="p-0 m-0 list-none">
                                <LocalizedClientLink href="#" className="text-gray-600 hover:text-[#0088cc] text-sm transition-colors block">
                                  {subItem}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {item.banner && (
                      <div className="w-1/3 relative bg-gray-50 rounded overflow-hidden">
                        <img src={item.banner} alt="Promo" className="object-cover h-full w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  return <div className="p-4 text-sm text-gray-500 font-sans">Завантаження...</div>
}

export default SideMenu