import { useState, useEffect } from 'react';

interface User {
    token: string;
    email: string;
    name: string;
    roleId: number;
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
                typeof data.roleId === 'number'
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
            localStorage.removeItem('user'); // Clean invalid data
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