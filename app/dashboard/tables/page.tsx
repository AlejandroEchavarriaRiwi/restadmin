"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./style.sass";
import Button from "../../../components/ui/Button";
import TableCard from "@/components/ui/StyledTableCard";
import { PlusCircle, Trash2, CreditCard, ChefHat, Minus } from "lucide-react";
import { MdTableRestaurant } from "react-icons/md";
interface Table {
  Id: number;
  Name: string;
}

interface Category {
  Id: number;
  Name: string;
}

interface Product {
  Id: number;
  Name: string;
  Price: number;
  Quantity: number;
  ImageURL: string;
  Category: Category;
  Status: number;
}

interface Order {
  Id: number;
  Observations: string;
  Status: number;
  TablesId: number | null;
  TableName: string | null;
  Products: Product[];
}


const Container = styled.div`
  margin-top: 20px;
  padding: 0px 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
`;

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
    div {
      flex-direction: row;
      margin-bottom: 10px;
      gap: 10px;
    }
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
  color: #1f2937;
  @media screen and (max-width: 600px) {
    z-index: 600;
  }
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  height: 90%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 600px) {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  button {
    position: absolute;
    right: 5px;
  }
  h2 {
    font-size: x-large;
    font-weight: bold;
  }
`;

const ModalBody = styled.div`
  display: flex;
  height: 90%;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    height: 95%;
  }
`;

const MenuSection = styled.div`
  width: 60%;
  height: 100%;
  overflow-y: auto;
  padding-right: 20px;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    height: 50%;
    padding-right: 0px;
  }
`;

const OrderSection = styled.div`
  width: 40%;
  padding: 5px;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: large;
    font-weight: bold;
  }
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 50%;

    div.buttons {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
    }
  }
  div.buttons {
    display: flex;
    justify-content: center;
    gap: 40px;
    button {
    }
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid;
  @media screen and (max-width: 600px) {
    margin-bottom: 2px;
  }
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#4655c4" : "#f8f9fa")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => (props.active ? "#637ad6" : "#e9ecef")};
  }
`;

const MenuItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;

  @media screen and (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Para Firefox */
    -ms-overflow-style: none; /* Para Internet Explorer y Edge */

    &::-webkit-scrollbar {
      display: none; /* Para Chrome, Safari y Opera */
    }
  }
`;

const MenuItem = styled.div`
  width: 100%;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media screen and (max-width: 600px) {
    flex: 0 0 auto;
    width: 150px; /* O el ancho que prefieras para móviles */
    margin-right: 15px;
    scroll-snap-align: start;
  }
`;

const OrderList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  @media screen and (max-width: 600px) {
    height: 60%;
  }
