'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import useOrdersPolling from '@/hooks/useOrdersPolling';
import { DesktopNotification, MobileNotification, NotificationContainer } from '@/components/notifications/notifications';
import { Order } from '@/models/order.models';

type UserRole = 'Cajero' | 'Mesero' | 'Administrador' | 'guest';

interface NotificationWrapperProps {
    userRole: UserRole;
}

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({ userRole }) => {
    const { notifications, removeNotification, addNotification } = useNotifications();
    const [isMobile, setIsMobile] = useState(false);
    const [previousOrders, setPreviousOrders] = useState<Order[]>([]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const orders = userRole !== 'guest' ? useOrdersPolling(userRole as 'Cajero' | 'Mesero' | 'Administrador') : [];

    useEffect(() => {
        orders.forEach(order => {
            const previousOrder = previousOrders.find(po => po.Id === order.Id);
            
            if (!previousOrder || previousOrder.Status !== order.Status) {
                let shouldNotify = false;
                let message = '';

                switch (userRole) {
                    case 'Cajero':
                        if (order.Status === 0 || order.Status === 2) {
                            shouldNotify = true;
                            message = order.Status === 0 
                                ? `Orden ${order.Id} en cocina` 
                                : `Orden ${order.Id} lista para facturar`;
                        }
                        break;
                    case 'Mesero':
                        if (order.Status === 1) {
                            shouldNotify = true;
                            message = `Orden ${order.Id} lista para servir`;
                        }
                        break;
                    case 'Administrador':
                        shouldNotify = true;
                        message = `Orden ${order.Id} cambió a estado ${order.Status}`;
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
        setPreviousOrders(orders as Order[]);
    }, [orders, addNotification, userRole]);

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