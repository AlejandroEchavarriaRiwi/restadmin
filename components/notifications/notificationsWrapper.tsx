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

  useOrdersPolling(userRole, addNotification);

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        isMobile ? (
          <MobileNotification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ) : (
          <DesktopNotification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        )
      ))}
    </NotificationContainer>
  );
};

export default NotificationWrapper;