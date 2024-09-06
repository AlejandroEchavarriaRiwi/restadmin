import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    roles: { roleId: number; roleName: string }[];
    name: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const parsedUser = JSON.parse(userStr);
                if (parsedUser && Array.isArray(parsedUser.roles)) {
                    setUser(parsedUser);
                } else {
                    throw new Error('Invalid user data in localStorage');
                }
            }
        } catch (err) {
            console.error('Error parsing user data:', err);
            setError('Error loading user data');
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, loading, error, logout };
}