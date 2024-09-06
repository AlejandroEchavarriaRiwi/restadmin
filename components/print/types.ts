export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
  }
  
  export interface OrderItem extends MenuItem {
    quantity: number;
    observations: string;
  }
  
  export interface Order {
    items: OrderItem[];
    tableId: string;
  }