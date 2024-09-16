"use client";

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useReactToPrint } from "react-to-print";
import Button from "../components/buttons/Button";


interface Client {
  id?: number;
  name: string;
  phone: string;
  address: string;
}

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  cost: number;
  imageURL: string;
  categoryId: number;
  category: Category;
}

interface OrderItem {
  productId: number;
  orderId: number;
  quantity: number;
}

interface Company {
  id: number;
  name: string;
  email: string;
  nit: string;
  phone: string;
  address: string;
  logoURL: string;
}

interface Order {
  tablesId: number;
  observations: string;
  orderProducts: OrderItem[];
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

const MenuItemCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
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

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const CategoryTabSkeleton = styled(SkeletonPulse)`
  width: 100px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
`;

const MenuItemCardSkeleton = styled(SkeletonPulse)`
  height: 200px;
  border-radius: 8px;
`;

const CategoryTabsSkeleton = () => (
  <CategoryTabs>
    {[...Array(5)].map((_, index) => (
      <CategoryTabSkeleton key={index} />
    ))}
  </CategoryTabs>
);

const MenuItemGridSkeleton = () => (
  <MenuItemGrid>
    {[...Array(8)].map((_, index) => (
      <MenuItemCardSkeleton key={index} />
    ))}
  </MenuItemGrid>
);

export default function DeliveryModule() {
  const [client, setClient] = useState<Client>({
    name: "",
    phone: "",
    address: "",
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<Order>({
    tablesId: 0,
    observations: "",
    orderProducts: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchAllClients();
    fetchCompanyInfo();
    fetchCategories();
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
    setIsLoading(true);
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Product");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Could not fetch menu items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Company");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Company = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Could not fetch company info:", error);
    }
  };

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Categories");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Category[] = await response.json();
      setCategories([{ id: 0, name: "Todos" }, ...data]);
      setSelectedCategory(0);
    } catch (error) {
      console.error("Could not fetch categories:", error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const fetchAllClients = async () => {
    try {
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Clients");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client[] = await response.json();
      setAllClients(data);
    } catch (error) {
      console.error("Could not fetch clients:", error);
    }
  };

  const selectClient = (selectedClient: Client) => {
    setClient(selectedClient);
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
      const response = await fetch("https://restadmin.azurewebsites.net/api/v1/Clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, id: 0 }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client = await response.json();
      setClient(data);
      setShowNewClientModal(false);
      alert("Cliente registrado exitosamente!");
      fetchAllClients();
    } catch (error) {
      console.error("No se pudo registrar el cliente:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    setOrder((prev) => {
      const existingItem = prev.orderProducts.find((i) => i.productId === item.id);
      if (existingItem) {
        return {
          ...prev,
          orderProducts: prev.orderProducts.map((i) =>
            i.productId === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return {
          ...prev,
          orderProducts: [...prev.orderProducts, { productId: item.id, orderId: 0, quantity: 1 }],
        };
      }
    });
  };

  const updateItemQuantity = (itemId: number, change: number) => {
    setOrder((prev) => ({
      ...prev,
      orderProducts: prev.orderProducts
        .map((item) =>
          item.productId === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const filteredMenuItems =
    selectedCategory === 0
      ? menuItems
      : menuItems.filter((item) => item.categoryId === selectedCategory);

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
    setDeliveryFee(fee);
  };

  const calculateTotal = () => {
    const itemsTotal = order.orderProducts.reduce(
      (sum, item) => {
        const menuItem = menuItems.find(m => m.id === item.productId);
        return sum + (menuItem ? menuItem.price * item.quantity : 0);
      },
      0
    );
    return itemsTotal + deliveryFee;
  };

  const sendToKitchenAndInvoice = async () => {
    try {
      // Crear la orden
      const orderResponse = await fetch("https://restadmin.azurewebsites.net/api/v1/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!orderResponse.ok) throw new Error(`HTTP error! status: ${orderResponse.status}`);
      const createdOrder = await orderResponse.json();

      // Crear la factura basada en la orden
      const invoiceResponse = await fetch(`https://restadmin.azurewebsites.net/api/v1/Invoice/create-from-order/${createdOrder.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!invoiceResponse.ok) throw new Error(`HTTP error! status: ${invoiceResponse.status}`);
      const createdInvoice = await invoiceResponse.json();

      // Imprimir ticket
      handlePrint();

      // Resetear el estado
      setOrder({ tablesId: 0, observations: "", orderProducts: [] });
      setClient({ name: "", phone: "", address: "" });
      setSearchTerm("");
      setDeliveryFee(0);

      alert("Pedido enviado a cocina y factura creada!");
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Error al procesar el pedido. Por favor, intente de nuevo.");
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
            {isCategoriesLoading ? (
              <CategoryTabsSkeleton />
            ) : (
              <CategoryTabs>
                {categories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    active={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </CategoryTab>
                ))}
              </CategoryTabs>
            )}
            {isLoading ? (
              <MenuItemGridSkeleton />
            ) : (
              <MenuItemGrid>
                {searchFilteredMenuItems.map((item) => (
                  <MenuItemCard key={item.id} onClick={() => addToOrder(item)}>
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                  </MenuItemCard>
                ))}
              </MenuItemGrid>
            )}
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
            {order.orderProducts.map((item) => {
              const menuItem = menuItems.find(m => m.id === item.productId);
              return menuItem ? (
                <div key={item.productId}>
                  {menuItem.name} - ${menuItem.price} x {item.quantity}
                  <QuantityControl>
                    <QuantityButton
                      onClick={() => updateItemQuantity(item.productId, -1)}
                    >
                      -
                    </QuantityButton>
                    <span>{item.quantity}</span>
                    <QuantityButton
                      onClick={() => updateItemQuantity(item.productId, 1)}
                    >
                      +
                    </QuantityButton>
                  </QuantityControl>
                </div>
              ) : null;
            })}
            <h3>Valor de domicilio:</h3>
            <DeliveryFeeInput
              type="number"
              value={deliveryFee}
              onChange={handleDeliveryFeeChange}
              placeholder="Costo de domicilio"
            />
            <p>
              Subtotal: $
              {order.orderProducts.reduce(
                (sum, item) => {
                  const menuItem = menuItems.find(m => m.id === item.productId);
                  return sum + (menuItem ? menuItem.price * item.quantity : 0);
                },
                0
              )}
            </p>
            <p>Valor domicilio: ${deliveryFee}</p>
            <p>Total: ${calculateTotal()}</p>
            <Button onClick={sendToKitchenAndInvoice}>
              Enviar a cocina y Facturar
            </Button>
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
              <CompanyLogo src={company.logoURL} alt={company.name} />
              <h2>{company.name}</h2>
              <p>NIT: {company.nit}</p>
              <p>Dirección: {company.address}</p>
              <p>Teléfono: {company.phone}</p>
              <p>Email: {company.email}</p>
            </>
          )}
          <h3>Domicilios</h3>
          <p>Cliente: {client.name}</p>
          <p>Celular: {client.phone}</p>
          <p>Dirección: {client.address}</p>
          <h4>Productos:</h4>
          {order.orderProducts.map((item, index) => {
            const menuItem = menuItems.find(m => m.id === item.productId);
            return menuItem ? (
              <p key={index}>
                {menuItem.name} - ${menuItem.price} x {item.quantity} = $
                {menuItem.price * item.quantity}
              </p>
            ) : null;
          })}
          <p>
            Subtotal: $
            {order.orderProducts.reduce(
              (sum, item) => {
                const menuItem = menuItems.find(m => m.id === item.productId);
                return sum + (menuItem ? menuItem.price * item.quantity : 0);
              },
              0
            )}
          </p>
          <p>Valor domicilio: ${deliveryFee}</p>
          <p>
            <strong>Total: ${calculateTotal()}</strong>
          </p>
          <p>Fecha: {currentDate}</p>
        </PrintableTicket>
      </DeliveryContainer>
    </ModuleContainer>
  );
}