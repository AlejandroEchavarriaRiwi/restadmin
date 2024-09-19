import { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

interface Order {
  Id: number;
  Status: number;
  TablesId: number | null;
}

const useOrdersPolling = (userRole: 'Cajero' | 'Mesero' | 'Administrador') => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Order');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const newOrders: Order[] = await response.json();
        
        // Comparar con órdenes anteriores y notificar cambios
        newOrders.forEach(newOrder => {
          const oldOrder = orders.find(o => o.Id === newOrder.Id);
          if (oldOrder && oldOrder.Status !== newOrder.Status) {
            notifyOrderChange(newOrder, userRole);
          }
        });

        setOrders(newOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [userRole]);

  const notifyOrderChange = (order: Order, userRole: string) => {
    let shouldNotify = false;
    let message = '';

    switch (userRole) {
      case 'cajero':
        if (order.Status === 0 || order.Status === 2) {
          shouldNotify = true;
          message = order.Status === 0 ? 'Nueva orden en cocina' : 'Orden lista para facturar';
        }
        break;
      case 'mesero':
        if (order.Status === 1 && order.TablesId) {
          shouldNotify = true;
          message = `Orden lista para la mesa ${order.TablesId}`;
        }
        break;
      case 'admin':
        shouldNotify = true;
        message = `Orden ${order.Id} cambió a estado ${order.Status}`;
        break;
    }

    if (shouldNotify) {
      addNotification({ message, type: 'info' });
    }
  };

  return orders;
};

export default useOrdersPolling;