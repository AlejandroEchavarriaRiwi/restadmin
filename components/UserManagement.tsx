'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/buttons/Button';

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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
`;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    name: '',
    email: '',
    password: '',
    phone: '',
    adress: '',
    roles: [],
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isEditMode: boolean = false) => {
    const { name, value } = e.target;
    if (isEditMode) {
      setEditingUser(prev => prev ? { ...prev, [name]: value } : null);
    } else {
      setNewUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>, isEditMode: boolean = false) => {
    const role = parseInt(e.target.value);
    const newRoles = [role, role === 1 ? 'admin': role === 2 ? 'cajero' : role === 3 ? 'mesero' : ''];
    if (isEditMode) {
      setEditingUser(prev => prev ? { ...prev, roles: newRoles } : null);
    } else {
      setNewUser(prev => ({ ...prev, roles: newRoles }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          id: Date.now().toString(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchUsers();
      setNewUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        adress: '',
        roles: [],
      });
      alert('User added successfully!');
    } catch (error) {
      console.error("Could not add user:", error);
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

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const response = await fetch(`http://localhost:8001/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchUsers();
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error("Could not update user:", error);
    }
  };

  return (
    <ModuleContainer>
      <h1>User Management</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <Input
          name="email"
          type="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <Input
          name="password"
          type="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <Input
          name="phone"
          value={newUser.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <Input
          name="adress"
          value={newUser.adress}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <Select name="roles" onChange={handleRoleChange} required>
          <option value="">Select Role</option>
          <option value="1">Admin</option>
          <option value="2">Cajero</option>
          <option value="3">Mesero</option>
        </Select>
        <Button type="submit">Add User</Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Address</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
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
                <ActionButton onClick={() => handleEditUser(user)}>Edit</ActionButton>
                <ActionButton onClick={() => handleDeleteUser(user.id ?? '')}>Delete</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUser && (
        <Modal>
          <ModalContent>
            <h2>Edit User</h2>
            <Form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
              <Input
                name="name"
                value={editingUser.name}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Name"
                required
              />
              <Input
                name="email"
                type="email"
                value={editingUser.email}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Email"
                required
              />
              <Input
                name="password"
                type="password"
                value={editingUser.password}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Password"
                required
              />
              <Input
                name="phone"
                value={editingUser.phone}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Phone"
              />
              <Input
                name="adress"
                value={editingUser.adress}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Address"
              />
              <Select 
                name="roles" 
                onChange={(e) => handleRoleChange(e, true)} 
                value={editingUser.roles[0]}
                required
              >
                <option value="">Select Role</option>
                <option value="1">Admin</option>
                <option value="2">Cajero</option>
                <option value="3">Mesero</option>
              </Select>
              <Button type="submit">Update User</Button>
              <Button onClick={() => setEditingUser(null)}>Cancel</Button>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </ModuleContainer>
  );
}