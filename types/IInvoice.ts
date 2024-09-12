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