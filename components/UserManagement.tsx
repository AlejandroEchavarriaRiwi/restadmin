'use client'
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../components/buttons/Button';
import { useAuth } from '../hooks/useAuth';
import { User, UserFormData } from '../models/user.models';
import Modal from '../components/modals/UsersModal';

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

// Skeleton styles
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonCell = styled(SkeletonPulse)`
  height: 20px;
  width: 100%;
`;

const SkeletonRow = styled.tr`
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
`;

const TableSkeleton = () => (
  <tbody>
    {[...Array(5)].map((_, index) => (
      <SkeletonRow key={index}>
        <Td><SkeletonCell /></Td>
        <Td><SkeletonCell /></Td>
        <Td><SkeletonCell /></Td>
        <Td><SkeletonCell /></Td>
        <Td><SkeletonCell /></Td>
        <Td><SkeletonCell /></Td>
      </SkeletonRow>
    ))}
  </tbody>
);

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/v1/User`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number | undefined) => {
    if (userId === undefined) {
      alert('ID de usuario no válido');
      return;
    }
  
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${apiUrl}/v1/User/${userId.toString()}`, {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const isEditing = !!editingUser;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing && editingUser?.id 
        ? `${apiUrl}/v1/User/${editingUser.id.toString()}` 
        : `${apiUrl}/v1/User`;
  
      const dataToSend: Partial<User> = {
        id: isEditing ? editingUser!.id : 0,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        roleId: Number(userData.roleId)
      };
  
      // Solo incluir la contraseña si es un nuevo usuario o si se ha cambiado
      if (!isEditing || (isEditing && userData.password)) {
        dataToSend.passwordHash = userData.password;
      }
  
      console.log('Sending data:', JSON.stringify(dataToSend, null, 2));
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(dataToSend)
      });
  
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
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
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
          console.log('Parsed server response:', responseData);
        } catch (e) {
          console.warn('Error parsing JSON response:', e);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
      } else {
        console.warn('Empty response from server');
        responseData = {};
      }
  
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
        {isLoading ? (
          <TableSkeleton />
        ) : (
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
        )}
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