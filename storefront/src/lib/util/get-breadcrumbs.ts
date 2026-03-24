export const getCategoryBreadcrumbs = (category: any) => {
  const breadcrumbs = []
  let current = category

  // Проходимо вгору по дереву, поки є батьківські категорії
  while (current) {
    breadcrumbs.unshift({
      name: current.name,
      handle: current.handle,
    })
    current = current.parent_category
  }

  return breadcrumbs
}