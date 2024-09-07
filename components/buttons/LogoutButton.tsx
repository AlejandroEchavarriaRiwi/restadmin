'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // Asegúrate de que la ruta sea correcta

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Utilizamos la función logout del hook useAuth
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Opcionalmente, puedes mostrar un mensaje de error al usuario
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="mt-auto mb-4 text-red-500"
      aria-label="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}