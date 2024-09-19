// app/dashboard/layout.tsx
import React from 'react';
import NavBarAsideDashboard from '@/components/navbars/navbaraside';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationWrapper from '@/components/notifications/notificationsWrapper';
import { getUserRole } from '@/utils/auth';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const initialUserRole = getUserRole();

    return (
        <NotificationProvider>
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="flex-none h-full overflow-y-auto absolute z-[500] lg:relative lg:z-auto">
                    <NavBarAsideDashboard/>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto ml-0 lg:ml-0 relative">
                    <div>
                        {children}
                    </div>
                    <NotificationWrapper initialUserRole={initialUserRole} />
                </main>
            </div>
        </NotificationProvider>
    );
};

export default DashboardLayout;