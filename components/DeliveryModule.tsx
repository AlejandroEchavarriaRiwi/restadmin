"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../components/buttons/Button";
import { MdDeliveryDining } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";
import { IoIosCloseCircleOutline } from "react-icons/io";
import InputAlert from "./alerts/successAlert";
import { Category, Client, Order, Product } from "@/models/user.models";

const NavBarTitle = styled.h1`
  font-size: 1.5em;
  color: #1f2937;
  font-weight: bold;
`;

const NavBarContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledMdDeliveryDining = styled(MdDeliveryDining)`
  font-size: 2em;
  color: #1f2937;
  font-weight: bold;
`;

const StyledTbClipboardList = styled(TbClipboardList)`
  font-size: 30px;
  color: #1f2937;
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
`;

const MenuItemName = styled.h3`
  margin-top: 0.5rem;
`;

const MenuItemPrice = styled.p`
  margin-top: 0.25rem;
`;

const ClientInfo = styled.div`
  margin-bottom: 1rem;
`;

const ClientDetail = styled.p`
  margin-bottom: 0.25rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;
const NavBar = styled.nav`
  background-color: #f8f9fa;
  padding: 15px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    justify-content: space-between;
  }

  @media screen and (max-width: 600px) {
    div {
      width: 100%;
      display: flex;
      justify-content: center;
      text-align: center;
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
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
`;

const LeftColumn = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-y: auto;

  @media (min-width: 768px) {
    width: 60%;
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
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CartCounter = styled.span`
  position: absolute;
  width: 20px;
  height: 20px;
  top: -5px;
  right: -5px;
  background-color: #4b9fea;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightColumn = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 90%;
  max-width: 350px;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: ${(props) =>
    props.$isOpen ? "-5px 0 25px rgba(0,0,0,0.1)" : "none"};
  z-index: 1000;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    overflow-y: auto;
  }

  @media (min-width: 768px) {
    position: static;
    width: 40%;
    max-width: none;
    transform: none;
    box-shadow: none;
    border-left: 1px solid #e0e0e0;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
`;

const FixedBottom = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #ffffff;
  padding-top: 15px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  align-self: flex-end;
  color: #333;
  font-size: 1.5em;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #4655c4;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e8e8e9;
  border-radius: 5px;
  &:focus {
    border: 2px solid #67b7f7;
    outline: none;
  }
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  h2 {
    border-top: 2px solid#67b7f7;
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
  gap: 10px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const SearchContainer = styled.div`
  div {
    display: flex;
    justify-content: space-between;
  }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.$active ? "#67b7f7" : "#f8f9fa")};
  color: ${(props) => (props.$active ? "white" : "black")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

const MenuItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MenuItemCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    img {
      height: 12rem;
    }
  }

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const OrderSection = styled.div`
  height: 100%; 
  display: flex;
  flex-direction: column; 
`;

const OrderHeader = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const OrderItemList = styled.div`
  flex-grow: 1; // This will ensure the list takes available space
  overflow-y: auto; // And this will make it scrollable if content overflows
  margin-bottom: 20px; 
`;


const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderItemDetails = styled.div`
  flex-grow: 1;
`;

const OrderItemName = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const OrderItemPrice = styled.p`
  color: #666;
`;

const SearchResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  max-height: 200px;
  overflow-y: auto;

`;

const SearchResultItem = styled.div`
  padding: 10px;  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NoResultsMessage = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: #666;
`;

const TotalSection = styled.div`
  border-top: 2px solid #67b7f7;
  padding-top: 15px;
`;

const TotalItem = styled.p`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1.1em;

  &:last-child {
    font-weight: bold;
    font-size: 1.2em;
    margin-top: 15px;
  }
`;

const SendButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #4655c4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #3a46a3;
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
  width: 90%;
  max-width: 400px;
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
const QuantityDisplay = styled.span`
  padding: 0 10px;
  font-weight: bold;
`;

const DeliveryFeeInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #4655c4;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
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

const ObservationSection = styled.div`
  border-top: 2px solid #67b7f7;
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

