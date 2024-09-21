export interface Product {
  Id: number;
  Name: string;
  Cost: number;
  Price: number;
  ImageURL: string;
  Category: {
      Id: number;
      Name: string;
  };
  CategoryId: number;
  Status: number;
}