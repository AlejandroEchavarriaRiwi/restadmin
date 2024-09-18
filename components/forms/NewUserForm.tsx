import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/buttons/Button';

interface User {
  Id?: number;
  Name: string;
  Email: string;
  PasswordHash: string;
  Phone: string;
  Address: string;
  RoleId: number;
}

interface UserFormProps {
  user?: User;
  onClose: () => void;
  onSubmit: (user: User) => void;
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
  h2 {
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 2px;
`;

export default function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<User>(user ?? {
    Name: '',
    Email: '',
    PasswordHash: '',
    Phone: '',
    Address: '',
    RoleId: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.Name.trim()) newErrors.Name = 'El nombre es requerido';
    if (!formData.Email.trim()) newErrors.Email = 'El email es requerido';
    if (!user && !formData.PasswordHash.trim()) newErrors.PasswordHash = 'La contraseña es requerida';
    if (!formData.Phone.trim()) newErrors.Phone = 'El teléfono es requerido';
    if (!formData.Address.trim()) newErrors.Address = 'La dirección es requerida';
    if (formData.RoleId === 0) newErrors.RoleId = 'El rol es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = user
        ? `/api/v1/User/${user.Id}`
        : '/api/v1/User';
      const method = user ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Could not save user:", error);
      setErrors({ submit: 'Error al guardar el usuario. Por favor, intente de nuevo.' });
    }
  };

  return (
    <Modal>
      <ModalContent>
        <h2>{user ? 'Editar usuario' : 'Crear nuevo usuario'}</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            placeholder="Nombre"
            required
          />
          {errors.Name && <ErrorMessage>{errors.Name}</ErrorMessage>}
          <Input
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          {errors.Email && <ErrorMessage>{errors.Email}</ErrorMessage>}
          {!user && (
            <>
              <Input
                name="PasswordHash"
                type="password"
                value={formData.PasswordHash}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required
              />
              {errors.PasswordHash && <ErrorMessage>{errors.PasswordHash}</ErrorMessage>}
            </>
          )}
          <Input
            name="Phone"
            value={formData.Phone}
            onChange={handleInputChange}
            placeholder="Celular"
            required
          />
          {errors.Phone && <ErrorMessage>{errors.Phone}</ErrorMessage>}
          <Input
            name="Address"
            value={formData.Address}
            onChange={handleInputChange}
            placeholder="Dirección"
            required
          />
          {errors.Address && <ErrorMessage>{errors.Address}</ErrorMessage>}
          <Select 
            name="RoleId" 
            onChange={handleInputChange} 
            value={formData.RoleId}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="1">Admin</option>
            <option value="2">Cajero</option>
            <option value="3">Mesero</option>
          </Select>
          {errors.RoleId && <ErrorMessage>{errors.RoleId}</ErrorMessage>}
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          <Button type="submit">{user ? 'Actualizar usuario' : 'Añadir usuario'}</Button>
          <Button onClick={onClose}>Cancelar</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
}