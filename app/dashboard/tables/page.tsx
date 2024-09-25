"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import Button from "../../../components/ui/Button";
import TableCard from "@/components/ui/StyledTableCard";
import { PlusCircle, CreditCard, ChefHat, Minus, RefreshCw } from "lucide-react";
import { MdTableRestaurant } from "react-icons/md";
import InputAlert from "@/components/alerts/successAlert";
import { Order, Product, Table } from "@/models/table.models";



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

type TableState = "Disponible" | "Cocinando" | "Ocupada" | "Por Facturar";

export default function Tables() {
  // State definitions
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchTables();
    fetchMenuItems();
    fetchOrders();
  }, []);

  // Set up categories when menu items are loaded
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = Array.from(
        new Set(menuItems.map((item) => item.Category.Name))
      );
      setCategories(["Todos", ...uniqueCategories]);
      setSelectedCategory("Todos");
    }
  }, [menuItems]);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/v1/Order");
      if (!response.ok) {
        throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      await InputAlert("Error actualizando el estado de las ordenes","error")
    }
  };

  // Handle table selection
  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    const tableOrder = orders.find((order) => order.TablesId === table.Id && (order.Status === 0 || order.Status === 1 || order.Status === 2));

    if (tableOrder) {
      setCurrentOrder(tableOrder);
      updateTableState(table.Id, getTableStatus(table.Id));
    } else {
      setCurrentOrder(createEmptyOrder(table.Id));
    }
  };

  // Create an empty order for a new table
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

  // Fetch tables from the API
  const fetchTables = async () => {
    try {
      const response = await fetch("/api/v1/Tables");
      if (!response.ok) {
        throw new Error(`Failed to fetch tables. Status: ${response.status}`);
      }
      const data: Table[] = await response.json();
      setTables(data);
    } catch (error) {
      await InputAlert("Error actualizando el estado de las mesas","error")
    }
  };

  // Fetch menu items from the API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/v1/Product");
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items. Status: ${response.status}`);
      }
      const data = await response.json();
      // Filter products to include only those with Status = 0
      const enabledProducts = data.filter((product: Product) => product.Status === 0);
      setMenuItems(enabledProducts);
    } catch (error) {
      await InputAlert("Error obteniendo el menú","error")
    }
  };

  // Add a menu item to the current order
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

  // Remove a menu item from the current order
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

  // Handle pre-invoice action
  const handlePreInvoice = async () => {
    if (currentOrder && currentOrder.Id !== 0) {
      try {
        const bodyForUpdate = {
          TablesId: currentOrder.TablesId || 0,
          Observations: currentOrder.Observations,
          Status: 2,
          OrderProducts: currentOrder.Products.map(product => ({
            ProductId: product.Id,
            OrderId: currentOrder.Id || 0,
            Quantity: product.Quantity
          }))
        };

        const response = await fetch(
          `/api/v1/Order/${currentOrder.Id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyForUpdate),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update order status. Status: ${response.status}`);
        }

        await fetchOrders();
        setSelectedTable(null);
        setCurrentOrder(null);

      } catch (error) {
        await InputAlert("Error actualizando el estado de la prefactura","error")
      }
    }
  };

  // Handle sending order to kitchen
  const handleSendToKitchen = async () => {
    if (currentOrder && selectedTable) {
      try {
        const orderForCreation = {
          TablesId: selectedTable.Id,
          Observations: currentOrder.Observations,
          Status: 0, // Set to "Cocinando" for new orders
          OrderProducts: currentOrder.Products.map((product) => ({
            ProductId: product.Id,
            OrderId: currentOrder.Id || 0,
            Quantity: product.Quantity,
          })),
        };

        let response;
        if (currentOrder.Id !== 0) {
          // Existing order, just update it
          response = await fetch(
            `/api/v1/Order/${currentOrder.Id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...currentOrder, Status: 0 }), // Set to "Cocinando"
            }
          );
        } else {
          // New order, create it
          response = await fetch("/api/v1/Order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderForCreation),
          });
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to ${currentOrder.Id !== 0 ? "update" : "create"} order. Status: ${response.status}, Response: ${errorText}`
          );
        }

        await InputAlert('La orden se ha enviado a cocina exitosamente', 'success')

        // Update table state to "Cocinando" after sending the order
        updateTableState(selectedTable.Id, "Cocinando");

        await fetchOrders();
        setSelectedTable(null);
        setCurrentOrder(null);
      } catch (error) {
        await InputAlert('Ha ocurrido un error mientras se envia a cocina', 'error')
      }
    }
  };

  // Handle updating an existing order
  const handleUpdateOrder = async () => {
    if (currentOrder && selectedTable) {
      try {
        const orderForUpdate = {
          TablesId: selectedTable.Id,
          Observations: currentOrder.Observations,
          Status: 0, // Set back to "Cocinando"
          OrderProducts: currentOrder.Products.map(product => ({
            ProductId: product.Id,
            OrderId: currentOrder.Id || 0,
            Quantity: product.Quantity
          }))
        };

        const response = await fetch(
          `/api/v1/Order/${currentOrder.Id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderForUpdate),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update order. Status: ${response.status}, Response: ${errorText}`
          );
        }

        await fetchOrders();
        setSelectedTable(null);
        setCurrentOrder(null);

      } catch (error) {
        await InputAlert("Error actualizando el estado de la orden","error")
      }
    }
  };

  // Add a new table
  const addTable = async () => {
    try {
      const newTable: Omit<Table, "Id"> = {
        Name: `Mesa ${tables.length + 1}`,
        State: "Disponible"
      };

      const response = await fetch(
        "/api/v1/Tables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTable),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add table. Status: ${response.status}. Error: ${errorText}`);
      }

      const data = await response.json();
      setTables([...tables, data]);
    } catch (error) {
      await InputAlert("Error añadiendo la mesa","error")
    }
  };

  // Get the current status of a table
  const getTableStatus = useCallback((tableId: number): TableState => {
    const tableOrders = orders.filter(order => order.TablesId === tableId);
    if (tableOrders.length === 0) return "Disponible";

    // Sort orders by ID in descending order (latest created first)
    tableOrders.sort((a, b) => b.Id - a.Id);

    // Take the status of the first order (latest created)
    const latestOrder = tableOrders[0];

    switch (latestOrder.Status) {
      case 0: return "Cocinando";
      case 1: return "Ocupada";
      case 2: return "Por Facturar";
      case 3: // Completed
      case 4: // Cancelled
        return "Disponible";
      default: return "Disponible";
    }
  }, [orders]);

  // Update the state of a table
  const updateTableState = useCallback(async (tableId: number, newState: string) => {
    try {
      const updatedTableData = {
        Id: tableId,
        Name: tables.find((table) => table.Id === tableId)?.Name || "",
        State: newState,
      };
      const response = await fetch(`/api/v1/Tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTableData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update table state. Status: ${response.status}. Error: ${errorText}`);
      }

      // Update local table state
      setTables(prevTables =>
        prevTables.map(table =>
          table.Id === tableId ? { ...table, State: newState } : table
        )
      );
    } catch (error) {
      await InputAlert("Error actualizando el estado de la mesa","error")
    }
  }, [tables]);

  const prevOrders = useRef<Order[]>([]); // Initialize prevOrders ref

  // Effect to update table states when order statuses change
  useEffect(() => {
    // Check if there's any change in order statuses that affect the tables
    const hasOrderStatusChanged = orders.some(order => {
      const prevOrder = prevOrders.current.find(prev => prev.Id === order.Id);
      return prevOrder ? prevOrder.Status !== order.Status : true; // New order or status changed
    });

    if (hasOrderStatusChanged) {
      // Update table states only if there's a relevant change in orders
      tables.forEach(table => {
        const newState = getTableStatus(table.Id);
        if (newState !== table.State) {
          updateTableState(table.Id, newState);
        }
      });
    }

    // Store the current orders for comparison in the next render
    prevOrders.current = orders;
  }, [orders, tables, getTableStatus, updateTableState]);

  // Remove the last available table
  const removeTable = async () => {
    if (tables.length > 0) {
      // Find the last table that doesn't have an active order
      const tableToRemove = [...tables].reverse().find(table => {
        const tableOrder = orders.find(order => order.TablesId === table.Id && order.Status !== 4 && order.Status !== 5);
        return !tableOrder;
      });

      if (tableToRemove) {
        try {
          const tableResponse = await fetch(
            `/api/v1/Tables/${tableToRemove.Id}`,
            {
              method: "DELETE",
            }
          );

          if (!tableResponse.ok) {
            throw new Error(
              `Failed to delete table. Status: ${tableResponse.status}`
            );
          }

          setTables((prevTables) => prevTables.filter(t => t.Id !== tableToRemove.Id));
          
        } catch (error) {
          await InputAlert("Error actualizando el estado de la mesa","error")
        }
      } else {
        await InputAlert("No hay mesas para eliminar","error")
      }
    }
  };

  // Filter menu items based on selected category
  const filteredMenuItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.Category.Name === selectedCategory);

  // Render component
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
          {/* <Button className={`flex items-center`} onClick={removeTable}
          disabled>
            <Trash2 className="mr-2 h-6 w-6 text-red-500" />
            Eliminar Mesa
          </Button> */}
        </div>
      </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <TableCard
              key={table.Id}
              table={{ ...table, State: getTableStatus(table.Id) }}
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
                  {/* Show "Send to Kitchen" only when the table is "Disponible" and there are items in the order */}
                  {selectedTable?.State === "Disponible" && currentOrder?.Products?.length > 0 && (
                    <Button
                      className="flex gap-1 border-2 p-2 rounded-lg bg-[#fdfaef] border-[#d97706] items-center text-gray-600 flex-col lg:flex-row w-[150px] justify-center lg:w-[180px]"
                      onClick={handleSendToKitchen}
                    >
                      <ChefHat className="text-[#d97706]" />
                      Enviar a Cocina
                    </Button>
                  )}

                  {/* Show "Update Order" only when the table is "Cocinando" or "Ocupada" */}
                  {(selectedTable?.State === "Cocinando" || selectedTable?.State === "Ocupada") && (
                    <Button
                      className="flex gap-1 border-2 p-2 rounded-lg bg-[#dbeafe] border-[#2563eb] text-gray-600 items-center flex-col lg:flex-row w-[150px] justify-center lg:w-[180px]"
                      onClick={handleUpdateOrder}
                    >
                      <RefreshCw className="text-[#2563eb]" />
                      Actualizar Orden
                    </Button>
                  )}

                  {selectedTable?.State === "Ocupada" && currentOrder?.Products?.length > 0 && (
                    <Button
                      className="flex gap-1 border-2 p-2 rounded-lg bg-[#fff4f4] border-[#a71c1c] text-gray-600 items-center flex-col lg:flex-row w-[150px] justify-center lg:w-[180px]"
                      onClick={handlePreInvoice}
                      disabled={currentOrder.Products.length === 0}
                    >
                      <CreditCard className="text-[#a71c1c]" />
                      Pre-facturar
                    </Button>
                  )}
                </div>

              </OrderSection>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
