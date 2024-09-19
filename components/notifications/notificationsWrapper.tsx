'use client';

import React, { useState, useEffect } from 'react';
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
        console.log("Current user role:", role); // Debugging log
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Aseguramos que addNotification tenga el tipo correcto
    const typedAddNotification = (notification: Omit<Notification, 'id'>) => {
        addNotification(notification);
    };

    useOrdersPolling(userRole, typedAddNotification);

    useEffect(() => {
        console.log("Current notifications:", notifications); // Debugging log
    }, [notifications]);

    return (
        <NotificationContainer>
            {notifications.map(notification => {
                console.log("Rendering notification:", notification); // Debugging log
                return isMobile ? (
                    <MobileNotification
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ) : (
                    <DesktopNotification
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                );
            })}
        </NotificationContainer>
    );
};

export default NotificationWrapper;