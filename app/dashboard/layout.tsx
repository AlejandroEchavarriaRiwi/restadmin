'use client';

import NavBarAsideDashboard from '@/components/navbars/navbaraside';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="relative min-h-screen">
            <main className="relative z-10">
            <aside>
                <NavBarAsideDashboard/>
            </aside>
                <div>
                    {children}
                </div>

            </main>
        </div>

    );
}