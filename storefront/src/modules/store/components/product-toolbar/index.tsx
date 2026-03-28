import SortSelect from "@modules/categories/components/sort-select"
import ViewModeControl from "@modules/categories/components/view-mode-control"

export default function ProductToolbar({
    sortBy,
    limit,
    currentView,
}: {
    sortBy: string
    limit: string
    currentView: "grid" | "list" | "price"
}) {
    return (
        <div className="flex items-center justify-between border-b border-ui-border-base pb-4 mb-6">
            {/* Ось твої 3 кнопки перегляду! */}
            <ViewModeControl currentView={currentView} />

            <div className="flex items-center gap-x-6">
                <SortSelect sortBy={sortBy} />
                {/* Блок з вибором кількості (12, 24, 48) */}
                <div className="hidden small:flex items-center gap-x-2">
                    <span className="text-[10px] uppercase text-ui-fg-muted font-bold font-sans">Показати:</span>
                    <select className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer py-0">
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                    </select>
                </div>
            </div>
        </div>
    )
}