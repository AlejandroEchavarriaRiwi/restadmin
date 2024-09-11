'use client';

import NavBarAsideDashboard from '@/components/navbars/navbaraside';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="flex-none h-full overflow-y-auto">
                <NavBarAsideDashboard />
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}