export class CategoryDto {
  id: number
  categoryName: string
  categoryUrl: string
  description?: string

  constructor(category: Partial<CategoryDto>) {
    if (!category) throw new Error('Invalid category data')
    Object.assign(this, category)
  }
}
