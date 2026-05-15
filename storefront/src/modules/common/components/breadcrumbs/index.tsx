"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDown } from "@medusajs/icons"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

export default function Breadcrumbs({
    category,
    allCategories
}: {
    category: any,
    allCategories: HttpTypes.StoreProductCategory[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeSeries = searchParams.get("series")

    const path: any[] = []
    let curr = category
    while (curr) {
        path.unshift(curr)
        curr = curr.parent_category
    }

    const getSiblings = (parentId: string | null) =>
        allCategories.filter(c => c.parent_category_id === parentId)

    return (
        <nav className="flex items-center gap-2 mb-6 text-sm text-ui-fg-subtle flex-wrap">
            <LocalizedClientLink href="/" className="hover:text-black">Головна</LocalizedClientLink>

            {path.map((segment, index) => (
                /* Використовуємо id, а якщо його нема (як у нашому випадку) — handle або index */
                <Fragment key={segment.id || segment.handle || index}>
                    <span className="text-ui-fg-muted">/</span>
                    <Popover className="relative">
                        <Popover.Button className="flex items-center gap-1 font-medium text-ui-fg-base focus:outline-none">
                            {segment.name} <ChevronDown className="w-3 h-3" />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-50 mt-2 w-56 bg-white border border-ui-border-base rounded-md shadow-xl p-2">
                                <div className="flex flex-col gap-1">
                                    {getSiblings(segment.parent_category_id).map((sib: any) => (
                                        <button
                                            key={sib.id}
                                            onClick={() => router.push(`/${sib.handle}`)}
                                            className={clx(
                                                "text-left px-3 py-2 rounded-md hover:bg-ui-bg-subtle transition-colors",
                                                sib.id === segment.id && "bg-ui-bg-disabled font-bold"
                                            )}
                                        >
                                            {sib.name}
                                        </button>
                                    ))}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Fragment>
            ))}
        </nav>
    )
}