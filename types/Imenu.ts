import { Category } from "@/components/buttons/selectCategoriesButton";

export interface Product {
    id: number;
    name: string;
    price: number | string;
    cost: number | string;
    imageURL: string;
    category: Category;
}