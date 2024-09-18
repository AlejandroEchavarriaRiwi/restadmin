export interface MenuItem {
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

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  items: OrderItem[];
  tableId: string;
  generalObservation: string;
}
