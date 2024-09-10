'use client';

import NavBarAsideDashboard from '@/components/navbars/navbaraside';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}

            <aside className="flex-shrink-0 sticky transition-all duration-300 ease-in-out">
                <NavBarAsideDashboard />
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
