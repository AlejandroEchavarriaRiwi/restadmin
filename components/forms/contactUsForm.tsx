'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'

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
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{titulo}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="nombre"
              type="text"
              {...register("nombre", { required: "Este campo es requerido" })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { 
                required: "Este campo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de email inválida"
                }
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
            <input
              id="telefono"
              type="tel"
              {...register("telefono", { 
                required: "Este campo es requerido",
                pattern: {
                  value: /^[0-9]{9,}$/,
                  message: "Número de teléfono inválido"
                }
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
          </div>
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha preferida</label>
            <input
              id="fecha"
              type="date"
              {...register("fecha", { required: "Este campo es requerido" })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.fecha ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fecha && <p className="mt-1 text-xs text-red-500">{errors.fecha.message}</p>}
          </div>
          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora estimada</label>
            <input
              id="hora"
              type="time"
              {...register("hora", { required: "Este campo es requerido" })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.hora ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.hora && <p className="mt-1 text-xs text-red-500">{errors.hora.message}</p>}
          </div>
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje (opcional)</label>
            <textarea
              id="mensaje"
              {...register("mensaje")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ${enviando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {enviando ? "Enviando..." : "Agendar Cita"}
          </button>
        </form>
      </div>
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${toast.isError ? 'bg-red-500' : 'bg-green-500'} transition-all duration-300 transform translate-y-0 opacity-100`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}