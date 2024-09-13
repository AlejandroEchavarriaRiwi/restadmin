'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './style.sass';
import Button from '../../../components/ui/Button';
import TableCard from '@/components/ui/StyledTableCard'
import { PlusCircle, Trash2, CreditCard, ChefHat } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar';
}

interface MenuItem {
  imageUrl: string;
  category: string;
  id: string;
  name: string;
  price: number;
  cost: number;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface Order {
  id?: string;
  tableId: string;
  items: OrderItem[];
  observations: string;
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
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1{
    font-weight: bold;
    font-size: x-large;
  }
  @media screen and (max-width: 600px){
    flex-direction:column;
    h1{
      margin-left: 0;
    }
    div{
      flex-direction: column;
      margin-top: 10px;
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
  @media screen and (max-width: 600px){
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
    height: 100%
  }
`;

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  button{
    position: absolute;
    right: 5px;
  }
  h2{
    font-size: x-large;
    font-weight: bold;
  }
`;

const ModalBody = styled.div`
  display: flex;
  height: 90%;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    height: 95%
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
  }
`;

const OrderSection = styled.div`
  width: 40%;
  padding: 5px;
  display: flex;
  flex-direction: column;

  h3{
    font-size: large;
    font-weight: bold;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    height: 50%;
    
    div.buttons{
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
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
  border: 1px solid #ced4da;
  border-radius: 4px;
  @media screen and (max-width: 600px) {
    margin-bottom: 2px;
  }
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#4655c4' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 5px;
  &:hover {
    background-color: ${props => props.active ? '#637ad6' : '#e9ecef'};
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
    scrollbar-width: none;  /* Para Firefox */
    -ms-overflow-style: none;  /* Para Internet Explorer y Edge */
    
    &::-webkit-scrollbar {
      display: none;  /* Para Chrome, Safari y Opera */
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
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  @media screen and (max-width: 600px) {
    flex: 0 0 auto;
    width: 150px;  /* O el ancho que prefieras para móviles */
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
  h4{
    font-weight: bold;
    font-size: large;
  }
  span{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchTables();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));
      setCategories(['Todos', ...uniqueCategories]);
      setSelectedCategory('Todos');
    }
  }, [menuItems]);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8001/tables');
      if (!response.ok) {
        throw new Error(`Failed to fetch tables. Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTables(data);
        console.log('Tables updated:', data);
      } else {
        throw new Error("Incorrect data format");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert(`Error fetching tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8001/menu');
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items. Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setMenuItems(data);
      } else {
        throw new Error("Incorrect menu data format");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      alert(`Error fetching menu items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    fetchOrder(table.id);
  };

  const fetchOrder = async (tableId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/orders?tableId=${tableId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.length > 0) {
        setCurrentOrder(data[0]);
      } else {
        setCurrentOrder({ tableId, items: [], observations: '' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setCurrentOrder({ tableId, items: [], observations: '' });
    }
  };

  const handleAddMenuItem = (menuItem: MenuItem) => {
    if (currentOrder) {
      const existingItem = currentOrder.items.find(item => item.id === menuItem.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentOrder.items.push({ ...menuItem, quantity: 1 });
      }
      setCurrentOrder({ ...currentOrder });
    }
  };

  const handleRemoveMenuItem = (menuItem: MenuItem) => {
    if (currentOrder) {
      const existingItemIndex = currentOrder.items.findIndex(item => item.id === menuItem.id);
      if (existingItemIndex !== -1) {
        if (currentOrder.items[existingItemIndex].quantity > 1) {
          currentOrder.items[existingItemIndex].quantity -= 1;
        } else {
          currentOrder.items.splice(existingItemIndex, 1);
        }
        setCurrentOrder({ ...currentOrder });
      }
    }
  };

  const handleSendToKitchen = async () => {
    if (currentOrder && selectedTable) {
      try {
        console.log('Processing order for kitchen:', currentOrder);

        // Check if an order already exists
        const existingOrderResponse = await fetch(`http://localhost:8001/orders?tableId=${selectedTable.id}`);
        const existingOrders = await existingOrderResponse.json();

        let savedOrder;
        if (existingOrders.length > 0) {
          // Update existing order
          const existingOrder = existingOrders[0];
          savedOrder = {
            ...existingOrder,
            items: currentOrder.items,
            observations: currentOrder.observations
          };

          const updateResponse = await fetch(`http://localhost:8001/orders/${existingOrder.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(savedOrder),
          });

          if (!updateResponse.ok) {
            throw new Error(`Failed to update order. Status: ${updateResponse.status}`);
          }

          savedOrder = await updateResponse.json();
        } else {
          // Create new order
          const createResponse = await fetch(`http://localhost:8001/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentOrder),
          });

          if (!createResponse.ok) {
            throw new Error(`Failed to create order. Status: ${createResponse.status}`);
          }

          savedOrder = await createResponse.json();
        }

        console.log('Order saved successfully:', savedOrder);

        // Update kitchen
        const existingKitchenResponse = await fetch(`http://localhost:8001/kitchen?tableId=${selectedTable.id}`);
        const existingKitchenOrders = await existingKitchenResponse.json();

        if (existingKitchenOrders.length > 0) {
          // If exists, update it
          const kitchenUpdateResponse = await fetch(`http://localhost:8001/kitchen/${existingKitchenOrders[0].id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(savedOrder),
          });

          if (!kitchenUpdateResponse.ok) {
            throw new Error(`Failed to update kitchen order. Status: ${kitchenUpdateResponse.status}`);
          }
        } else {
          // If not, create a new one
          const kitchenCreateResponse = await fetch(`http://localhost:8001/kitchen`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(savedOrder),
          });

          if (!kitchenCreateResponse.ok) {
            throw new Error(`Failed to send to kitchen. Status: ${kitchenCreateResponse.status}`);
          }
        }

        console.log('Order sent to kitchen successfully');

        // Update table state
        await updateTableState(selectedTable.id, 'Cocinando');
        console.log('Table state updated successfully');

        // Refresh tables
        await fetchTables();
        console.log('Tables refreshed');

        // Close modal
        setSelectedTable(null);
        setCurrentOrder(null);
        console.log('Modal closed');

      } catch (error) {
        console.error('Error processing order:', error);
        alert(`Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handlePreInvoice = async () => {
    if (selectedTable) {
      try {
        // Fetch the order for the selected table
        const orderResponse = await fetch(`http://localhost:8001/orders?tableId=${selectedTable.id}`);
        const orders = await orderResponse.json();

        if (orders.length === 0) {
          throw new Error('No order found for this table');
        }

        const order = orders[0]; // Assume there's only one order per table

        // Create a new pre-invoice in 'preinvoices'
        const preInvoiceResponse = await fetch('http://localhost:8001/preinvoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableId: selectedTable.id,
            items: order.items,
            observations: order.observations,
            total: order.items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + item.price * item.quantity, 0),
            date: new Date().toISOString()
          }),
        });

        if (!preInvoiceResponse.ok) {
          throw new Error(`Failed to create pre-invoice. Status: ${preInvoiceResponse.status}`);
        }

        console.log('Pre-invoice created successfully');

        // Delete the order from 'orders'
        const deleteOrderResponse = await fetch(`http://localhost:8001/orders/${order.id}`, {
          method: 'DELETE',
        });

        if (!deleteOrderResponse.ok) {
          throw new Error(`Failed to delete order. Status: ${deleteOrderResponse.status}`);
        }

        console.log('Order removed from orders');

        // Delete the order from 'kitchen'
        const kitchenResponse = await fetch(`http://localhost:8001/kitchen?tableId=${selectedTable.id}`);
        const kitchenOrders = await kitchenResponse.json();

        for (const kitchenOrder of kitchenOrders) {
          const deleteKitchenResponse = await fetch(`http://localhost:8001/kitchen/${kitchenOrder.id}`, {
            method: 'DELETE',
          });

          if (!deleteKitchenResponse.ok) {
            throw new Error(`Failed to delete kitchen order. Status: ${deleteKitchenResponse.status}`);
          }
        }

        console.log('Order removed from kitchen');

        // Update table state
        await updateTableState(selectedTable.id, 'Por facturar');
        console.log('Table state updated to Por facturar');

        // Close modal and reset current order
        setSelectedTable(null);
        setCurrentOrder(null);

        // Refresh tables
        await fetchTables();

        console.log('Pre-invoice process completed');

      } catch (error) {
        console.error('Error handling pre-invoice:', error);
        alert(`Error handling pre-invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const updateTableState = async (tableId: string, newState: Table['state']) => {
    console.log('Updating table state:', tableId, newState);
    try {
      const currentTable = tables.find(table => table.id === tableId);
      if (!currentTable) {
        throw new Error('Table not found');
      }

      const response = await fetch(`http://localhost:8001/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...currentTable, state: newState }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update table state. Status: ${response.status}, Response: ${errorText}`);
      }

      const updatedTable = await response.json();
      console.log('Table state updated on server:', updatedTable);

      setTables(prevTables =>
        prevTables.map(table =>
          table.id === tableId ? { ...table, state: newState } : table
        )
      );

      return updatedTable;
    } catch (error) {
      console.error('Error updating table state:', error);
      alert(`Error updating table state: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const addTable = async () => {
    const newTable: Table = {
      id: `${tables.length + 1}`,
      name: `Mesa ${tables.length + 1}`,
      state: 'Disponible'
    };

    try {
      const response = await fetch('http://localhost:8001/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTable),
      });

      if (!response.ok) {
        throw new Error(`Failed to add table. Status: ${response.status}`);
      }

      const data = await response.json();
      setTables([...tables, data]);
    } catch (error) {
      console.error('Error adding table:', error);
      alert(`Error adding table: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const removeTable = async () => {
    if (tables.length > 0) {
      const lastTable = tables[tables.length - 1];

      try {
        // First, remove related orders
        const ordersResponse = await fetch(`http://localhost:8001/orders?tableId=${lastTable.id}`);
        const relatedOrders = await ordersResponse.json();
        for (const order of relatedOrders) {
          await fetch(`http://localhost:8001/orders/${order.id}`, {
            method: 'DELETE',
          });
        }
        console.log(`Removed ${relatedOrders.length} related orders`);

        // Next, remove related kitchen orders
        const kitchenResponse = await fetch(`http://localhost:8001/kitchen?tableId=${lastTable.id}`);
        const relatedKitchenOrders = await kitchenResponse.json();
        for (const kitchenOrder of relatedKitchenOrders) {
          await fetch(`http://localhost:8001/kitchen/${kitchenOrder.id}`, {
            method: 'DELETE',
          });
        }
        console.log(`Removed ${relatedKitchenOrders.length} related kitchen orders`);

        // Finally, remove the table
        const tableResponse = await fetch(`http://localhost:8001/tables/${lastTable.id}`, {
          method: 'DELETE',
        });

        if (!tableResponse.ok) {
          throw new Error(`Failed to delete table. Status: ${tableResponse.status}`);
        }

        // Update the local state
        setTables(prevTables => prevTables.slice(0, -1));
        console.log('Table removed successfully');

      } catch (error) {
        console.error('Error removing table:', error);
        alert(`Error removing table: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const filteredMenuItems = selectedCategory === 'Todos'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <NavBar>
        <h1 className='ml-4 text-gray-800'>Mesas</h1>
        <div className='flex gap-4 mr-4 '>
          <Button
            className="flex items-center text-gray-800"
            onClick={addTable}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
            Agregar Mesa
          </Button>
          <Button
            className={`flex items-center`}
            onClick={removeTable}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            Eliminar Mesa
          </Button>
        </div>
      </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <TableCard
              key={table.id}
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
              <h2>{selectedTable.name} - Orden</h2>
              <Button onClick={() => setSelectedTable(null)}>Cerrar</Button>
            </ModalHeader>
            <ModalBody>
              <MenuSection>
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
                  {filteredMenuItems.map((item) => (
                    <MenuItem key={item.id} onClick={() => handleAddMenuItem(item)}>
                      <img src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover" />
                      <div>{item.name}</div>
                      <div>${item.price}</div>
                    </MenuItem>
                  ))}
                </MenuItemGrid>
              </MenuSection>
              <OrderSection>
                <h3>Pedido:</h3>
                <OrderList>
                  {currentOrder.items.map((item, index) => (
                    <DivOrder key={index}>
                      <span>{item.name} - ${item.price} <h4>x {item.quantity}</h4></span>
                      <Button onClick={() => handleRemoveMenuItem(item)}>-</Button>
                    </DivOrder>
                  ))}
                </OrderList>
                <h3>Observaciones:</h3>
                <TextArea
                  value={currentOrder.observations}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, observations: e.target.value })}
                  placeholder="Introduzca aquí cualquier instrucción u observación especial..."
                  rows={4}
                />
                <div className='buttons'>
                  <Button className='flex gap-1' onClick={handleSendToKitchen}>
                    <ChefHat />
                    Enviar a Cocina
                  </Button>
                  <Button className='flex gap-1' onClick={handlePreInvoice}>
                    <CreditCard />
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