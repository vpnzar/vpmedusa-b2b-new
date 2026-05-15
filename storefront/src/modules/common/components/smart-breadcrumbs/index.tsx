"use client"

import { useRouter } from "next/navigation"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDown } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"
import { clx } from "@medusajs/ui"

export default function SmartBreadcrumbs({ category, allCategories }: { category: any, allCategories: any[] }) {
    const router = useRouter()

    if (!category) return null

    const getSiblings = (parentId: string | null) => {
        return allCategories.filter(c => c.parent_category_id === parentId)
    }

    const path = []
    let current = category
    while (current) {
        path.unshift(current)
        current = current.parent_category
    }

    return (
        <nav className="flex items-center gap-2 mb-6 text-sm text-ui-fg-subtle flex-wrap py-2 border-b border-ui-border-base">
            <LocalizedClientLink href="/" className="hover:text-black">Головна</LocalizedClientLink>
            <span className="text-ui-fg-muted">/</span>
            <LocalizedClientLink href="/store" className="hover:text-black">Каталог</LocalizedClientLink>

            {path.map((segment) => (
                <Fragment key={segment.id}>
                    <span className="text-ui-fg-muted">/</span>
                    <Popover className="relative">
                        <Popover.Button className="flex items-center gap-1 hover:text-black focus:outline-none outline-none font-medium text-ui-fg-base">
                            {segment.name}
                            <ChevronDown className="w-3 h-3" />
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
                                    {getSiblings(segment.parent_category_id).map((sibling) => (
                                        <button
                                            key={sibling.id}
                                            onClick={() => router.push(`/${sibling.handle}`)}
                                            className={clx(
                                                "text-left px-3 py-2 rounded-md hover:bg-ui-bg-subtle transition-colors",
                                                sibling.id === segment.id && "bg-ui-bg-disabled font-bold"
                                            )}
                                        >
                                            {sibling.name}
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