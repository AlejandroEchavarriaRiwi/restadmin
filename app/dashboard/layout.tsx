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
            <aside className="flex-none h-full overflow-y-auto absolute z-[500] lg:relative lg:z-auto">
                <NavBarAsideDashboard/>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto ml-20 lg:ml-0">
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}