'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import useOrdersPolling from '@/hooks/useOrdersPolling';
import { DesktopNotification, MobileNotification, NotificationContainer } from '@/components/notifications/notifications';
import { getUserRole } from '@/utils/auth';

type UserRole = 'Cajero' | 'Mesero' | 'Administrador' | 'guest';
type NotificationType = 'error' | 'info' | 'warning' | 'success';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationWrapperProps {
    initialUserRole?: UserRole;
}

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({ initialUserRole = 'guest' }) => {
    const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
    const { notifications, removeNotification, addNotification } = useNotifications();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        setUserRole(role);
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const typedAddNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        // Remover todas las notificaciones existentes antes de agregar la nueva
        notifications.forEach(n => removeNotification(n.id));
        addNotification(notification);
    }, [addNotification, removeNotification, notifications]);

    useOrdersPolling(userRole, typedAddNotification);

    // Obtener solo la última notificación
    const lastNotification = notifications.length > 0 ? notifications[notifications.length - 1] : null;

    return (
        <NotificationContainer>
            {lastNotification && (
                isMobile ? (
                    <MobileNotification
                        key={lastNotification.id}
                        {...lastNotification}
                        onClose={() => removeNotification(lastNotification.id)}
                    />
                ) : (
                    <DesktopNotification
                        key={lastNotification.id}
                        {...lastNotification}
                        onClose={() => removeNotification(lastNotification.id)}
                    />
                )
            )}
        </NotificationContainer>
    );
};

export default NotificationWrapper;