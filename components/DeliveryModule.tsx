"use client";

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useReactToPrint } from "react-to-print";
import Button from "../components/buttons/Button";
import { MdDeliveryDining } from "react-icons/md";

interface Client {
  Id: number;
  Name: string;
  Phone: string;
  Address: string;
}

interface Category {
  Id: number;
  Name: string;
}

interface Product {
  Id: number;
  Name: string;
  Price: number;
  Cost: number;
  ImageURL: string;
  CategoryId: number;
  Category: Category;
}

interface OrderProduct {
  ProductId: number;
  OrderId: number;
  Quantity: number;
}

interface Company {
  Id: number;
  Name: string;
  Email: string;
  NIT: string;
  Phone: string;
  Address: string;
  LogoURL: string;
}

interface Order {
  TablesId: number;
  Observations: string;
  OrderProducts: OrderProduct[];
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
    Id: 0,
    Name: "",
    Phone: "",
    Address: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order>({
    TablesId: 0,
    Observations: "",
    OrderProducts: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
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
          client.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.Phone.includes(searchTerm)
      );
      setSearchResults(filteredClients);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allClients]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Product"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Could not fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Company"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Company = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Could not fetch company info:", error);
    }
  };

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Categories"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Category[] = await response.json();
      setCategories([{ Id: 0, Name: "Todos" }, ...data]);
      setSelectedCategory(0);
    } catch (error) {
      console.error("Could not fetch categories:", error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const fetchAllClients = async () => {
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Clients"
      );
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
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleNewClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client.Name || !client.Phone || !client.Address) {
      alert("Por favor, complete todos los campos obligatorios del cliente");
      return;
    }

    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Clients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...client, Id: 0 }),
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client = await response.json();
      setClient(data);
      setShowNewClientModal(false);
      alert("Cliente registrado exitosamente!");
      fetchAllClients();
    } catch (error) {
      console.error("No se pudo registrar el cliente:", error);
    }
  };

  const addToOrder = (product: Product) => {
    setOrder((prev) => {
      const existingItem = prev.OrderProducts.find(
        (i) => i.ProductId === product.Id
      );
      if (existingItem) {
        return {
          ...prev,
          OrderProducts: prev.OrderProducts.map((i) =>
            i.ProductId === product.Id ? { ...i, Quantity: i.Quantity + 1 } : i
          ),
        };
      } else {
        return {
          ...prev,
          OrderProducts: [
            ...prev.OrderProducts,
            { ProductId: product.Id, OrderId: 0, Quantity: 1 },
          ],
        };
      }
    });
  };

  const updateItemQuantity = (productId: number, change: number) => {
    setOrder((prev) => ({
      ...prev,
      OrderProducts: prev.OrderProducts
        .map((item) =>
          item.ProductId === productId
            ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
            : item
        )
        .filter((item) => item.Quantity > 0),
    }));
  };

  const filteredProducts =
    selectedCategory === 0
      ? products
      : products.filter((product) => product.CategoryId === selectedCategory);

  const searchFilteredProducts = filteredProducts.filter((product) =>
    product.Name.toLowerCase().includes(productSearchTerm.toLowerCase())
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
    const itemsTotal = order.OrderProducts.reduce((sum, item) => {
      const product = products.find((p) => p.Id === item.ProductId);
      return sum + (product ? product.Price * item.Quantity : 0);
    }, 0);
    return itemsTotal + deliveryFee;
  };

  const sendToKitchenAndInvoice = async () => {
    try {
      // Crear la orden
      const orderResponse = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );
      if (!orderResponse.ok)
        throw new Error(`HTTP error! status: ${orderResponse.status}`);
      const createdOrder = await orderResponse.json();

      // Crear la factura basada en la orden
      const invoiceResponse = await fetch(
        `https://restadmin.azurewebsites.net/api/v1/Invoice/create-from-order/${createdOrder.Id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!invoiceResponse.ok)
        throw new Error(`HTTP error! status: ${invoiceResponse.status}`);
      const createdInvoice = await invoiceResponse.json();

      // Imprimir ticket
      handlePrint();

      // Resetear el estado
      setOrder({ TablesId: 0, Observations: "", OrderProducts: [] });
      setClient({ Id: 0, Name: "", Phone: "", Address: "" });
      setSearchTerm("");
      setDeliveryFee(0);

      alert("Pedido enviado a cocina y factura creada!");
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Error al procesar el pedido. Por favor, intente de nuevo.");
    }
  };

  return (
    <>
      <NavBar>
        <div className="flex items-center ">
          <MdDeliveryDining className="text-3xl text-gray-800" />
          <h1 className="ml-4 text-gray-800">Gestión de domicilios</h1>
        </div>
      </NavBar>
      <ModuleContainer>
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
                      key={result.Id}
                      onClick={() => selectClient(result)}
                    >
                      {result.Name} - {result.Phone}
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
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Buscar en el menú"
              />
              {isCategoriesLoading ? (
                <CategoryTabsSkeleton />
              ) : (
                <CategoryTabs>
                  {categories.map((category) => (
                    <CategoryTab
                      key={category.Id}
                      active={selectedCategory === category.Id}
                      onClick={() => setSelectedCategory(category.Id)}
                    >
                      {category.Name}
                    </CategoryTab>
                  ))}
                </CategoryTabs>
              )}
              {isLoading ? (
                <MenuItemGridSkeleton />
              ) : (
                <MenuItemGrid>
                  {searchFilteredProducts.map((product) => (
                    <MenuItemCard
                      key={product.Id}
                      onClick={() => addToOrder(product)}
                    >
                      <img
                        src={product.ImageURL}
                        alt={product.Name}
                        className="w-full h-48 object-cover"
                      />
                      <h3>{product.Name}</h3>
                      <p>${product.Price}</p>
                    </MenuItemCard>
                  ))}
                </MenuItemGrid>
              )}
            </MenuSection>
          </LeftColumn>

          <RightColumn>
            {client.Id !== 0 && (
              <div>
                <h2>Cliente seleccionado</h2>
                <p>Nombre: {client.Name}</p>
                <p>Teléfono: {client.Phone}</p>
                <p>Dirección: {client.Address}</p>
              </div>
            )}

            <OrderSection>
              <h2>Pedido actual</h2>
              {order.OrderProducts.map((item) => {
                const product = products.find((p) => p.Id === item.ProductId);
                return product ? (
                  <div key={item.ProductId}>
                    {product.Name} - ${product.Price} x {item.Quantity}
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => updateItemQuantity(item.ProductId, -1)}
                      >
                        -
                      </QuantityButton>
                      <span>{item.Quantity}</span>
                      <QuantityButton
                        onClick={() => updateItemQuantity(item.ProductId, 1)}
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
                {order.OrderProducts.reduce((sum, item) => {
                  const product = products.find((p) => p.Id === item.ProductId);
                  return sum + (product ? product.Price * item.Quantity : 0);
                }, 0)}
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
                    name="Name"
                    value={client.Name}
                    onChange={(e) =>
                      setClient({ ...client, Name: e.target.value })
                    }
                    placeholder="Nombre completo"
                    required
                  />
                  <Input
                    name="Phone"
                    value={client.Phone}
                    onChange={(e) =>
                      setClient({ ...client, Phone: e.target.value })
                    }
                    placeholder="Teléfono"
                    required
                  />
                  <Input
                    name="Address"
                    value={client.Address}
                    onChange={(e) =>
                      setClient({ ...client, Address: e.target.value })
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
                <CompanyLogo src={company.LogoURL} alt={company.Name} />
                <h2>{company.Name}</h2>
                <p>NIT: {company.NIT}</p>
                <p>Dirección: {company.Address}</p>
                <p>Teléfono: {company.Phone}</p>
                <p>Email: {company.Email}</p>
              </>
            )}
            <h3>Domicilios</h3>
            <p>Cliente: {client.Name}</p>
            <p>Celular: {client.Phone}</p>
            <p>Dirección: {client.Address}</p>
            <h4>Productos:</h4>
            {order.OrderProducts.map((item, index) => {
              const product = products.find((p) => p.Id === item.ProductId);
              return product ? (
                <p key={index}>
                  {product.Name} - ${product.Price} x {item.Quantity} = $
                  {product.Price * item.Quantity}
                </p>
              ) : null;
            })}
            <p>
              Subtotal: $
              {order.OrderProducts.reduce((sum, item) => {
                const product = products.find((p) => p.Id === item.ProductId);
                return sum + (product ? product.Price * item.Quantity : 0);
              }, 0)}
            </p>
            <p>Valor domicilio: ${deliveryFee}</p>
            <p>
              <strong>Total: ${calculateTotal()}</strong>
            </p>
            <p>Fecha: {currentDate}</p>
          </PrintableTicket>
        </DeliveryContainer>
      </ModuleContainer>
    </>
  );
}