export class CategoryDto {
    id: number;
    categoryName: string;
    categoryUrl: string;
    description?: string;

    constructor(category: Partial<CategoryDto>) {
        Object.assign(this, category);
    }
}
