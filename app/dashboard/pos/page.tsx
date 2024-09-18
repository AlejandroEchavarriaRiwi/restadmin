'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../../../components/print/PDFprint';
import InputAlert from '@/components/alerts/successAlert';
import { HiComputerDesktop } from 'react-icons/hi2';


export interface MenuItem {
  Id: number;
  Name: string;
  Price: number;
  Cost: number;
  ImageURL: string;
  CategoryId: number;
  Category: {
    Id: number;
    Name: string;
  };
}

interface OrderItem extends MenuItem {
  quantity: number;
  observations: string;
}

interface Order {
  items: OrderItem[];
  tableId: string;
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


const Container = styled.div`
  display: flex;
  height: 100%-76px;
  overflow: hidden;
`;


const MenuSection = styled.div`
  width: 70%;
  height: 100%-76px;
  overflow-y: auto;
  padding: 15px;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  h1 {
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 1.5rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  scrollbar-width: none;
  scrollbar-color: $primary-color $secondary-color;

  &::-webkit-scrollbar{
    width: 0px;
  }

  &::-webkit-scrollbar-track{ 
    background: $primary-color;
  }

  &::-webkit-scrollbar-thumb{
    background-color: $secondary-color;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
  }

`;

const SearchBar = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 350px;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button<{ $active?: boolean; $variant?: string }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => {
    if (props.$active) return '#007bff';
    switch (props.$variant) {
      case 'primary': return '#007bff';
      case 'alert': return '#ffc107';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => props.$active || props.$variant ? 'white' : 'black'};
  &:hover {
    opacity: 0.8;
  }
`;

const OrderSection = styled.div`
  width: 30%;
  background-color: #f8f9fa;
  height: 100%-76px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  
  h2 {
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 1.5rem;
  }
`;

const OrderItemsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
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
`;

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

const MenuItemName = styled.h3`
  font-weight: bold;
  margin: 0 0 5px 0;
`;

const MenuItemPrice = styled.p`
  margin: 0;
  color: #a9903f;
  font-weight: bold;
  font-size: 20px;
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Product');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); 
      setMenuItems(data);

      // Extraer categorías únicas
      const categorySet = new Set<string>();
      data.forEach((item: MenuItem) => categorySet.add(item.Category.Name));
      const uniqueCategories = ['Todas', ...Array.from(categorySet)];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    setOrder(prevOrder => {
      const existingItem = prevOrder.items.find(orderItem => orderItem.Id === item.Id);
      if (existingItem) {
        return {
          ...prevOrder,
          items: prevOrder.items.map(orderItem =>
            orderItem.Id === item.Id
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

  const updateItemQuantity = (itemId: number, change: number) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      items: prevOrder.items.map(item =>
        item.Id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  };

  const updateObservations = (itemId: number, observations: string) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      items: prevOrder.items.map(item =>
        item.Id === itemId ? { ...item, observations } : item
      )
    }));
  };

  const generateInvoiceAndSendToKitchen = async () => {
    try {
      // Primero, enviar a cocina
      const kitchenResponse = await fetch('http://localhost:8001/kitchen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, tableId: `${order.tableId}` }),
      });

      if (!kitchenResponse.ok) {
        throw new Error(`HTTP error! status: ${kitchenResponse.status}`);
      }

      // Luego, generar la factura
      const invoice = {
        ...order,
        tableId: `${order.tableId}`,
        total: order.items.reduce((sum, item) => sum + item.Price * item.quantity, 0),
        date: new Date().toISOString()
      };

      const invoiceResponse = await fetch('http://localhost:8001/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoice),
      });

      if (!invoiceResponse.ok) {
        throw new Error(`HTTP error! status: ${invoiceResponse.status}`);
      }

      // Generar y mostrar el PDF
      const blob = await pdf(<PDFDocument order={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      printWindow?.print();

      // Limpiar la orden
      setOrder({ items: [], tableId: 'pos1' });

      // Mostrar mensaje de éxito
      await InputAlert('Orden enviada a cocina y facturada correctamente!', 'success');
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert('Error al procesar la orden. Por favor, intente de nuevo.');
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.Category.Name === selectedCategory;
    const matchesSearch = item.Name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.Category.Name]) {
      acc[item.Category.Name] = [];
    }
    acc[item.Category.Name].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const totalAmount = order.items.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  return (
    <><NavBar>
      <div className="flex items-center ">
        <HiComputerDesktop className="text-3xl text-gray-800" />
        <h1 className="ml-4 text-gray-800">Gestión de productos</h1>
      </div>
    </NavBar><Container>
        <MenuSection>
          <MenuHeader>
            <SearchBar
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </MenuHeader>
          <CategoryButtons>
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                $active={selectedCategory === category}
              >
                {category}
              </Button>
            ))}
          </CategoryButtons>
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              <Cardscontainer>
                {items.map(item => (
                  <MenuItemCard key={item.Id} onClick={() => addToOrder(item)}>
                    <MenuItemImage src={item.ImageURL} alt={item.Name} />
                    <MenuItemName>{item.Name}</MenuItemName>
                    <MenuItemPrice>${item.Price}</MenuItemPrice>
                  </MenuItemCard>
                ))}
              </Cardscontainer>
            </div>
          ))}
        </MenuSection>
        <OrderSection>
          <h2>Orden actual</h2>
          <OrderItemsContainer>
            {order.items.map(item => (
              <OrderItem key={item.Id}>
                <OrderItemName>{item.Name}</OrderItemName>
                <p>${(item.Price * item.quantity)}</p>
                <QuantityControl>
                  <QuantityButton onClick={() => updateItemQuantity(item.Id, -1)} $variant="primary">-</QuantityButton>
                  <OrderItemQuantity>{item.quantity}</OrderItemQuantity>
                  <QuantityButton onClick={() => updateItemQuantity(item.Id, 1)} $variant="primary">+</QuantityButton>
                </QuantityControl>
                <TextArea
                  value={item.observations}
                  onChange={(e) => updateObservations(item.Id, e.target.value)}
                  placeholder="Observaciones..." />
              </OrderItem>
            ))}
          </OrderItemsContainer>
          <TotalSection>
            Total: ${totalAmount}
          </TotalSection>
          <div className='flex gap-3 w-full justify-around'>
            <Button
              onClick={generateInvoiceAndSendToKitchen}
              disabled={order.items.length === 0}
              $variant="primary"
            >
              Facturar y Enviar a Cocina
            </Button>
          </div>
        </OrderSection>
      </Container></>
  );
}