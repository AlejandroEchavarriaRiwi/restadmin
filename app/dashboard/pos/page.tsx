'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../../components/buttons/Button';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../../../components/print/PDFprint';
import InputAlert from '@/components/alerts/successAlert';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  observations: string;
}

interface Order {
  items: OrderItem[];
  tableId: string;
}

const Container = styled.div`
  margin-left: 220px;
  display: flex;
  width: 100% - 230px;
  gap: 20px;
`;

const MenuSection = styled.div`
  width: 70%;
  overflow-y: auto;
  padding: 15px;
  max-height: calc(100vh - 40px);

  h1 {
    margin-left: 10px;
    font-weight: bold;
    font-size: 1.5rem; // Ajustado a un tamaño más razonable
  }
`;

const OrderSection = styled.div`
  width: 30%;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 100vh;
  overflow-y: auto;
  h2 {
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 1.5rem; // Ajustado a un tamaño más razonable
  }
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #007bff;
`;
const Cardscontainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`
const MenuItemCard = styled.div`
    width: 30%;
    height: auto;
    display: flex;
    flex-direction: column;
    text-align: center;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
`;

const MenuItemInfo = styled.div`
  flex-grow: 1;
`;

const MenuItemName = styled.h3`
  font-weight: bold;
  margin: 0 0 5px 0;
`;

const MenuItemPrice = styled.p`
  margin: 0;
  color: #28a745;
  font-weight: bold;
`;

const OrderItem = styled.div`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const QuantityButton = styled(Button)`
width: 40px;
  padding: 2px 8px;
  margin: 0 5px;
`;

const OrderItemName = styled.p`
  margin: 0;
  font-weight: bold;
`;

const OrderItemQuantity = styled.span`
  background-color: #4655c4;
  color: white;
  padding: 2px 0px;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 40px;
  border-radius: 4px;

`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9em;
`;

const TotalSection = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: right;
`;

export default function MenuOrder() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<Order>({ items: [], tableId: 'pos1' });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8001/menu');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    setOrder(prevOrder => {
      const existingItem = prevOrder.items.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return {
          ...prevOrder,
          items: prevOrder.items.map(orderItem => 
            orderItem.id === item.id 
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          )
        };
      } else {
        return {
          ...prevOrder,
          items: [...prevOrder.items, { ...item, quantity: 1, observations: '' }]
        };
      }
    });
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      items: prevOrder.items.map(item => 
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  };



  const updateObservations = (itemId: string, observations: string) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      items: prevOrder.items.map(item => 
        item.id === itemId ? { ...item, observations } : item
      )
    }));
  };

  const sendToKitchen = async () => {
    try {
      const response = await fetch('http://localhost:8001/kitchen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, tableId: `${order.tableId}` }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await InputAlert('Enviado a cocina correctamente!', 'success');
      // You might want to clear the order or update its status here
    } catch (error) {
      console.error("Could not send order to kitchen:", error);
      alert('Failed to send order to kitchen');
    }
  };

  const generateInvoice = async () => {
    try {
      const invoice = {
        ...order,
        tableId: `${order.tableId}`,
        total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toISOString()
      };

      const response = await fetch('http://localhost:8001/factura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Generar e imprimir el PDF
      const blob = await pdf(<PDFDocument order={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      printWindow?.print();

      // Limpiar la orden actual
      setOrder({ items: [], tableId: 'pos1' });
    } catch (error) {
      console.error("Could not generate invoice:", error);
      alert('Failed to generate invoice');
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container>
      <MenuSection>
        <h1>Menu</h1>
        {Object.entries(groupedMenuItems).map(([category, items]) => (
          <div key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <Cardscontainer>
              {items.map(item => (
                <MenuItemCard key={item.id} onClick={() => addToOrder(item)}>
                  <MenuItemImage src={item.imageUrl} alt={item.name} />
                  <MenuItemName>{item.name}</MenuItemName>
                  <MenuItemPrice>${item.price}</MenuItemPrice>
                </MenuItemCard>
              ))}
            </Cardscontainer>
          </div>
        ))}
      </MenuSection>
      <OrderSection>
        <h2>Orden actual</h2>
        {order.items.map(item => (
          <OrderItem key={item.id}>
            <OrderItemName>{item.name}</OrderItemName>
            <p>${(item.price * item.quantity)}</p>
            <QuantityControl>
              <QuantityButton onClick={() => updateItemQuantity(item.id, -1)} $variant="primary">-</QuantityButton>
              <OrderItemQuantity>{item.quantity}</OrderItemQuantity>
              <QuantityButton onClick={() => updateItemQuantity(item.id, 1)} $variant="primary">+</QuantityButton>
            </QuantityControl>
            <TextArea
              value={item.observations}
              onChange={(e) => updateObservations(item.id, e.target.value)}
              placeholder="Observaciones..."
            />
          </OrderItem>
        ))}
        <TotalSection>
          Total: ${totalAmount}
        </TotalSection>
        <Button onClick={sendToKitchen} disabled={order.items.length === 0} $variant="alert">Enviar a cocina</Button>
        <Button onClick={generateInvoice} disabled={order.items.length === 0} $variant="primary">Facturar e Imprimir</Button>
      </OrderSection>
    </Container>
  );
}