export default function DeliveryModule() {
  // State declarations
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isRightColumnOpen, setIsRightColumnOpen] = useState(false);
  const [observations, setObservations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchProducts();
    fetchAllClients();
    fetchCategories();
  }, []);

  // Filter clients based on search term
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

  // Update observations in the order
  const updateObservations = (newObservations: string) => {
    setObservations(newObservations);
  };

  // Fetch products from the API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/Product");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Product[] = await response.json();
      setProducts(data);

      // Extract unique category IDs from products
      const uniqueCategoryIds = Array.from(
        new Set(data.map((product) => product.Category.Id))
      );

      // Update categories based on available products
      setCategories((prevCategories) => {
        const filteredCategories = prevCategories.filter(
          (category) =>
            category.Id === 0 || uniqueCategoryIds.includes(category.Id)
        );
        return filteredCategories;
      });

      setSelectedCategory(0);
    } catch (error) {
      // Error handling removed
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await fetch("/api/v1/Categories");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Category[] = await response.json();
      setCategories([{ Id: 0, Name: "Todas" }, ...data]);
    } catch (error) {
      // Error handling removed
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Fetch all clients from the API
  const fetchAllClients = async () => {
    try {
      const response = await fetch("/api/v1/Clients");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client[] = await response.json();
      setAllClients(data);
    } catch (error) {
      // Error handling removed
    }
  };

  // Select a client from search results
  const selectClient = (selectedClient: Client) => {
    setClient(selectedClient);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Handle new client submission
  const handleNewClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client.Name || !client.Phone || !client.Address) {
      alert("Por favor, complete todos los campos obligatorios del cliente");
      return;
    }

    try {
      const response = await fetch("/api/v1/Clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, Id: 0 }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Client = await response.json();
      setClient(data);
      setShowNewClientModal(false);
      alert("Cliente registrado exitosamente!");
      fetchAllClients();
    } catch (error) {
      // Error handling removed
    }
  };

  // Add a product to the order
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

  // Update the quantity of an item in the order
  const updateItemQuantity = (productId: number, change: number) => {
    setOrder((prev) => ({
      ...prev,
      OrderProducts: prev.OrderProducts.map((item) =>
        item.ProductId === productId
          ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
          : item
      ).filter((item) => item.Quantity > 0),
    }));
  };

  // Group products by category
  const groupProductsByCategory = (products: Product[]) => {
    return products.reduce((acc, product) => {
      const categoryName = product.Category.Name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 0
      ? products
      : products.filter((product) => product.CategoryId === selectedCategory);

  // Filter products based on search term
  const searchFilteredProducts = filteredProducts.filter((product) =>
    product.Name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Group menu items by category
  const groupedMenuItems = groupProductsByCategory(searchFilteredProducts);

  // Handle delivery fee change
  const handleDeliveryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fee = e.target.value;
    setDeliveryFee(fee);
  };

  // Calculate total order amount
  const calculateTotal = () => {
    const itemsTotal = order.OrderProducts.reduce((sum, item) => {
      const product = products.find((p) => p.Id === item.ProductId);
      return sum + (product ? product.Price * item.Quantity : 0);
    }, 0);

    const validDeliveryFee = parseFloat(deliveryFee) || 0;
    return itemsTotal + validDeliveryFee;
  };

  // Send order to kitchen and generate invoice
  const sendToKitchenAndInvoice = async () => {
    if (!isOrderValid()) {
      setError(
        "Por favor, complete todos los campos requeridos y agregue al menos un producto."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    const clientInfo = `Cliente: ${client.Name}, Teléfono: ${client.Phone}, Dirección: ${client.Address}`;
    const fullObservations = `${clientInfo}. Costo de domicilio: $${deliveryFee}. ${observations}`;

    const orderData = {
      Status: 0,
      Observations: fullObservations,
      OrderProducts: order.OrderProducts.map((item) => ({
        ProductId: item.ProductId,
        OrderId: 0,
        Quantity: item.Quantity,
      })),
    };

    try {
      const response = await fetch("/api/v1/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Reset order and client information after successful submission
      setOrder({ TablesId: 0, Observations: "", OrderProducts: [] });
      setClient({ Id: 0, Name: "", Phone: "", Address: "" });
      setObservations("");
      setDeliveryFee("");

      await InputAlert(
        "Orden generada correctamente y enviada a cocina!",
        "success"
      );
    } catch (error) {
      await InputAlert(
        "Error al procesar el pedido. Por favor, intente de nuevo.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the order is valid
  const isOrderValid = () => {
    return (
      order.OrderProducts.length > 0 &&
      client.Id !== 0 &&
      client.Name !== "" &&
      client.Phone !== "" &&
      client.Address !== "" &&
      deliveryFee !== ""
    );
  };

  // Get total number of items in the cart
  const getTotalItemsInCart = () => {
    return order.OrderProducts.reduce((total, item) => total + item.Quantity, 0);
  };

  return (
    <>
      <NavBar>
        <NavBarContent>
          <StyledMdDeliveryDining />
          <NavBarTitle>Gestión de domicilios</NavBarTitle>
        </NavBarContent>
        <CartButton onClick={() => setIsRightColumnOpen(true)}>
          <StyledTbClipboardList />
          {getTotalItemsInCart() > 0 && (
            <CartCounter>{getTotalItemsInCart()}</CartCounter>
          )}
        </CartButton>
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
                      $active={selectedCategory === category.Id}
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
                Object.entries(groupedMenuItems).map(
                  ([categoryName, items]) => (
                    <div key={categoryName}>
                      <CategoryTitle>{categoryName}</CategoryTitle>
                      <MenuItemGrid>
                        {items.map((product) => (
                          <MenuItemCard
                            key={product.Id}
                            onClick={() => addToOrder(product)}
                          >
                            <MenuItemImage src={product.ImageURL} alt={product.Name} />
                            <MenuItemName>{product.Name}</MenuItemName>
                            <MenuItemPrice>${product.Price}</MenuItemPrice>
                          </MenuItemCard>
                        ))}
                      </MenuItemGrid>
                    </div>
                  )
                )
              )}
            </MenuSection>
          </LeftColumn>

          <RightColumn $isOpen={isRightColumnOpen}>
            <CloseButton onClick={() => setIsRightColumnOpen(false)}>
              <IoIosCloseCircleOutline />
            </CloseButton>

            {client.Id !== 0 && (
              <ClientInfo>
                <OrderHeader>Cliente seleccionado</OrderHeader>
                <ClientDetail>Nombre: {client.Name}</ClientDetail>
                <ClientDetail>Teléfono: {client.Phone}</ClientDetail>
                <ClientDetail>Dirección: {client.Address}</ClientDetail>
              </ClientInfo>
            )}

            <OrderSection>
              <OrderHeader>Pedido actual</OrderHeader>
              <OrderItemList>
                {order.OrderProducts.map((item) => {
                  const product = products.find((p) => p.Id === item.ProductId);
                  return product ? (
                    <OrderItem key={item.ProductId}>
                      <OrderItemDetails>
                        <OrderItemName>{product.Name}</OrderItemName>
                        <OrderItemPrice>
                          ${product.Price} x {item.Quantity}
                        </OrderItemPrice>
                      </OrderItemDetails>
                      <QuantityControl>
                        <QuantityButton
                          onClick={() => updateItemQuantity(item.ProductId, -1)}
                        >
                          -
                        </QuantityButton>
                        <QuantityDisplay>{item.Quantity}</QuantityDisplay>
                        <QuantityButton
                          onClick={() => updateItemQuantity(item.ProductId, 1)}
                        >
                          +
                        </QuantityButton>
                      </QuantityControl>
                    </OrderItem>
                  ) : null;
                })}
              </OrderItemList>
              <ObservationSection>
                <ObservationLabel htmlFor="observation">
                  Observaciones
                </ObservationLabel>
                <ObservationTextArea
                  id="observation"
                  value={observations}
                  onChange={(e) => updateObservations(e.target.value)}
                  placeholder="Añade observaciones generales para tu orden..."
                />
              </ObservationSection>

              <DeliveryFeeInput
                type="number"
                value={deliveryFee}
                onChange={handleDeliveryFeeChange}
                placeholder="Costo de domicilio"
                required
              />

              <TotalSection>
                <TotalItem>
                  <span>Subtotal:</span>
                  <span>
                    $
                    {order.OrderProducts.reduce((sum, item) => {
                      const product = products.find(
                        (p) => p.Id === item.ProductId
                      );
                      return sum + (product ? product.Price * item.Quantity : 0);
                    }, 0)}
                  </span>
                </TotalItem>
                <TotalItem>
                  <span>Valor domicilio:</span>
                  <span>${deliveryFee}</span>
                </TotalItem>
                <TotalItem>
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </TotalItem>
              </TotalSection>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SendButton
                onClick={sendToKitchenAndInvoice}
                disabled={!isOrderValid() || isLoading}
              >
                {isLoading ? "Procesando..." : "Generar orden"}
              </SendButton>
            </OrderSection>
          </RightColumn>

          {showNewClientModal && (
            <Modal onClick={() => setShowNewClientModal(false)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalTitle>Registrar Nuevo Cliente</ModalTitle>
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
        </DeliveryContainer>
      </ModuleContainer>
    </>
  );
}
