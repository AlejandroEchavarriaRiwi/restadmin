// components/notifications/notificationsWrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import useOrdersPolling from '@/hooks/useOrdersPolling';
import { DesktopNotification, MobileNotification, NotificationContainer } from '@/components/notifications/notifications';
import { getUserRole } from '@/utils/auth';

type UserRole = 'Cajero' | 'Mesero' | 'Administrador' | 'guest';

interface NotificationWrapperProps {
    initialUserRole?: UserRole;
}

const NotificationWrapper: React.FC<NotificationWrapperProps> = ({ initialUserRole = 'guest' }) => {
    const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
    const { notifications, removeNotification } = useNotifications();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setUserRole(getUserRole());
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Ahora siempre llamamos a useOrdersPolling, incluso para 'guest'
    const orders = useOrdersPolling(userRole);

    return (
        <NotificationContainer>
            {notifications.map(notification => 
                isMobile ? (
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
                )
            )}
        </NotificationContainer>
    );
};

export default NotificationWrapper;