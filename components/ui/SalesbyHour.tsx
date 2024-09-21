'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesByHour {
  Hour: number;
  TotalInvoices: number;
}

const formatHour = (hour: number) => {
  return `${hour}:00`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md">
        <p className="font-bold">{`${formatHour(label)}`}</p>
        <p>{`Total: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export default function SalesByHourChart() {
  const [salesData, setSalesData] = useState<SalesByHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesByHour();
  }, []);

  const fetchSalesByHour = async () => {
    try {
      const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Product/salesByHour');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SalesByHour[] = await response.json();
      setSalesData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sales by hour data:", error);
      setError('Error al cargar los datos de ventas por hora');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full h-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Ventas por Hora</h2>
        <div className="flex items-center justify-center h-80">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Ventas por Hora</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas por Hora</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <XAxis dataKey="Hour" tickFormatter={formatHour} />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="TotalInvoices" fill="#0070f3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}