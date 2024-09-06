'use client'

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import Button from '../components/buttons/Button';

interface KitchenTicket {
  id: string;
  tableId: string;
  items: {
    name: string;
    quantity: number;
    observations: string;
  }[];
}

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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

const TicketHeader = styled.h3`
  margin-top: 0;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ItemListItem = styled.li`
  margin-bottom: 10px;
`;

const PrintableTicket = styled.div`
  padding: 10mm;
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
          body: JSON.stringify({ state: 'in_use' }),
        });
  
        // Refresh tickets
        fetchTickets();
      } catch (error) {
        console.error("Error completing ticket:", error);
      }
    };
  
    return (
      <DashboardContainer>
        <h1>Kitchen Dashboard</h1>
        <TicketGrid>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id}>
              <TicketHeader>Table {ticket.tableId}</TicketHeader>
              <ItemList>
                {ticket.items.map((item, index) => (
                  <ItemListItem key={index}>
                    {item.quantity}x {item.name}
                    {item.observations && <div>Note: {item.observations}</div>}
                  </ItemListItem>
                ))}
              </ItemList>
              <Button onClick={handlePrint}>Print Ticket</Button>
              <Button onClick={() => completeTicket(ticket.id, ticket.tableId)}>Mark as Complete</Button>
            </TicketCard>
          ))}
        </TicketGrid>
        <div style={{ display: 'none' }}>
          <PrintableTicket ref={printRef}>
            {tickets.map((ticket) => (
              <div key={ticket.id}>
                <h2>Table {ticket.tableId}</h2>
                <ul>
                  {ticket.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name}
                      {item.observations && <div>Note: {item.observations}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </PrintableTicket>
        </div>
      </DashboardContainer>
    );
  }