// hooks/useOrdersPolling.ts
import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

interface Order {
  Id: number;
  Status: number;
  TablesId: number | null;
}

const useOrdersPolling = (userRole: 'Cajero' | 'Mesero' | 'Administrador' | 'guest') => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { addNotification } = useNotifications();

  const notifyOrderChange = useCallback((order: Order) => {
    if (userRole === 'guest') return;

    let shouldNotify = false;
    let message = '';

    switch (userRole) {
      case 'Cajero':
        if (order.Status === 0 || order.Status === 2) {
          shouldNotify = true;
          message = order.Status === 0 ? 'Nueva orden en cocina' : 'Orden lista para facturar';
        }
        break;
      case 'Mesero':
        if (order.Status === 1 && order.TablesId) {
          shouldNotify = true;
          message = `Orden lista para la mesa ${order.TablesId}`;
        }
        break;
      case 'Administrador':
        shouldNotify = true;
        message = `Orden ${order.Id} cambió a estado ${order.Status}`;
        break;
    }

    if (shouldNotify) {
      addNotification({ message, type: 'info' });
    }
  }, [userRole, addNotification]);

  const fetchOrders = useCallback(async () => {
    if (userRole === 'guest') return;

    try {
      const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Order');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const newOrders: Order[] = await response.json();
      
      newOrders.forEach(newOrder => {
        const oldOrder = orders.find(o => o.Id === newOrder.Id);
        if (oldOrder && oldOrder.Status !== newOrder.Status) {
          notifyOrderChange(newOrder);
        }
      });

      setOrders(newOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [orders, notifyOrderChange, userRole]);

  useEffect(() => {
    if (userRole === 'guest') {
      setOrders([]);
      return;
    }

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [fetchOrders, userRole]);

  return orders;
};

export default useOrdersPolling;