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
interface Company {
  id: string;
  name: string;
  email: string;
  nit: string;
  phone: string;
  adress: string;
  logoUrl: string;
}
interface Order {
  clientId: string;
  items: OrderItem[];
  deliveryFee: number;
}

const ModuleContainer = styled.div`
  margin-left: 220px;
  padding: 20px;
  display: flex;
  height: calc(100vh - 40px);
`;

const LeftColumn = styled.div`
  width: 60%;
  padding-right: 20px;
  overflow-y: auto;
`;

const RightColumn = styled.div`
  width: 40%;
  padding-left: 20px;
  border-left: 1px solid #ddd;
  overflow-y: auto;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const MenuItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
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

const SearchResultsContainer = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const SearchResultItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NoResultsMessage = styled.div`
  padding: 10px;
  color: #666;
`;

const DeliveryFeeInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const PrintableTicket = styled.div`
  display: none;
  @media print {
    display: block;
    width: 80mm;
    padding: 10mm;
    font-family: Arial, sans-serif;
  }
`;

const CompanyLogo = styled.img`
  width: 60mm;
  margin-bottom: 5mm;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export default function DeliveryModule() {
  const [client, setClient] = useState<Client>({ name: '', phone: '', address: '' });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<Order>({ clientId: '', items: [], deliveryFee: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchAllClients();
    fetchCompanyInfo();
    setCurrentDate(new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filteredClients = allClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
      setSearchResults(filteredClients);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allClients]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8001/menu');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      setCategories(['Todos', ...uniqueCategories]);
      setSelectedCategory('Todos');
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('http://localhost:8001/company');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Company[] = await response.json();
      if (data.length > 0) {
        setCompany(data[0]);
      }
    } catch (error) {
      console.error("Could not fetch company info:", error);
    }
  };

  const fetchAllClients = async () => {
    try {
      const response = await fetch('http://localhost:8001/clients');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client[] = await response.json();
      setAllClients(data);
    } catch (error) {
      console.error("Could not fetch clients:", error);
    }
  };

  const selectClient = (selectedClient: Client) => {
    setClient(selectedClient);
    setOrder(prev => ({ ...prev, clientId: selectedClient.id || '' }));
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleNewClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client.name || !client.phone || !client.address) {
      alert('Por favor, complete todos los campos del cliente');
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client = await response.json();
      setClient(data);
      setOrder(prev => ({ ...prev, clientId: data.id || '' }));
      setShowNewClientModal(false);
      alert('Cliente registrado exitosamente!');
    } catch (error) {
      console.error("No se pudo registrar el cliente:", error);
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


  const updateItemQuantity = (itemId: string, change: number) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  };

  const filteredMenuItems = selectedCategory === 'Todos'
  ? menuItems
  : menuItems.filter(item => item.category === selectedCategory);

const searchFilteredMenuItems = filteredMenuItems.filter(item =>
  item.name.toLowerCase().includes(menuSearchTerm.toLowerCase())
);

const handlePrint = useReactToPrint({
  content: () => printRef.current,
  onBeforeGetContent: () => {
    setCurrentDate(new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
  },
});

  const handleDeliveryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fee = parseFloat(e.target.value) || 0;
    setOrder(prev => ({ ...prev, deliveryFee: fee }));
  };

  const calculateTotal = () => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return itemsTotal + order.deliveryFee;
  };

  const sendToKitchenAndInvoice = async () => {
    try {
      // Send to kitchen
      await fetch('http://localhost:8001/kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      // Create invoice
      await fetch('http://localhost:8001/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order,
          total: calculateTotal(),
          date: new Date().toISOString()
        }),
      });

      // Print ticket
      handlePrint();

      // Reset order
      setOrder({ clientId: '', items: [], deliveryFee: 0 });
      setClient({ name: '', phone: '', address: '' });
      setSearchTerm('');

      alert('Pedido enviado a cocina y factura creada!');
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
    }
  };

  return (
    <ModuleContainer>
      <LeftColumn>
        <h1>Módulo de Domicilios</h1>
        
        <SearchContainer>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por nombre o celular"
          />
          <Button onClick={() => setShowNewClientModal(true)}>Nuevo cliente</Button>

          {searchResults.length > 0 && (
            <SearchResultsContainer>
              {searchResults.map((result) => (
                <SearchResultItem key={result.id} onClick={() => selectClient(result)}>
                  {result.name} - {result.phone}
                </SearchResultItem>
              ))}
            </SearchResultsContainer>
          )}

          {searchTerm.length >= 3 && searchResults.length === 0 && (
            <NoResultsMessage>
              No se encontraron clientes. ¿Desea registrar un nuevo cliente?
              <Button onClick={() => setShowNewClientModal(true)}>Registrar nuevo cliente</Button>
            </NoResultsMessage>
          )}
        </SearchContainer>

        <MenuSection>
          <h2>Menú</h2>
          <Input
            value={menuSearchTerm}
            onChange={(e) => setMenuSearchTerm(e.target.value)}
            placeholder="Buscar en el menú"
          />
          <CategoryTabs>
            {categories.map(category => (
              <CategoryTab
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>
          <MenuItemGrid>
            {searchFilteredMenuItems.map(item => (
              <MenuItem key={item.id} onClick={() => addToOrder(item)}>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
              </MenuItem>
            ))}
          </MenuItemGrid>
        </MenuSection>
      </LeftColumn>

      <RightColumn>
        {client.id && (
          <div>
            <h2>Cliente seleccionado</h2>
            <p>Nombre: {client.name}</p>
            <p>Teléfono: {client.phone}</p>
            <p>Dirección: {client.address}</p>
          </div>
        )}

        <OrderSection>
          <h2>Pedido actual</h2>
          {order.items.map((item) => (
            <div key={item.id}>
              {item.name} - ${item.price} x {item.quantity}
              <QuantityControl>
                <QuantityButton onClick={() => updateItemQuantity(item.id, -1)}>-</QuantityButton>
                <span>{item.quantity}</span>
                <QuantityButton onClick={() => updateItemQuantity(item.id, 1)}>+</QuantityButton>
              </QuantityControl>
            </div>
          ))}
          <h3>Valor de domicilio:</h3>
          <DeliveryFeeInput
            type="number"
            value={order.deliveryFee}
            onChange={handleDeliveryFeeChange}
            placeholder="Costo de domicilio"
          />
          <p>Subtotal: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
          <p>Valor domicilio: ${order.deliveryFee}</p>
          <p>Total: ${calculateTotal()}</p>
          <Button onClick={sendToKitchenAndInvoice}>Enviar a cocina y Facturar</Button>
        </OrderSection>
      </RightColumn>

      {showNewClientModal && (
        <Modal onClick={() => setShowNewClientModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleNewClientSubmit}>
              <Input
                name="name"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="Nombre"
                required
              />
              <Input
                name="phone"
                value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                placeholder="Teléfono"
                required
              />
              <Input
                name="address"
                value={client.address}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                placeholder="Dirección"
                required
              />
              <Button type="submit">Registrar Cliente</Button>
            </form>
          </ModalContent>
        </Modal>
      )}
      
      <PrintableTicket ref={printRef}>
        {company && (
          <>
            <CompanyLogo src={company.logoUrl} alt={company.name} />
            <h2>{company.name}</h2>
            <p>NIT: {company.nit}</p>
            <p>Dirección: {company.adress}</p>
            <p>Teléfono: {company.phone}</p>
            <p>Email: {company.email}</p>
          </>
        )}
        <h3>Domicilios</h3>
        <p>Cliente: {client.name}</p>
        <p>Celular: {client.phone}</p>
        <p>Dirección: {client.address}</p>
        <h4>Productos:</h4>
        {order.items.map((item, index) => (
          <p key={index}>
            {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
          </p>
        ))}
        <p>Subtotal: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
        <p>Valor domicilio: ${order.deliveryFee}</p>
        <p><strong>Total: ${calculateTotal()}</strong></p>
        <p>Fecha: {currentDate}</p>
      </PrintableTicket>
    </ModuleContainer>
  );
}