'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import UserForm from '../components/forms/NewUserForm';

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  adress: string;
  roles: (number | string)[];
}

const ModuleContainer = styled.div`
  margin-left: 220px;
  padding: 20px;
  width: 100% - 220px;

  h1 {
    font-weight: bold;
    font-size: x-large;
    margin-bottom: 20px;
  }
`;
const Divcentertitle  = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  thead th{
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8001/users');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Could not fetch users:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8001/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error("Could not delete user:", error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  return (
    <ModuleContainer>
      <Divcentertitle>
        <h1>Administración de usuarios</h1>
        <Button onClick={() => setShowCreateForm(true)}>Crear nuevo usuario</Button>
      </Divcentertitle>


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
            <tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone}</Td>
              <Td>{user.adress}</Td>
              <Td>{user.roles.includes(2) ? 'Cajero' : user.roles.includes(3) ? 'Mesero' : 'Admin'}</Td>
              <Td>
                <ActionButton onClick={() => handleEditUser(user)}>Editar</ActionButton>
                <ActionButton onClick={() => handleDeleteUser(user.id ?? '')}>Borrar</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showCreateForm && (
        <UserForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={() => {
            fetchUsers();
            setShowCreateForm(false);
          }}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={() => {
            fetchUsers();
            setEditingUser(null);
          }}
        />
      )}
    </ModuleContainer>
  );
}