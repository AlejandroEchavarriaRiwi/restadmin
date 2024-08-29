'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBarAsideDashboard from '@/components/navbars/navbaraside';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('email');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

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