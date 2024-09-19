// utils/auth.ts

interface UserInfo {
    token: string;
    email: string;
    name: string;
    roleId: number;
  }
  
  export function getUserRole(): 'Cajero' | 'Mesero' | 'Administrador' | 'guest' {
    if (typeof window !== 'undefined' && window.localStorage) {
        // Estamos en el cliente, podemos usar localStorage
        try {
            const userString = localStorage.getItem('user');
            if (userString) {
                const user = JSON.parse(userString);
                switch (user.roleId) {
                    case 1: return 'Mesero';
                    case 2: return 'Administrador';
                    case 3: return 'Cajero';
                    default: return 'guest';
                }
            }
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
        }
    }
    // Si estamos en el servidor o no hay información de usuario, devolvemos 'guest'
    return 'guest';
}
  