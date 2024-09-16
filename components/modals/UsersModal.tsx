import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, UserFormData } from '../../models/user.models';

const ModalBackground = styled.div`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 5px;
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserFormData) => void;
  user?: User | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    roleId: 1,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        address: user.address,
        roleId: user.roleId,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        roleId: 1,
      });
    }
    setErrors({});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'roleId' ? parseInt(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!user && !formData.password.trim()) newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    } else {
      console.log('Validation failed', errors);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <h2>{user ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required={!user}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
          {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
          
          <Select name="roleId" value={formData.roleId} onChange={handleChange}>
            <option value={1}>Mesero</option>
            <option value={2}>Administrador</option>
            <option value={3}>Cajero</option>
          </Select>
          
          <div>
            <Button type="submit">Guardar</Button>
            <Button type="button" onClick={onClose}>Cancelar</Button>
          </div>
        </Form>
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;