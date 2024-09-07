'use client'

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import Button from '../components/buttons/Button';

interface Client {
  id?: string;
  name: string;
  phone: string;
  address: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  observations: string;
}

interface Order {
  clientId: string;
  items: OrderItem[];
}

const ModuleContainer = styled.div`
  margin-left: 220px;
  padding: 20px;
  max-width: 1200px;
`;

const FormContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;


const MenuSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const MenuItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const OrderSection = styled.div`
  margin-top: 20px;
`;

const PrintableTicket = styled.div`
  display: none;
  @media print {
    display: block;
    width: 80mm;
  }
`;

export default function DeliveryModule() {
    const [client, setClient] = useState<Client>({ name: '', phone: '', address: '' });
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [order, setOrder] = useState<Order>({ clientId: '', items: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Client[]>([]);
    const printRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      fetchMenuItems();
    }, []);
  
    const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8001/menu');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const searchClients = async () => {
    try {
      const response = await fetch(`http://localhost:8001/clients?q=${searchTerm}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Could not search clients:", error);
    }
  };

  const selectClient = (selectedClient: Client) => {
    setClient(selectedClient);
    setOrder(prev => ({ ...prev, clientId: selectedClient.id || '' }));
    setSearchResults([]);
    setSearchTerm('');
  };

  const registerClient = async () => {
    if (!client.name || !client.phone || !client.address) {
      alert('Please fill all client fields');
      return;
    }

    try {
      // Check if client already exists
      const checkResponse = await fetch(`http://localhost:8001/clients?phone=${client.phone}`);
      const existingClients = await checkResponse.json();

      if (existingClients.length > 0) {
        alert('A client with this phone number already exists');
        return;
      }

      const response = await fetch('http://localhost:8001/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrder(prev => ({ ...prev, clientId: data.id }));
      alert('Client registered successfully!');
    } catch (error) {
      console.error("Could not register client:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    setOrder(prev => {
      const existingItem = prev.items.find(i => i.id === item.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1, observations: '' }]
        };
      }
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const sendToKitchenAndInvoice = async () => {
    try {
      // Send to kitchen
      await fetch('http://localhost:8001/kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      // Create invoice
      await fetch('http://localhost:8001/factura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order,
          total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          date: new Date().toISOString()
        }),
      });

      // Print ticket
      handlePrint();

      // Reset order
      setOrder({ clientId: '', items: [] });
      setClient({ name: '', phone: '', address: '' });

      alert('Order sent to kitchen and invoice created!');
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
    <ModuleContainer>
      <h1>Delivery Module</h1>
      
      <SearchContainer>
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search client by name or phone"
        />
        <Button onClick={searchClients}>Search</Button>
        {searchResults.map((result) => (
          <div key={result.id} onClick={() => selectClient(result)}>
            {result.name} - {result.phone}
          </div>
        ))}
      </SearchContainer>

      <FormContainer>
        <h2>Client Information</h2>
        <Input 
          name="name" 
          value={client.name} 
          onChange={handleClientChange} 
          placeholder="Name" 
        />
        <Input 
          name="phone" 
          value={client.phone} 
          onChange={handleClientChange} 
          placeholder="Phone" 
        />
        <Input 
          name="address" 
          value={client.address} 
          onChange={handleClientChange} 
          placeholder="Address" 
        />
        <Button onClick={registerClient}>Register Client</Button>
      </FormContainer>

      <MenuSection>
        <h2>Menu</h2>
        {menuItems.map(item => (
          <MenuItem key={item.id} onClick={() => addToOrder(item)}>
            <h3>{item.name}</h3>
            <p>${item.price}</p>
          </MenuItem>
        ))}
      </MenuSection>

      <OrderSection>
        <h2>Current Order</h2>
        {order.items.map((item, index) => (
          <div key={index}>
            {item.name} - ${item.price} x {item.quantity}
          </div>
        ))}
        <Button onClick={sendToKitchenAndInvoice}>Send to Kitchen and Invoice</Button>
      </OrderSection>

      <PrintableTicket ref={printRef}>
        <h2>Domicilios</h2>
        <p>Cliente: {client.name}</p>
        <p>Celular: {client.phone}</p>
        <p>Dirección: {client.address}</p>
        <h3>Productos:</h3>
        {order.items.map((item, index) => (
          <p key={index}>
            {item.name} - ${item.price} x {item.quantity}
          </p>
        ))}
        <p>Total: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
      </PrintableTicket>
    </ModuleContainer>
  );
}