"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import { CheckCircle, ClipboardList, Printer, Utensils } from "lucide-react";
import { FaKitchenSet } from "react-icons/fa6";

interface KitchenTicket {
  Id: number;
  OrderId: number;
  Order: {
    Observations: string;
    TablesId: number;
    Products: {
      Name: string;
      Quantity: number;
    }[];
  };
  TableName?: string;
}

interface Order {
  Id: number;
  TableName: string;
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
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Kitchen");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: KitchenTicket[] = await response.json();
      
      // Fetch order details for each ticket
      const ticketsWithTableNames = await Promise.all(
        data.map(async (ticket) => {
          const orderResponse = await fetch(`https://restadmin.azurewebsites.net/api/v1/Order/${ticket.OrderId}`);
          if (orderResponse.ok) {
            const orderData: Order = await orderResponse.json();
            return { ...ticket, TableName: orderData.TableName };
          }
          return ticket;
        })
      );

      setTickets(ticketsWithTableNames);
    } catch (error) {
      console.error("Could not fetch tickets:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const completeTicket = async (ticketId: number, tableId: number, tableName: string) => {
    try {
      // Remove ticket from kitchen
      await fetch(`https://restadmin.azurewebsites.net/api/v1/Kitchen/${ticketId}`, {
        method: "DELETE",
      });

      // Update table state
      await fetch(`https://restadmin.azurewebsites.net/api/v1/Tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: tableId, Name: tableName, State: "Ocupada" }),
      });

      // Refresh tickets
      fetchTickets();
    } catch (error) {
      console.error("Error completing ticket:", error);
    }
  };

  const renderObservations = (ticket: KitchenTicket) => {
    return (
      <>
        {ticket.Order.Observations && (
          <ObservationText>
            Observaciones generales: {ticket.Order.Observations}
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
            <h1 className="text-2xl font-bold mb-4 sm:mb-0"></h1>
          </div>
        </div>
        <TicketGrid>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.Id}>
              <TicketHeader>{ticket.TableName || `Mesa ${ticket.Order.TablesId}`}</TicketHeader>
              <ItemList>
                {ticket.Order.Products.map((item, index) => (
                  <ItemListItem key={index}>
                    {item.Quantity}x {item.Name}
                  </ItemListItem>
                ))}
              </ItemList>
              {renderObservations(ticket)}
              <div className="px-6 py-4">
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2 text-amarillo" />
                  Imprimir Ticket
                </Button>
                <Button
                  onClick={() => completeTicket(ticket.Id, ticket.Order.TablesId, ticket.TableName || `Mesa ${ticket.Order.TablesId}`)}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Marcar como Completado
                </Button>
              </div>
            </TicketCard>
          ))}
        </TicketGrid>
        <div style={{ display: "none" }}>
          <PrintableTicket ref={printRef}>
            {tickets.map((ticket) => (
              <div key={ticket.Id}>
                <h2>{ticket.TableName || `Mesa ${ticket.Order.TablesId}`}</h2>
                <ItemList>
                  {ticket.Order.Products.map((item, index) => (
                    <li key={index}>
                      {item.Quantity}x {item.Name}
                    </li>
                  ))}
                </ItemList>
                {renderObservations(ticket)}
              </div>
            ))}
          </PrintableTicket>
        </div>
      </DashboardContainer>
    </>
  );
}