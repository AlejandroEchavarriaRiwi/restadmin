import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, Role } from '../../models/user.models';

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
  onSave: (user: User) => void;
  user?: User | null;
}

// Definimos UserFormData basado en la estructura de User
type UserFormData = Omit<User, 'Id' | 'Role'> & { password: string };

const initialFormData: UserFormData = {
  Name: '',
  Email: '',
  PasswordHash: '',
  password: '', // Campo adicional para la contraseña en el formulario
  Phone: '',
  Address: '',
  RoleId: 1,
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Campo adicional para la contraseña en el formulario
        PasswordHash: user.PasswordHash // Mantenemos el PasswordHash existente
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'RoleId' ? parseInt(value, 10) : value 
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.Name.trim()) newErrors.Name = 'El nombre es requerido';
    if (!formData.Email.trim()) newErrors.Email = 'El email es requerido';
    if (!user && !formData.password.trim()) newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    if (!formData.Phone.trim()) newErrors.Phone = 'El teléfono es requerido';
    if (!formData.Address.trim()) newErrors.Address = 'La dirección es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const userToSave: User = {
        ...formData,
        Id: user?.Id || 0, // Si es un nuevo usuario, usamos 0 o algún valor por defecto
        PasswordHash: formData.password ? formData.password : formData.PasswordHash, // Usamos la nueva contraseña si se proporciona
        Role: { Id: formData.RoleId, Name: '' } // Asumimos que el nombre del rol se manejará en el backend
      };
      delete (userToSave as any).password; // Eliminamos el campo password adicional
      onSave(userToSave);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContent>
        <h2>{user ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        <Form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'RoleId' || key === 'PasswordHash') return null;
            return (
              <React.Fragment key={key}>
                <Input
                  name={key}
                  type={key === 'password' ? 'password' : 'text'}
                  value={value}
                  onChange={handleChange}
                  placeholder={key}
                  required={key !== 'password' || !user}
                />
                {errors[key] && <ErrorMessage>{errors[key]}</ErrorMessage>}
              </React.Fragment>
            );
          })}
          
          <Select name="RoleId" value={formData.RoleId} onChange={handleChange}>
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