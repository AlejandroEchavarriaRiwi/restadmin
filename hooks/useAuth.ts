import { useState, useEffect } from 'react';

interface User {
    id?: string;
    email: string;
    role: { roleId: number; roleName: string }[];
    name: string;
    token: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const validateUserData = (data: any): data is User => {
            return (
                typeof data === 'object' &&
                data !== null &&
                typeof data.email === 'string' &&
                typeof data.name === 'string' &&
                typeof data.token === 'string' &&
                Array.isArray(data.role) &&
                data.role.every((r: any) => 
                    typeof r === 'object' &&
                    typeof r.roleId === 'number' &&
                    typeof r.roleName === 'string'
                )
            );
        };

        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const parsedUser = JSON.parse(userStr);
                if (validateUserData(parsedUser)) {
                    setUser(parsedUser);
                } else {
                    throw new Error('Invalid user data structure in localStorage');
                }
            }
        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Invalid JSON in user data');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error loading user data');
            }
            localStorage.removeItem('user'); // Limpiamos los datos inválidos
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData: User) => {
        if (!userData.token) {
            setError('Login failed: No token provided');
            return;
        }
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setError(null);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    return { user, loading, error, login, logout };
}