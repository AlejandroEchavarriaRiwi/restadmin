export interface Table {
    id: string;
    name: string;
    state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar';
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface PreInvoice {
    id: string;
    tableId: string;
    items: OrderItem[];
    observations: string;
    total: number;
    date: string;
}

export interface Product {
    Id: number;
    Name: string;
    Price: number;
    Quantity: number;
    ImageURL: string;
    Category: {
        Id: number;
        Name: string;
    };
    Status: number;
}

export interface Order {
    Id: number;
    TablesId: number | null;
    TableName: string | null;
    Status: number;
    Products: Product[];
    Observations: string;
}

export interface Company {
    Id: number;
    Name: string;
    Email: string;
    Nit: string;
    Phone: string;
    Address: string;
    LogoURL: string;
}
