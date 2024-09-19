// utils/auth.ts

interface UserInfo {
    token: string;
    email: string;
    name: string;
    roleId: number;
  }
  
  export function getUserRole(): 'Cajero' | 'Mesero' | 'Administrador' | 'guest' {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        return 'guest';
      }
  
      const userInfo: UserInfo = JSON.parse(userString);
  
      switch (userInfo.roleId) {
        case 1:
          return 'Mesero';
        case 2:
          return 'Administrador';
        case 3:
          return 'Cajero';
        default:
          console.warn('Rol desconocido:', userInfo.roleId);
          return 'guest';
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return 'guest';
    }
  }