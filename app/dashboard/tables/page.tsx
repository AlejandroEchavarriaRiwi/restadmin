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
  State: "Disponible" | "Ocupada" | "Cocinando" | "Por Facturar";
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
}

interface Order {
  Id: number;
  Observations: string;
  TablesId: number;
  TableName: string;
  Products: Product[];
}
interface OrderForCreation {
  TablesId: number;
  Observations: string;
  OrderProducts: {
    ProductId: number;
    OrderId: number;
    Quantity: number;
  }[];
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

  useEffect(() => {
    fetchTables();
    fetchMenuItems();
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

  const handleTableClick = async (table: Table) => {
    setSelectedTable(table);
    const order = await fetchOrder(table.Id);
    setCurrentOrder(order);
  };

  const fetchOrder = async (tableId: number): Promise<Order> => {
    try {
      const response = await fetch(
        `https://restadmin.azurewebsites.net/api/v1/Order?TablesId=${tableId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch order. Status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      if (data.length > 0) {
        return data[0];
      } else {
        return createEmptyOrder(tableId);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      return createEmptyOrder(tableId);
    }
  };

  const createEmptyOrder = (tableId: number): Order => {
    return {
      Id: 0,
      Observations: "",
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
      setMenuItems(data);
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
        currentOrder.Products.push({ ...menuItem, Quantity: 1 });
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
        console.log("Preparing order for kitchen:", currentOrder);

        // Prepare the order data in the correct format
        const orderForCreation: OrderForCreation = {
          TablesId: selectedTable.Id,
          Observations: currentOrder.Observations,
          OrderProducts: currentOrder.Products.map(product => ({
            ProductId: product.Id,
            OrderId: currentOrder.Id || 0, // Use 0 if it's a new order
            Quantity: product.Quantity
          }))
        };

        console.log("Formatted order data:", orderForCreation);

        let orderId: number;
        if (currentOrder.Id !== 0) {
          // Update existing order
          console.log("Updating existing order");
          const updateResponse = await fetch(
            `https://restadmin.azurewebsites.net/api/v1/Order/${currentOrder.Id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderForCreation),
            }
          );
          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(
              `Failed to update order. Status: ${updateResponse.status}, Response: ${errorText}`
            );
          }
          orderId = currentOrder.Id;
        } else {
          // Create new order
          console.log("Creating new order");
          const createResponse = await fetch(
            "https://restadmin.azurewebsites.net/api/v1/Order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderForCreation),
            }
          );
          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            throw new Error(
              `Failed to create order. Status: ${createResponse.status}, Response: ${errorText}`
            );
          }
          const createdOrder = await createResponse.json();
          orderId = createdOrder.Id;
        }

        console.log("Order created/updated successfully. Order ID:", orderId);

        // Send to kitchen
        console.log("Sending order to kitchen. Order ID:", orderId);
        const kitchenResponse = await fetch(
          `https://restadmin.azurewebsites.net/api/v1/Kitchen/create-from-order/${orderId}`,
          {
            method: "POST",
          }
        );
        if (!kitchenResponse.ok) {
          const errorText = await kitchenResponse.text();
          throw new Error(
            `Failed to send to kitchen. Status: ${kitchenResponse.status}, Response: ${errorText}`
          );
        }

        console.log("Order sent to kitchen successfully");

        // Update table state
        await updateTableState(selectedTable.Id, "Cocinando");

        // Refresh tables and close modal
        await fetchTables();
        setSelectedTable(null);
        setCurrentOrder(null);

        console.log("Process completed successfully");
      } catch (error) {
        console.error("Error processing order:", error);
        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }
        alert(`Error processing order: ${errorMessage}`);
      }
    } else {
      console.error("No current order or selected table");
      alert("No se puede enviar la orden: no hay orden actual o mesa seleccionada");
    }
  };



  const handlePreInvoice = async () => {
    if (selectedTable && currentOrder && currentOrder.Id !== 0) {
      try {
        // Crear factura a partir del pedido
        const invoiceResponse = await fetch(
          `https://restadmin.azurewebsites.net/api/v1/Invoice/create-from-order?orderId=${currentOrder.Id}`,
          {
            method: "POST",
          }
        );

        if (!invoiceResponse.ok) {
          throw new Error(
            `Failed to create invoice. Status: ${invoiceResponse.status}`
          );
        }

        console.log("Invoice created successfully");

        // Actualizar estado de la mesa
        await updateTableState(selectedTable.Id, "Por Facturar");

        // Cerrar modal y restablecer el pedido actual
        setSelectedTable(null);
        setCurrentOrder(null);

        // Refrescar mesas
        await fetchTables();

        console.log("Pre-invoice process completed");
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

  const updateTableState = async (tableId: number, newState: Table['State']) => {
    console.log("Updating table state:", tableId, newState);
    try {
      const currentTable = tables.find((table) => table.Id === tableId);
      if (!currentTable) {
        throw new Error("Table not found");
      }

      const response = await fetch(
        `https://restadmin.azurewebsites.net/api/v1/Tables/${tableId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...currentTable, State: newState }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update table state. Status: ${response.status}, Response: ${errorText}`
        );
      }

      let updatedTable: Table;
      const responseText = await response.text();
      
      if (responseText) {
        try {
          updatedTable = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
      } else {
        // If the response is empty, assume the update was successful
        // and use the current table data with the new state
        updatedTable = { ...currentTable, State: newState };
      }

      console.log("Table state updated on server:", updatedTable);

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.Id === tableId ? { ...table, State: newState } : table
        )
      );

      return updatedTable;
    } catch (error) {
      console.error("Error updating table state:", error);
      alert(
        `Error updating table state: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  };
  const addTable = async () => {
    const newTable: Omit<Table, "Id"> = {
      Name: `Mesa ${tables.length + 1}`,
      State: "Disponible",
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

        // Update the local state
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
  const filteredMenuItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.Category.Name === selectedCategory);

  return (
    <>
      <NavBar>
        <div className="flex items-center ">
          <MdTableRestaurant className="text-3xl text-gray-800" />
          <h1 className="ml-4 text-gray-800">Mesas</h1>
        </div>
        <div className="flex gap-4 mr-4 ">
          <Button
            className="flex items-center text-gray-800"
            onClick={addTable}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
            Agregar Mesa
          </Button>
          <Button className={`flex items-center`} onClick={removeTable}>
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            Eliminar Mesa
          </Button>
        </div>
      </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <TableCard
              key={table.Id}
              table={table}
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
