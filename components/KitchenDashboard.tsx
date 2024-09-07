'use client'

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import Button from '../components/buttons/Button';

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
  margin-left: 220px;
  padding: 20px;
  max-width: 1200px;
`;

const TicketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const TicketCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
`;

const ObservationText = styled.p`
  font-style: italic;
  color: #555;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const TicketHeader = styled.h3`
  font-weight: bold;
  text-align: center;
  margin-top: 10;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const ItemList = styled.ul`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
`;

const ItemListItem = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

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
              <ObservationText key={index}>
                Observaciones para {item.name}: {item.observations}
              </ObservationText>
            )
          ))}
        </>
      );
    };
  
    return (
      <DashboardContainer>
        <h1>Dashboard de Cocina</h1>
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
            <Button onClick={handlePrint}>Imprimir Ticket</Button>
            <Button onClick={() => completeTicket(ticket.id, ticket.tableId)}>Marcar como Completado</Button>
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