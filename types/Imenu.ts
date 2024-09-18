import { Category } from "@/components/buttons/selectCategoriesButton";

export interface Product {
    Id: number;
    Name: string;
    Price: number;
    Cost: number;
    ImageURL: string;
    CategoryId: number;
    Category: {
      Id: number;
      Name: string;
    };
  }