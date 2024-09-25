"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import { CheckCircle, ClipboardList, Printer, Utensils } from "lucide-react";
import { FaKitchenSet } from "react-icons/fa6";
import InputAlert from "./alerts/successAlert";
import { Order } from "@/models/order.models";

const amarillo = '#f4d87b';

const StyledNavBar = styled.nav`
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
      gap: 10px;
      margin-right: 0;
    }
  }
`;

const StyledDashboardContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const StyledTicketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const StyledTicketCard = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const StyledObservationText = styled.p`
  font-style: italic;
  color: #555;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
`;

const StyledTicketHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 1.5rem 1.5rem;
  background-color: ${amarillo};
  border-bottom: 1px solid #e2e8f0;

  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StyledItemList = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-weight: 600;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style-type: disc;
    list-style-position: inside;
    color: #718096;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
`;

const StyledItemListItem = styled.li``;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${amarillo};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f7fafc;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const StyledPrintableTicket = styled.div`
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
      const cookingOrders = data.filter(order => order.Status === 0);
      setOrders(cookingOrders);
    } catch (error) {
      await InputAlert('No se pudieron traer las ordenes', 'error')
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const completeOrder = async (order: Order) => {
    try {
      const newStatus = order.TablesId !== null ? 1 : 2;

      let updatedOrderData: any = {
        Observations: order.Observations,
        Status: newStatus,
        OrderProducts: order.Products.map(product => ({
          ProductId: product.Id,
          OrderId: order.Id,
          Quantity: product.Quantity
        }))
      };

      if (order.TablesId !== null) {
        updatedOrderData.TablesId = order.TablesId;
      }

      const response = await fetch(`https://restadmin.azurewebsites.net/api/v1/Order/${order.Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order. Status: ${response.status}`);
      }

      // Actualizar el estado local
      setOrders(orders.filter(o => o.Id !== order.Id));
    } catch (error) {
      await InputAlert('Error completando la orden', 'error')
    }
  };

  const renderObservations = (order: Order) => {
    return (
      <>
        {order.Observations && (
          <StyledObservationText>
            Observaciones generales: {order.Observations}
          </StyledObservationText>
        )}
      </>
    );
  };

  return (
    <>
      <StyledNavBar>
        <div className="flex items-center gap-2 ">
          <FaKitchenSet className="text-[2em] text-gray-800" />
          <h1 className="text-[1.5em] text-gray-800">Cocina</h1>
        </div>
      </StyledNavBar>
      <StyledDashboardContainer>
        <StyledTicketGrid>
          {orders.map((order) => (
            <StyledTicketCard key={order.Id}>
              <StyledTicketHeader>
                <Utensils className="h-5 w-5" />
                {order.TableName || (order.TablesId ? `Mesa ${order.TablesId}` : 'Pedido para llevar')}
              </StyledTicketHeader>
              <StyledItemList>
                <h3>
                  <ClipboardList className="h-5 w-5" />
                  Productos
                </h3>
                <ul>
                  {order.Products.map((item, index) => (
                    <StyledItemListItem key={index}>
                      {item.Quantity}x {item.Name}
                    </StyledItemListItem>
                  ))}
                </ul>
              </StyledItemList>
              {renderObservations(order)}
              <div className="px-6 py-4">
                <StyledButton onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" style={{ color: amarillo }} />
                  Imprimir Ticket
                </StyledButton>
                <StyledButton onClick={() => completeOrder(order)}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Marcar como Completado
                </StyledButton>
              </div>
            </StyledTicketCard>
          ))}
        </StyledTicketGrid>
        <div style={{ display: "none" }}>
          <StyledPrintableTicket ref={printRef}>
            {orders.map((order) => (
              <div key={order.Id}>
                <h2>
                  {order.TableName || (order.TablesId ? `Mesa ${order.TablesId}` : 'Pedido para llevar')}
                </h2>
                <StyledItemList>
                  {order.Products.map((item, index) => (
                    <li key={index}>
                      {item.Quantity}x {item.Name}
                    </li>
                  ))}
                </StyledItemList>
                {renderObservations(order)}
              </div>
            ))}
          </StyledPrintableTicket>
        </div>
      </StyledDashboardContainer>
    </>
  );
}