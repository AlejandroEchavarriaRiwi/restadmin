'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('email');
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [router]);

    return <div>{children}</div>;
}