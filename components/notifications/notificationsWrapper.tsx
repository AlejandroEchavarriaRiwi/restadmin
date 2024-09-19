// components/notifications/notificationsWrapper.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import useOrdersPolling from '@/hooks/useOrdersPolling';
import { DesktopNotification, MobileNotification, NotificationContainer } from '@/components/notifications/notifications';
import { Order } from '@/models/order.models'; // Asegúrate de que esta importación es correcta

type UserRole = 'Cajero' | 'Mesero' | 'Administrador' | 'guest';

interface NotificationWrapperProps {
    userRole: UserRole;
}

// Definimos un tipo para los datos que devuelve useOrdersPolling
type PolledOrder = Omit<Order, 'Observations' | 'TableName' | 'Products'> & {
    Observations?: string;
    TableName?: string | null;
    Products?: { Name: string; Quantity: number; }[];
};

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({ userRole }) => {
    const { notifications, removeNotification, addNotification } = useNotifications();
    const [isMobile, setIsMobile] = useState(false);
    const [previousOrders, setPreviousOrders] = useState<Order[]>([]);

    const polledOrders = useOrdersPolling(userRole as 'Cajero' | 'Mesero' | 'Administrador');

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const checkOrderChanges = useCallback(() => {
        if (userRole === 'guest') return;

        const completeOrders: Order[] = polledOrders.map((order: PolledOrder): Order => ({
            ...order,
            Observations: order.Observations || '',
            TableName: order.TableName || null,
            Products: order.Products || []
        }));

        completeOrders.forEach((order: Order) => {
            const previousOrder = previousOrders.find(po => po.Id === order.Id);
            
            if (!previousOrder || previousOrder.Status !== order.Status) {
                let shouldNotify = false;
                let message = '';

                switch (userRole) {
                    case 'Cajero':
                        if (order.Status === 0 || order.Status === 2) {
                            shouldNotify = true;
                            message = order.Status === 0 
                                ? `Orden ${order.Id} Mesa ${order.TableName} en cocina` 
                                : `Orden ${order.Id} Mesa ${order.TableName} lista para facturar`;
                        }
                        break;
                    case 'Mesero':
                        if (order.Status === 1) {
                            shouldNotify = true;
                            message = `Orden ${order.Id} Mesa ${order.TableName} lista para servir`;
                        }
                        break;
                    case 'Administrador':
                        shouldNotify = true;
                        message = `Orden ${order.Id} Mesa ${order.TableName} cambió a estado ${order.Status}`;
                        break;
                }

                if (shouldNotify) {
                    addNotification({
                        message,
                        type: 'info'
                    });
                }
            }
        });

        setPreviousOrders(completeOrders);
    }, [polledOrders, userRole, previousOrders, addNotification]);

    useEffect(() => {
        checkOrderChanges();
    }, [checkOrderChanges]);

    return (
        <NotificationContainer>
            {notifications.map(notification => 
                isMobile ? (
                    <MobileNotification
                        key={notification.id}
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={removeNotification}
                    />
                ) : (
                    <DesktopNotification
                        key={notification.id}
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={removeNotification}
                    />
                )
            )}
        </NotificationContainer>
    );
};

export default NotificationWrapper;