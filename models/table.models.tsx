export interface Table {
    Id: number;
    Name: string;
    State: string;
  }
export interface Category {
    Id: number;
    Name: string;
  }
  
export  interface Product {
    Id: number;
    Name: string;
    Price: number;
    Quantity: number;
    ImageURL: string;
    Category: Category;
    Status: number;
  }
  
export interface Order {
    Id: number;
    Observations: string;
    Status: number;
    TablesId: number | null;
    TableName: string | null;
    Products: Product[];
  }