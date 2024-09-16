'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import { useAuth } from '../hooks/useAuth';
import { User, UserFormData } from '../models/user.models';
import Modal from '../components/modals/UsersModal'; // Asegúrate de tener este componente

const ModuleContainer = styled.div`
  padding: 20px;
  width: calc(100% - 220px);

  h1 {
    font-weight: bold;
    font-size: x-large;
    margin-bottom: 20px;
  }
`;

const Divcentertitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  thead th {
    text-align: center;
  }
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
`;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://restadmin.azurewebsites.net';
      const response = await fetch(`${apiUrl}/api/v1/User`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("No se pudieron obtener los usuarios:", error);
      setError(error instanceof Error ? error.message : 'Ocurrió un error desconocido');
    }
  };

  const handleDeleteUser = async (userId: number | undefined) => {
    if (userId === undefined) {
      alert('ID de usuario no válido');
      return;
    }
  
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://restadmin.azurewebsites.net';
        const response = await fetch(`${apiUrl}/api/v1/User/${userId.toString()}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}` // Asegúrate de que 'user' esté definido
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        fetchUsers(); // Actualiza la lista de usuarios
        alert('Usuario eliminado con éxito!');
      } catch (error) {
        console.error("No se pudo eliminar el usuario:", error);
        alert('Error al eliminar el usuario. Por favor, intente de nuevo.');
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };
  
  const handleSaveUser = async (userData: UserFormData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://restadmin.azurewebsites.net';
      const isEditing = !!editingUser;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing && editingUser?.id 
        ? `${apiUrl}/api/v1/User/${editingUser.id.toString()}` 
        : `${apiUrl}/api/v1/User`;
  
      const dataToSend: Partial<User> & { passwordHash?: string } = {
        id: isEditing ? editingUser!.id : 0,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        roleId: Number(userData.roleId),
        role: {
          id: Number(userData.roleId),
          name: getRoleName(Number(userData.roleId))
        },
        passwordHash: userData.password // Nota: En un caso real, el hash debería hacerse en el backend
      };
  
      console.log('Sending data:', JSON.stringify(dataToSend, null, 2));
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(dataToSend)
      });
  
      let responseText = '';
      try {
        responseText = await response.text();
        console.log('Raw response:', responseText);
      } catch (e) {
        console.error('Error reading response:', e);
      }
  
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage += `, message: ${errorData.message || JSON.stringify(errorData)}`;
          } catch (e) {
            errorMessage += `, body: ${responseText}`;
          }
        }
        throw new Error(errorMessage);
      }
  
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.warn('Error parsing JSON response:', e);
        responseData = {};
      }
  
      console.log('Parsed server response:', responseData);
  
      fetchUsers();
      handleCloseModal();
      alert(isEditing ? 'Usuario actualizado con éxito!' : 'Usuario creado con éxito!');
    } catch (error) {
      console.error("Error detallado al guardar el usuario:", error);
      let errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      if (error instanceof TypeError && errorMessage.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet y que el servidor esté accesible.';
      }
      
      alert(`Error al guardar el usuario: ${errorMessage}`);
    }
  };
  
  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1: return "Mesero";
      case 2: return "Administrador";
      case 3: return "Cajero";
      default: return "Desconocido";
    }
  };

  return (
    <ModuleContainer>
      <Divcentertitle>
        <h1>Administración de usuarios</h1>
        <Button onClick={handleCreateUser}>Crear nuevo usuario</Button>
      </Divcentertitle>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Table>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Celular</Th>
            <Th>Dirección</Th>
            <Th>Rol</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id ?? user.email}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone}</Td>
              <Td>{user.address}</Td>
              <Td>{getRoleName(user.roleId)}</Td>
              <Td>
                <ActionButton onClick={() => handleEditUser(user)}>Editar</ActionButton>
                <ActionButton onClick={() => handleDeleteUser(user.id)}>Borrar</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={editingUser}
        />
      )}
    </ModuleContainer>
  );
}