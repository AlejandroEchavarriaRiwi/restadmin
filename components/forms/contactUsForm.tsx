'use client'

import React, { useState } from 'react'
import { useForm, FieldError } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import styled from 'styled-components'

interface InputProps {
  hasError?: FieldError | undefined;
}

const FormContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #4a5568;
`

const Input = styled.input<InputProps>`
  padding: 0.5rem;
  border: 1px solid ${props => props.hasError ? '#e53e3e' : '#cbd5e0'};
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4299e1;
  }
`

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: #4299e1;
  }
`

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

const Button = styled.button`
  background-color: #F2CF5B;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`

const Toast = styled.div<{ isError: boolean }>`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  background-color: ${props => props.isError ? '#fed7d7' : '#c6f6d5'};
  color: ${props => props.isError ? '#9b2c2c' : '#276749'};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

interface FormularioCitasProps {
  titulo?: string;
  emailDestino: string;
}

interface FormData {
  nombre: string;
  email: string;
  fecha: string;
  hora: string;
  telefono: string;
  mensaje: string;
}

export default function FormularioCitas({ titulo = "Agendar Cita", emailDestino }: FormularioCitasProps) {
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setEnviando(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          ...data,
          email_destino: emailDestino
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC!
      );
      setToast({ show: true, message: 'Tu cita ha sido agendada. Te contactaremos pronto.', isError: false });
      reset();
    } catch (error) {
      console.error('Error al enviar el email:', error);
      setToast({ show: true, message: 'Hubo un problema al agendar tu cita. Por favor, intenta de nuevo.', isError: true });
    }
    setEnviando(false);
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 5000);
  };

  return (
    <FormContainer>
      <Title>{titulo}</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            {...register("nombre", { required: "Este campo es requerido" })}
            hasError={errors.nombre}
          />
          {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { 
              required: "Este campo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Dirección de email inválida"
              }
            })}
            hasError={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="telefono">Teléfono de contacto</Label>
          <Input
            id="telefono"
            type="tel"
            {...register("telefono", { 
              required: "Este campo es requerido",
              pattern: {
                value: /^[0-9]{9,}$/,
                message: "Número de teléfono inválido"
              }
            })}
            hasError={errors.telefono}
          />
          {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="fecha">Fecha preferida</Label>
          <Input
            id="fecha"
            type="date"
            {...register("fecha", { required: "Este campo es requerido" })}
            hasError={errors.fecha}
          />
          {errors.fecha && <ErrorMessage>{errors.fecha.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="hora">Hora estimada</Label>
          <Input
            id="hora"
            type="time"
            {...register("hora", { required: "Este campo es requerido" })}
            hasError={errors.hora}
          />
          {errors.hora && <ErrorMessage>{errors.hora.message}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="mensaje">Mensaje (opcional)</Label>
          <Textarea
            id="mensaje"
            {...register("mensaje")}
          />
        </FormGroup>
        <Button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Agendar Cita"}
        </Button>
      </Form>
      {toast.show && (
        <Toast isError={toast.isError}>
          {toast.message}
        </Toast>
      )}
    </FormContainer>
  )
}