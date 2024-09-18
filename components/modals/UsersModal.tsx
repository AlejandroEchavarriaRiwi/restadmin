"use client"

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { User, Role } from '../../models/user.models'

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 600;
`

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 425px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const DialogHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DialogTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`

const DialogDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-top: 8px;
`

const Form = styled.form`
  display: grid;
  gap: 16px;
`

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  gap: 16px;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  text-align: right;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 4px;
`

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`

const SaveButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  border: none;
  &:hover {
    background-color: #2563eb;
  }
`

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  &:hover {
    background-color: #e5e7eb;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  &:hover {
    color: #4b5563;
  }
`

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  user?: User | null
}

type UserFormData = Omit<User, 'Id' | 'Role'> & { password: string, RoleId: number }

const initialFormData: UserFormData = {
  Name: '',
  Email: '',
  PasswordHash: '',
  password: '',
  Phone: '',
  Address: '',
  RoleId: 0,
}

const fieldLabels: Record<string, string> = {
  Name: 'Nombre',
  Email: 'Correo electrónico',
  password: 'Contraseña',
  Phone: 'Teléfono',
  Address: 'Dirección',
  RoleId: 'Rol',
}

export default function UserModal({ isOpen, onClose, onSave, user }: ModalProps) {
  const [formData, setFormData] = useState<UserFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
        PasswordHash: user.PasswordHash,
        RoleId: user.Role.Id
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'RoleId' ? parseInt(value, 10) : value 
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.Name.trim()) newErrors.Name = 'El nombre es requerido'
    if (!formData.Email.trim()) newErrors.Email = 'El correo electrónico es requerido'
    if (!user && !formData.password.trim()) newErrors.password = 'La contraseña es requerida para nuevos usuarios'
    if (!formData.Phone.trim()) newErrors.Phone = 'El teléfono es requerido'
    if (!formData.Address.trim()) newErrors.Address = 'La dirección es requerida'
    if (!formData.RoleId) newErrors.RoleId = 'El rol es requerido'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      const userToSave: User = {
        ...formData,
        Id: user?.Id || 0,
        PasswordHash: formData.password ? formData.password : formData.PasswordHash,
        Role: { Id: formData.RoleId, Name: '' }
      }
      delete (userToSave as any).password
      onSave(userToSave)
    }
  }

  if (!isOpen) return null

  return (
    <DialogOverlay>
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle>{user ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
            <DialogDescription>
              {user ? 'Modifica los detalles del usuario aquí.' : 'Ingresa los detalles del nuevo usuario aquí.'}
            </DialogDescription>
          </div>
          <CloseButton onClick={onClose} aria-label="Cerrar">
            &times;
          </CloseButton>
        </DialogHeader>
        <Form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'Id' || key === 'PasswordHash') return null
            if (key === 'Role') return null
            return (
              <FormGroup key={key}>
                <Label htmlFor={key}>
                  {fieldLabels[key] || key}
                </Label>
                <div>
                  {key === 'RoleId' ? (
                    <Select 
                      id={key}
                      name={key}
                      value={value.toString()}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione un rol</option>
                      <option value="1">Mesero</option>
                      <option value="2">Administrador</option>
                      <option value="3">Cajero</option>
                    </Select>
                  ) : (
                    <Input
                      id={key}
                      name={key}
                      type={key === 'password' ? 'password' : 'text'}
                      value={typeof value === 'string' ? value : ''}
                      onChange={handleChange}
                      required={key !== 'password' || !user}
                    />
                  )}
                  {errors[key] && <ErrorMessage>{errors[key]}</ErrorMessage>}
                </div>
              </FormGroup>
            )
          })}
          <DialogFooter>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <SaveButton type="submit">Guardar</SaveButton>
          </DialogFooter>
        </Form>
      </DialogContent>
    </DialogOverlay>
  )
}