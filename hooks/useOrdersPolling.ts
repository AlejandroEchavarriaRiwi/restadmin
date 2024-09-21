'use client';

import { useState, useEffect, useCallback } from 'react';

interface Order {
  Id: number;
  Status: number;
  TablesId: number | null;
}

type UserRole = 'Cajero' | 'Mesero' | 'Administrador' | 'guest';
type NotificationType = 'error' | 'info' | 'warning' | 'success';

const useOrdersPolling = (
  userRole: UserRole, 
  addNotification: (notification: { message: string; type: NotificationType }) => void
) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const getStatusDescription = (status: number): string => {
    switch (status) {
      case 0:
        return "cocinando";
      case 1:
        return "listo para la mesa";
      case 2:
        return "listo para facturar";
      case 3:
        return "facturado";
      default:
        return "estado desconocido";
    }
  };
  
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
        message = `Orden ${order.Id} cambió a estado: ${getStatusDescription(order.Status)}`;
        break;
    }
  
    if (shouldNotify) {
      addNotification({ message, type: 'info' });
    }
  }, [userRole, addNotification]);

  const fetchOrders = useCallback(async () => {
    if (userRole === 'guest') return;

    try {
      const response = await fetch('/api/v1/Order');
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