`;

const DivOrder = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    font-weight: bold;
    font-size: large;
  }
  span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchTables();
    fetchMenuItems();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = Array.from(
        new Set(menuItems.map((item) => item.Category.Name))
      );
      setCategories(["Todos", ...uniqueCategories]);
      setSelectedCategory("Todos");
    }
  }, [menuItems]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Order"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert(
        `Error fetching orders: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    const tableOrder = orders.find(order => order.TablesId === table.Id && order.Status !== 4 && order.Status !== 5);
    setCurrentOrder(tableOrder || createEmptyOrder(table.Id));
  };

  const createEmptyOrder = (tableId: number): Order => {
    return {
      Id: 0,
      Observations: "",
      Status: 1, // Occupied
      TablesId: tableId,
      TableName: tables.find((t) => t.Id === tableId)?.Name || "",
      Products: [],
    };
  };

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Tables"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tables. Status: ${response.status}`);
      }
      const data: Table[] = await response.json();
      setTables(data);
      console.log("Tables updated:", data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert(
        `Error fetching tables: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Product"
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch menu items. Status: ${response.status}`
        );
      }
      const data = await response.json();
      // Filtra los productos para incluir solo los que tienen Status = 0
      const enabledProducts = data.filter((product: Product) => product.Status === 0);
      setMenuItems(enabledProducts);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      alert(
        `Error fetching menu items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleAddMenuItem = (menuItem: Product) => {
    if (currentOrder) {
      const existingItem = currentOrder.Products.find(
        (item) => item.Id === menuItem.Id
      );
      if (existingItem) {
        existingItem.Quantity += 1;
      } else {
        currentOrder.Products.push({ ...menuItem, Quantity: 1, Status: 0 });
      }
      setCurrentOrder({ ...currentOrder });
    }
  };

  const handleRemoveMenuItem = (menuItem: Product) => {
    if (currentOrder) {
      const existingItemIndex = currentOrder.Products.findIndex(
        (item) => item.Id === menuItem.Id
      );
      if (existingItemIndex !== -1) {
        if (currentOrder.Products[existingItemIndex].Quantity > 1) {
          currentOrder.Products[existingItemIndex].Quantity -= 1;
        } else {
          currentOrder.Products.splice(existingItemIndex, 1);
        }
        setCurrentOrder({ ...currentOrder });
      }
    }
  };

  const handleSendToKitchen = async () => {
    if (currentOrder && selectedTable) {
      try {
        const orderForCreation = {
          TablesId: selectedTable.Id,
          Observations: currentOrder.Observations,
          Status: 0, // Cooking
          OrderProducts: currentOrder.Products.map(product => ({
            ProductId: product.Id,
            OrderId: currentOrder.Id || 0,
            Quantity: product.Quantity
          }))
        };

        let response;
        if (currentOrder.Id !== 0) {
          response = await fetch(
            `https://restadmin.azurewebsites.net/api/v1/Order/${currentOrder.Id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderForCreation),
            }
          );
        } else {
          response = await fetch(
            "https://restadmin.azurewebsites.net/api/v1/Order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderForCreation),
            }
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to ${currentOrder.Id !== 0 ? 'update' : 'create'} order. Status: ${response.status}, Response: ${errorText}`
          );
        }

        await fetchOrders();
        setSelectedTable(null);
        setCurrentOrder(null);

      } catch (error) {
        console.error("Error processing order:", error);
        alert(`Error processing order: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  };

  const handlePreInvoice = async () => {
    if (currentOrder && currentOrder.Id !== 0) {
      try {
        const response = await fetch(
          `https://restadmin.azurewebsites.net/api/v1/Order/${currentOrder.Id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...currentOrder, Status: 3 }), // Status 3: Por facturar
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update order status. Status: ${response.status}`
          );
        }

        await fetchOrders();
        setSelectedTable(null);
        setCurrentOrder(null);

      } catch (error) {
        console.error("Error handling pre-invoice:", error);
        alert(
          `Error handling pre-invoice: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const addTable = async () => {
    const newTable: Omit<Table, "Id"> = {
      Name: `Mesa ${tables.length + 1}`,
    };

    try {
      const response = await fetch(
        "https://restadmin.azurewebsites.net/api/v1/Tables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTable),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add table. Status: ${response.status}`);
      }

      const data = await response.json();
      setTables([...tables, data]);
    } catch (error) {
      console.error("Error adding table:", error);
      alert(
        `Error adding table: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const removeTable = async () => {
    if (tables.length > 0) {
      const lastTable = tables[tables.length - 1];

      try {
        const tableResponse = await fetch(
          `https://restadmin.azurewebsites.net/api/v1/Tables/${lastTable.Id}`,
          {
            method: "DELETE",
          }
        );

        if (!tableResponse.ok) {
          throw new Error(
            `Failed to delete table. Status: ${tableResponse.status}`
          );
        }

        setTables((prevTables) => prevTables.slice(0, -1));
        console.log("Table removed successfully");
      } catch (error) {
        console.error("Error removing table:", error);
        alert(
          `Error removing table: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const getTableStatus = (tableId: number) => {
    const tableOrder = orders.find(order => order.TablesId === tableId && order.Status !== 4 && order.Status !== 5);
    if (!tableOrder) return "Disponible";
    switch (tableOrder.Status) {
      case 0: return "Cocinando";
      case 1: return "Ocupada";
      case 3: return "Por Facturar";
      default: return "Disponible";
    }
  };

  const filteredMenuItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.Category.Name === selectedCategory);

  return (
    <>
      <NavBar>
        <div className="flex items-center gap-2 ">
          <MdTableRestaurant className="text-[2em] text-gray-800" />
          <h1 className="text-[1.5em] text-gray-800">Mesas</h1>
        </div>
        <div className="flex gap-4 mr-4 ">
          <Button
            className="flex items-center text-gray-800"
            onClick={addTable}
          >
            <PlusCircle className="mr-2 h-6 w-6 text-green-500" />
            Agregar Mesa
          </Button>
          <Button className={`flex items-center`} onClick={removeTable}>
            <Trash2 className="mr-2 h-6 w-6 text-red-500" />
            Eliminar Mesa
          </Button>
        </div>
        </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <TableCard
              key={table.Id}
              table={{...table, State: getTableStatus(table.Id)}}
              onClick={() => handleTableClick(table)}
            />
          ))
        ) : (
          <h2>No hay mesas creadas</h2>
        )}
      </Container>
      {selectedTable && currentOrder && (
        <Modal onClick={() => setSelectedTable(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{selectedTable.Name} - Orden</h2>
              <Button onClick={() => setSelectedTable(null)}>Cerrar</Button>
            </ModalHeader>
            <ModalBody>
              <MenuSection>
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
                  {filteredMenuItems.map((item) => (
                    <MenuItem
                      key={item.Id}
                      onClick={() => handleAddMenuItem(item)}
                    >
                      <img
                        src={item.ImageURL}
                        alt={item.Name}
                        className="w-full h-48 object-cover"
                      />
                      <div>{item.Name}</div>
                      <div>${item.Price}</div>
                    </MenuItem>
                  ))}
                </MenuItemGrid>
              </MenuSection>
              <OrderSection>
                <h3>Pedido:</h3>
                <OrderList>
                  {currentOrder.Products.map((item, index) => (
                    <DivOrder className="gap-3" key={index}>
                      <span>
                        {item.Name} - ${item.Price} <h4>x {item.Quantity}</h4>
                      </span>
                      <Button
                        className="w-8 h-8 m-2 flex items-center justify-center bg-white text-gray-700 border-2 border-[#dc2626] rounded-full shadow-sm transition-all duration-200 ease-in-out hover:bg-[#fff4f4] hover:border-[#e26666] active:bg-gray-200 active:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#a71c1c]"
                        onClick={() => handleRemoveMenuItem(item)}
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                    </DivOrder>
                  ))}
                </OrderList>
                <h3>Observaciones:</h3>
                <TextArea
                  value={currentOrder.Observations}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      Observations: e.target.value,
                    })
                  }
                  placeholder="Introduzca aquí cualquier instrucción u observación especial..."
                  rows={4}
                />{" "}
                <div className="buttons">
                  <Button
                    className="flex gap-1 border-2 p-2 rounded-lg bg-[#fdfaef] border-[#d97706] items-center text-gray-600 flex-col lg:flex-row w-[150px] justify-center lg:w-[180px]"
                    onClick={handleSendToKitchen}
                  >
                    <ChefHat className="text-[#d97706]" />
                    Enviar a Cocina
                  </Button>
                  <Button
                    className="flex gap-1 border-2 p-2 rounded-lg bg-[#fff4f4] border-[#a71c1c] text-gray-600 items-center flex-col lg:flex-row w-[150px] justify-center lg:w-[180px]"
                    onClick={handlePreInvoice}
                  >
                    <CreditCard className="text-[#a71c1c]" />
                    Pre-facturar
                  </Button>
                </div>
              </OrderSection>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
