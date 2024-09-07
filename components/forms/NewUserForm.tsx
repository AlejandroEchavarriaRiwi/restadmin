import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/buttons/Button';

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  adress: string;
  roles: (number | string)[];
}

interface UserFormProps {
  user?: User;
  onClose: () => void;
  onSubmit: () => void;
}

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
  h2{
    text-align: center;
    font-weight: bold;
    font-size: large;
    margin-bottom: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

export default function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<User>(user ?? {
    name: '',
    email: '',
    password: '',
    phone: '',
    adress: '',
    roles: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = parseInt(e.target.value);
    const newRoles = [role, role === 1 ? 'admin' : role === 2 ? 'cajero' : role === 3 ? 'mesero' : ''];
    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = user
        ? `http://localhost:8001/users/${user.id}`
        : 'http://localhost:8001/users';
      const method = user ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: user?.id ?? Date.now().toString(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      onSubmit();
      alert(user ? 'User updated successfully!' : 'User added successfully!');
    } catch (error) {
      console.error("Could not save user:", error);
    }
  };

  return (
    <Modal>
      <ModalContent>
        <h2>{user ? 'Editar usuario' : 'Crear nuevo usuario'}</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nombre"
            required
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Contraseña"
            required
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Celular"
          />
          <Input
            name="adress"
            value={formData.adress}
            onChange={handleInputChange}
            placeholder="Dirección"
          />
          <Select 
            name="roles" 
            onChange={handleRoleChange} 
            value={formData.roles[0]}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="1">Admin</option>
            <option value="2">Cajero</option>
            <option value="3">Mesero</option>
          </Select>
          <Button type="submit">{user ? 'Actualizar usuario' : 'Añadir usuario'}</Button>
          <Button onClick={onClose}>Cancelar</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
}