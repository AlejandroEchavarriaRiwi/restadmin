export interface Order {
    Id: number;
    Observations: string;
    Status: number;
    TablesId: number | null;
    TableName: string | null;
    Products: {
        Id: number;
        Name: string;
        Quantity: number;
    }[];
}