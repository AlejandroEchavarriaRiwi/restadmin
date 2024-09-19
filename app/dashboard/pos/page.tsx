'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Plus, Minus } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../../../components/print/PDFprint';
import InputAlert from '@/components/alerts/successAlert';
import { HiComputerDesktop } from 'react-icons/hi2';
import { TbClipboardList } from 'react-icons/tb';

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
}

interface Order {
  items: OrderItem[];
  tableId: string;
  generalObservation: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const NavBar = styled.nav`
  background-color: #f8f9fa;
  position: relative;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;


  @media (min-width: 768px) {
    padding: 20px;

  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  padding: 5px;
  right: 10px;
  top:10px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const MenuSection = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 15px;

  @media (min-width: 768px) {
    width: 70%;
    padding: 20px;
  }
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SearchBar = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;

  @media (min-width: 768px) {
    width: 350px;
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const Button = styled.button<{ $active?: boolean; $variant?: string }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  background-color: ${props => {
    if (props.$active) return '#67b7f7';
    switch (props.$variant) {
      case 'primary': return '#67b7f7';
      case 'alert': return '#ffc107';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => props.$active || props.$variant ? 'white' : 'black'};

  &:hover {
    opacity: 0.8;
  }
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid 
#67b7f7
;
`;

const Cardscontainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MenuItemCard = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;

  @media (min-width: 768px) {
    height: 12rem;
  }
`;

const MenuItemName = styled.h3`
  font-weight: bold;
  margin: 10px 0 5px;
  font-size: 0.9em;

  @media (min-width: 768px) {
    font-size: 1em;
  }
`;

const MenuItemPrice = styled.p`
  margin: 0 0 10px;
  color: #a9903f;
  font-weight: bold;
  font-size: 1em;

  @media (min-width: 768px) {
    font-size: 1.2em;
  }
`;

const OrderSection = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: #f8f9fa;
  padding: 15px;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.$isOpen ? '-5px 0 15px rgba(0,0,0,0.1)' : 'none'};


  @media (min-width: 768px) {
    position: static;
    width: 30%;
    max-width: none;
    transform: none;
    box-shadow: none;
    border-left: 1px solid #ddd;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-weight: bold;
    font-size: 1.2rem;
    margin: 0;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const OrderItemsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
`;

const OrderItemInfo = styled.div`
  flex-grow: 1;
`;

const OrderItemName = styled.p`
  margin: 0;
  font-weight: bold;
`;

const OrderItemPrice = styled.p`
  margin: 5px 0 0;
  color: #6c757d;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1.2em;
  color: #4655c4;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const OrderItemQuantity = styled.span`
  padding: 0 10px;
  font-weight: bold;
`;

const ObservationSection = styled.div`
border-top: 2px solid 
#67b7f7
;
  margin-bottom: 15px;
`;

const ObservationLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const ObservationTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9em;
  resize: vertical;
  min-height: 80px;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const TotalSection = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 15px;
  border-top: 2px solid 
#67b7f7
;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: 
#67b7f7
;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export default function MenuOrder() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<Order>({ items: [], tableId: 'pos1', generalObservation: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

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
          items: [...prevOrder.items, { ...item, quantity: 1 }]
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

  const updateGeneralObservation = (observation: string) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      generalObservation: observation
    }));
  };

  const generateInvoiceAndSendToKitchen = async () => {
    try {
      // Send to kitchen
      const kitchenResponse = await fetch('http://localhost:8001/kitchen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!kitchenResponse.ok) {
        throw new Error(`HTTP error! status: ${kitchenResponse.status}`);
      }

      // Generate invoice
      const invoice = {
        ...order,
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

      // Generate and show PDF
      const blob = await pdf(<PDFDocument order={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      printWindow?.print();

      // Clear the order
      setOrder({ items: [], tableId: 'pos1', generalObservation: '' });

      // Show success message
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

  return (
    <Container>
      <NavBar>
        <div className="flex items-center justify-center w-full gap-2 ">
          <HiComputerDesktop className="text-[2em] text-gray-800 font-bold flex" />
          <h1 className="ml-4 text-[1.5em] text-gray-800 font-bold flex">Venta Rápida</h1>
        </div>
        <CartButton  onClick={() => setIsCartOpen(!isCartOpen)}>
          <TbClipboardList className='text-[30px] text-gray-800' />
        </CartButton>
      </NavBar>
      <Content>
        <MenuSection>
          <MenuHeader>
            <SearchBar
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        <OrderSection $isOpen={isCartOpen}>
          <OrderHeader>
            <h2>Orden actual</h2>
            <CloseButton onClick={() => setIsCartOpen(false)}>
              <X />
            </CloseButton>
          </OrderHeader>
          <OrderItemsContainer>
            {order.items.map(item => (
              <OrderItem key={item.Id}>
                <OrderItemInfo>
                  <OrderItemName>{item.Name}</OrderItemName>
                  <OrderItemPrice>${(item.Price * item.quantity)}</OrderItemPrice>
                </OrderItemInfo>
                <QuantityControl>
                  <QuantityButton onClick={() => updateItemQuantity(item.Id, -1)} >
                    -
                  </QuantityButton>
                  <OrderItemQuantity>{item.quantity}</OrderItemQuantity>
                  <QuantityButton onClick={() => updateItemQuantity(item.Id, 1)}>
                  +
                  </QuantityButton>
                </QuantityControl>
              </OrderItem>
            ))}
          </OrderItemsContainer>
          <ObservationSection>
            <ObservationLabel htmlFor="observation">Observaciones</ObservationLabel>
            <ObservationTextArea
              id="observation"
              value={order.generalObservation}
              onChange={(e) => updateGeneralObservation(e.target.value)}
              placeholder="Añade observaciones generales para tu orden..."
            />
          </ObservationSection>
          <TotalSection>
            Total: ${order.items.reduce((sum, item) => sum + item.Price * item.quantity, 0)}
          </TotalSection>
          <ActionButton
            onClick={generateInvoiceAndSendToKitchen}
            disabled={order.items.length === 0}
          >
            Facturar y Enviar a Cocina
          </ActionButton>
        </OrderSection>
      </Content>
    </Container>
  );

}