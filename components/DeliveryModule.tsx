"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import Button from "../components/buttons/Button";

interface Client {
  id?: string;
  name: string;
  phone: string;
  address: string;
}
interface MenuItem {
  imageUrl: string | undefined;
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
  display: flex;
  flex-direction: column;
  width: 100%;

  h1 {
    position: fixed;
    overflow-y: hidden;
    opacity: 90%;
    width: 100%;
    padding: 20px;
    font-size: 1.5em;
    font-weight: bold;
    background-color: #f8f9fa;
  }
`;
const DeliveryContainer = styled.div`
  display: flex;
  margin-top: 80px;
  height: 100%;
`;
const LeftColumn = styled.div`
  width: 60%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
`;
const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  height: 70%;
`
const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 30%;
  h3{

  }
  &button {
    margin: 30px;
    justify-self: end;
    align-self: center;
  }
`;

const RightColumn = styled.div`
  position: relative;
  width: 40%;
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  border: 1px solid #ddd;
`;

const SearchContainer = styled.div`
  div {
    display: flex;
    justify-content: space-between;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e8e8e9;
  border-radius: 5px;
  &:focus {
    border: 2px solid #4655c4;
    outline: none;
  }
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  h2 {
    border-top: 1px solid #e8e8e9;
    padding: 20px 0px;
    font-weight: bold;
    font-size: 1.3em;
    margin-top: 20px;
  }
  input {
    margin-bottom: 10px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#4655c4" : "#f8f9fa")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background-color: ${(props) => (props.active ? "#4655c4" : "#e9ecef")};
  }
`;

const MenuItemGrid = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

const MenuItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  img {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const OrderSection = styled.div`
  height: 100%;
`;

const SearchResultsContainer = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  max-height: 200px;
  overflow-y: auto;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SearchResultItem = styled.div`
  padding: 10px;
`;

const NoResultsMessage = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: #666;
`;

const DeliveryFeeInput = styled.input`
  position: relative;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  button {
    position: absolute;
    bottom: 0;
  }
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
  const [client, setClient] = useState<Client>({
    name: "",
    phone: "",
    address: "",
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<Order>({
    clientId: "",
    items: [],
    deliveryFee: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchAllClients();
    fetchCompanyInfo();
    setCurrentDate(
      new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
    );
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filteredClients = allClients.filter(
        (client) =>
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
      const response = await fetch("http://localhost:8001/menu");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category))
      );
      setCategories(["Todos", ...uniqueCategories]);
      setSelectedCategory("Todos");
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("http://localhost:8001/company");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch("http://localhost:8001/clients");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client[] = await response.json();
      setAllClients(data);
    } catch (error) {
      console.error("Could not fetch clients:", error);
    }
  };

  const selectClient = (selectedClient: Client) => {
    setClient(selectedClient);
    setOrder((prev) => ({ ...prev, clientId: selectedClient.id || "" }));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleNewClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client.name || !client.phone || !client.address) {
      alert("Por favor, complete todos los campos del cliente");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client = await response.json();
      setClient(data);
      setOrder((prev) => ({ ...prev, clientId: data.id || "" }));
      setShowNewClientModal(false);
      alert("Cliente registrado exitosamente!");
    } catch (error) {
      console.error("No se pudo registrar el cliente:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    setOrder((prev) => {
      const existingItem = prev.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1, observations: "" }],
        };
      }
    });
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const filteredMenuItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const searchFilteredMenuItems = filteredMenuItems.filter((item) =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      setCurrentDate(
        new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })
      );
    },
  });

  const handleDeliveryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fee = parseFloat(e.target.value) || 0;
    setOrder((prev) => ({ ...prev, deliveryFee: fee }));
  };

  const calculateTotal = () => {
    const itemsTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal + order.deliveryFee;
  };

  const sendToKitchenAndInvoice = async () => {
    try {
      // Send to kitchen
      await fetch("http://localhost:8001/kitchen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      // Create invoice
      await fetch("http://localhost:8001/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...order,
          total: calculateTotal(),
          date: new Date().toISOString(),
        }),
      });

      // Print ticket
      handlePrint();

      // Reset order
      setOrder({ clientId: "", items: [], deliveryFee: 0 });
      setClient({ name: "", phone: "", address: "" });
      setSearchTerm("");

      alert("Pedido enviado a cocina y factura creada!");
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
    }
  };

  return (
    <ModuleContainer>
      <h1 className="text-gray-800">Módulo de Domicilios</h1>
      <DeliveryContainer>
        <LeftColumn>
          <SearchContainer>
            <div>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente por nombre o celular"
              />
            </div>

            {searchResults.length > 0 && (
              <SearchResultsContainer>
                {searchResults.map((result) => (
                  <SearchResultItem
                    key={result.id}
                    onClick={() => selectClient(result)}
                  >
                    {result.name} - {result.phone}
                  </SearchResultItem>
                ))}
              </SearchResultsContainer>
            )}

            {searchTerm.length >= 3 && searchResults.length === 0 && (
              <NoResultsMessage>
                No se encontraron clientes. ¿Desea registrar un nuevo cliente?
                <Button onClick={() => setShowNewClientModal(true)}>
                  Registrar
                </Button>
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
              {categories.map((category) => (
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
              {searchFilteredMenuItems.map((item) => (
                <MenuItem key={item.id} onClick={() => addToOrder(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
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
            <QuantitySection>
              <h2>Pedido actual</h2>
              {order.items.map((item) => (
                <div key={item.id}>
                  {item.name} - ${item.price} x {item.quantity}
                  <QuantityControl>
                    <QuantityButton
                      onClick={() => updateItemQuantity(item.id, -1)}
                    >
                      -
                    </QuantityButton>
                    <span>{item.quantity}</span>
                    <QuantityButton
                      onClick={() => updateItemQuantity(item.id, 1)}
                    >
                      +
                    </QuantityButton>
                  </QuantityControl>
                </div>
              ))}
            </QuantitySection>
            <TotalSection>
              <h3>Valor de domicilio:</h3>
              <DeliveryFeeInput
                type="number"
                value={order.deliveryFee}
                onChange={handleDeliveryFeeChange}
                placeholder="Costo de domicilio"
              />
              <p>
                Subtotal: $
                {order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </p>
              <p>Valor domicilio: ${order.deliveryFee}</p>
              <p>Total: ${calculateTotal()}</p>
              <Button onClick={sendToKitchenAndInvoice}>
                Enviar a cocina y Facturar
              </Button>
            </TotalSection>
          </OrderSection>
        </RightColumn>

        {showNewClientModal && (
          <Modal onClick={() => setShowNewClientModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h2>Registrar Nuevo Cliente</h2>
              <form onSubmit={handleNewClientSubmit}>
                <Input
                  name="name"
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                  placeholder="Nombre"
                  required
                />
                <Input
                  name="phone"
                  value={client.phone}
                  onChange={(e) =>
                    setClient({ ...client, phone: e.target.value })
                  }
                  placeholder="Teléfono"
                  required
                />
                <Input
                  name="address"
                  value={client.address}
                  onChange={(e) =>
                    setClient({ ...client, address: e.target.value })
                  }
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
              {item.name} - ${item.price} x {item.quantity} = $
              {item.price * item.quantity}
            </p>
          ))}
          <p>
            Subtotal: $
            {order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}
          </p>
          <p>Valor domicilio: ${order.deliveryFee}</p>
          <p>
            <strong>Total: ${calculateTotal()}</strong>
          </p>
          <p>Fecha: {currentDate}</p>
        </PrintableTicket>
      </DeliveryContainer>
    </ModuleContainer>
  );
}
