'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { CheckCircle, ClipboardList, Printer, Utensils } from 'lucide-react';

interface KitchenTicket {
  id: string;
  tableId: string;
  items: {
    id: string;
    name: string;
    price: number;
    cost: number;
    imageUrl: string;
    category: string;
    quantity: number;
    observations?: string;
  }[];
  observations: string;
}

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
)
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
)

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
)

const ItemListItem: React.FC<{ children: ReactNode }> = ({ children }) => (
  <li>{children}</li>
)

const Button: React.FC<{ onClick: () => void; children: ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 border border-amarillo rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center w-full mb-2"
  >
    {children}
  </button>
)



const PrintableTicket = styled.div`
  padding: 10mm;
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 10px;
  h2{
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
      const response = await fetch('http://localhost:8001/kitchen');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Could not fetch tickets:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const completeTicket = async (ticketId: string, tableId: string) => {
    try {
      // Remove ticket from kitchen
      await fetch(`http://localhost:8001/kitchen/${ticketId}`, {
        method: 'DELETE',
      });

      // Update table state
      await fetch(`http://localhost:8001/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: 'Ocupada' }),
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
        {ticket.observations && (
          <ObservationText>Observaciones generales: {ticket.observations}</ObservationText>
        )}
        {ticket.items.map((item, index) => (
          item.observations && (
            <ObservationText  key={index}>
              Observaciones para {item.name}: {item.observations}
            </ObservationText>
          )
        ))}
      </>
    );
  };

  return (
    <DashboardContainer>
      <div className="bg-primary text-primary-foreground py-2 px-2 mb-5 rounded-xl">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Cocina</h1>
        </div>
      </div>
      <TicketGrid>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id}>
            <TicketHeader>Mesa {ticket.tableId}</TicketHeader>
            <ItemList>
              {ticket.items.map((item, index) => (
                <ItemListItem key={index}>
                  {item.quantity}x {item.name}
                </ItemListItem>
              ))}
            </ItemList>
            {renderObservations(ticket)}
            <div className="px-6 py-4">
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2 text-amarillo" />
                Imprimir Ticket
              </Button>
              <Button onClick={() => completeTicket(ticket.id, ticket.tableId)}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Marcar como Completado
              </Button>
            </div>
          </TicketCard>
        ))}
      </TicketGrid>
      <div style={{ display: 'none' }}>
        <PrintableTicket ref={printRef}>
          {tickets.map((ticket) => (
            <div key={ticket.id}>
              <h2>Mesa {ticket.tableId}</h2>
              <ItemList>
                {ticket.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ItemList>
              {renderObservations(ticket)}
            </div>
          ))}
        </PrintableTicket>
      </div>
    </DashboardContainer>
  );
}