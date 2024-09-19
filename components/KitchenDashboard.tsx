"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import { CheckCircle, ClipboardList, Printer, Utensils } from "lucide-react";
import { FaKitchenSet } from "react-icons/fa6";

interface Order {
  Id: number;
  Observations: string;
  Status: number;
  TablesId: number | null;
  TableName: string | null;
  Products: {
    Name: string;
    Quantity: number;
  }[];
}


const NavBar = styled.nav`
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 1.5em;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    h1 {
      margin-left: 0;
    }
    div {
      flex-direction: row;
      margin-bottom: 10px;
      gap: 10px;
      margin-right: 0;
    }
  }
`;

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const TicketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const TicketCard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4">
    {children}
  </div>
);
const ObservationText = styled.p`
  font-style: italic;
  color: #555;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
`;

const TicketHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="px-6 py-4  bg-amarillo border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      <Utensils className="h-5 w-5" />
      <span>{children}</span>
    </h2>
  </div>
);

const ItemList: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6 flex flex-col items-center">
    <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
      <ClipboardList className="h-5 w-5" />
      Productos
    </h3>
    <ul className="list-disc flex flex-col items-center list-inside space-y-1 text-gray-600">
      {children}
    </ul>
  </div>
);

const ItemListItem: React.FC<{ children: ReactNode }> = ({ children }) => (
  <li>{children}</li>
);

const Button: React.FC<{ onClick: () => void; children: ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className="px-4 py-2 border border-amarillo rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center w-full mb-2"
  >
    {children}
  </button>
);

const PrintableTicket = styled.div`
  padding: 10mm;
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 10px;
  h2 {
    font-size: large;
    font-weight: bold;
  }
  @media print {
    width: 80mm;
    padding: 0;
  }
`;

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Order");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      // Filtrar órdenes con Status 0 (cocinando)
      const cookingOrders = data.filter(order => order.Status === 0);
      setOrders(cookingOrders);
    } catch (error) {
      console.error("Could not fetch orders:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const completeOrder = async (order: Order) => {
    try {
      const newStatus = order.TablesId ? 1 : 2; // 1 para órdenes de mesa, 2 para órdenes sin mesa (por facturar)
      const updatedOrder = { ...order, Status: newStatus };

      const response = await fetch(`https://restadmin.azurewebsites.net/api/v1/Order/${order.Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order. Status: ${response.status}`);
      }

      // Actualizar el estado local
      setOrders(orders.filter(o => o.Id !== order.Id));
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const renderObservations = (order: Order) => {
    return (
      <>
        {order.Observations && (
          <ObservationText>
            Observaciones generales: {order.Observations}
          </ObservationText>
        )}
      </>
    );
  };

  return (
    <>
      <NavBar>
        <div className="flex items-center ">
          <FaKitchenSet className="text-3xl text-gray-800" />
          <h1 className="ml-4 text-gray-800">Cocina</h1>
        </div>
      </NavBar>
      <DashboardContainer>
        <div className="bg-primary text-primary-foreground py-2 px-2 mb-5 rounded-xl">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0">Órdenes en Preparación</h1>
          </div>
        </div>
        <TicketGrid>
          {orders.map((order) => (
            <TicketCard key={order.Id}>
              <TicketHeader>
                {order.TableName || (order.TablesId ? `Mesa ${order.TablesId}` : 'Pedido para llevar')}
              </TicketHeader>
              <ItemList>
                {order.Products.map((item, index) => (
                  <ItemListItem key={index}>
                    {item.Quantity}x {item.Name}
                  </ItemListItem>
                ))}
              </ItemList>
              {renderObservations(order)}
              <div className="px-6 py-4">
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2 text-amarillo" />
                  Imprimir Ticket
                </Button>
                <Button onClick={() => completeOrder(order)}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Marcar como Completado
                </Button>
              </div>
            </TicketCard>
          ))}
        </TicketGrid>
        <div style={{ display: "none" }}>
          <PrintableTicket ref={printRef}>
            {orders.map((order) => (
              <div key={order.Id}>
                <h2>
                  {order.TableName || (order.TablesId ? `Mesa ${order.TablesId}` : 'Pedido para llevar')}
                </h2>
                <ItemList>
                  {order.Products.map((item, index) => (
                    <li key={index}>
                      {item.Quantity}x {item.Name}
                    </li>
                  ))}
                </ItemList>
                {renderObservations(order)}
              </div>
            ))}
          </PrintableTicket>
        </div>
      </DashboardContainer>
    </>
  );
}