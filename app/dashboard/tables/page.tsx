'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './style.sass';
import Button from '../../../components/buttons/Button';

interface Table {
  id: string;
  name: string;
  state: 'available' | 'in_use' | 'order_pending' | 'to_invoice';
}

interface MenuItem {
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
  margin-left: 220px;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
`;

const NavBar = styled.nav`
  margin-left: 220px;
  background-color: #f8f9fa;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableCard = styled.div<{ state: Table['state'] }>`
  width: 200px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${props => {
    switch (props.state) {
      case 'available': return '#d4edda';
      case 'in_use': return '#cce5ff';
      case 'order_pending': return '#fff3cd';
      case 'to_invoice': return '#f8d7da';
      default: return '#ffffff';
    }
  }};
  border: 2px solid ${props => {
    switch (props.state) {
      case 'available': return '#28a745';
      case 'in_use': return '#007bff';
      case 'order_pending': return '#ffc107';
      case 'to_invoice': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  cursor: pointer;
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
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const MenuItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItemListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchTables();
    fetchMenuItems();
  }, []);

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
        await updateTableState(selectedTable.id, 'order_pending');
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

  const handleInvoice = async () => {
    if (selectedTable) {
      try {
        // Fetch the order for the selected table
        const orderResponse = await fetch(`http://localhost:8001/orders?tableId=${selectedTable.id}`);
        const orders = await orderResponse.json();

        if (orders.length === 0) {
          throw new Error('No order found for this table');
        }

        const order = orders[0]; // Assume there's only one order per table

        // Create a new invoice in 'factura'
        const invoiceResponse = await fetch('http://localhost:8001/factura', {
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

        if (!invoiceResponse.ok) {
          throw new Error(`Failed to create invoice. Status: ${invoiceResponse.status}`);
        }

        console.log('Invoice created successfully');

        // Delete the order from 'orders'
        await fetch(`http://localhost:8001/orders/${order.id}`, {
          method: 'DELETE',
        });

        console.log('Order removed from orders');

        // Delete the order from 'kitchen'
        const kitchenResponse = await fetch(`http://localhost:8001/kitchen?tableId=${selectedTable.id}`);
        const kitchenOrders = await kitchenResponse.json();

        for (const kitchenOrder of kitchenOrders) {
          await fetch(`http://localhost:8001/kitchen/${kitchenOrder.id}`, {
            method: 'DELETE',
          });
        }

        console.log('Order removed from kitchen');

        // Update table state
        await updateTableState(selectedTable.id, 'to_invoice');
        console.log('Table state updated to to_invoice');

        // Close modal and reset current order
        setSelectedTable(null);
        setCurrentOrder(null);

        // Refresh tables
        await fetchTables();

        console.log('Invoice process completed');

      } catch (error) {
        console.error('Error handling invoice:', error);
        alert(`Error handling invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      name: `Table ${tables.length + 1}`,
      state: 'available'
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

  return (
    <>
      <NavBar>
        <h1>Restaurant Tables</h1>
        <div>
          <Button onClick={addTable}>Add Table</Button>
          <Button onClick={removeTable} $disabled={tables.length === 0} $variant="danger">
            Remove Table
          </Button>
        </div>
      </NavBar>
      <Container>
        {tables.length > 0 ? (
          tables.map((table) => (
            <TableCard key={table.id} state={table.state} onClick={() => handleTableClick(table)}>
              <h2>{table.name}</h2>
              <p>State: {table.state}</p>
            </TableCard>
          ))
        ) : (
          <h2>No tables available</h2>
        )}
      </Container>
      {selectedTable && currentOrder && (
        <Modal onClick={() => setSelectedTable(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{selectedTable.name} - Order</h2>
            <h3>Menu Items:</h3>
            <MenuItemList>
              {menuItems.map((item) => (
                <MenuItemListItem key={item.id}>
                  <span>{item.name} - ${item.price}</span>
                  <div>
                    <Button onClick={() => handleAddMenuItem(item)}>+</Button>
                    <Button onClick={() => handleRemoveMenuItem(item)} $variant="secondary">-</Button>
                  </div>
                </MenuItemListItem>
              ))}
            </MenuItemList>
            <h3>Current Order:</h3>
            <MenuItemList>
              {currentOrder.items.map((item, index) => (
                <MenuItemListItem key={index}>
                  <span>{item.name} - ${item.price} x {item.quantity}</span>
                </MenuItemListItem>
              ))}
            </MenuItemList>
            <h3>Observations:</h3>
            <TextArea
              value={currentOrder.observations}
              onChange={(e) => setCurrentOrder({...currentOrder, observations: e.target.value})}
              placeholder="Enter any special instructions or observations here..."
              rows={4}
            />
            <Button onClick={handleSendToKitchen}>Send to Kitchen</Button>
            <Button onClick={handleInvoice} $variant="secondary">Invoice</Button>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}