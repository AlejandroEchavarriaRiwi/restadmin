// app/dashboard/layout.tsx
'use client';

import React from 'react';
import NavBarAsideDashboard from '@/components/navbars/navbaraside';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationWrapper from '@/components/notifications/notificationsWrapper';
import { getUserRole } from '@/utils/auth';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const userRole = getUserRole();

    return (
        <NotificationProvider>
            <div className="flex h-screen">
                <aside className="flex-none h-full overflow-y-auto absolute z-[500] lg:relative lg:z-auto">
                    <NavBarAsideDashboard/>
                </aside>
                <main className="flex-1 overflow-y-auto ml-0 lg:ml-0 relative">
                    <div>
                        {children}
                    </div>
                    <NotificationWrapper userRole={userRole} />
                </main>
            </div>
        </NotificationProvider>
    );
};

export default DashboardLayout;