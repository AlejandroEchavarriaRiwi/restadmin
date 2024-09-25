'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InputAlert from '../alerts/successAlert';

// Interface for the SalesByHour data structure
interface SalesByHour {
  Hour: number;
  TotalInvoices: number;
}

// Styled components
const ChartContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const ChartWrapper = styled.div`
  height: 20rem;
`;

const LoadingContainer = styled(ChartContainer)`
  height: 24rem;
  text-align: center;
`;

const LoadingAnimation = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #e5e7eb;
  width: 100%;
  height: 20rem;
  border-radius: 0.25rem;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

const TooltipContainer = styled.div`
  background-color: white;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TooltipLabel = styled.p`
  font-weight: bold;
`;

// Helper functions
const formatHour = (hour: number) => {
  return `${hour}:00`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <TooltipLabel>{`${formatHour(label)}`}</TooltipLabel>
        <p>{`Total: ${formatCurrency(payload[0].value)}`}</p>
      </TooltipContainer>
    );
  }
  return null;
};

// Main component
export default function SalesByHourChart() {
  const [salesData, setSalesData] = useState<SalesByHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchSalesByHour();
  }, []);

  // Function to fetch sales by hour data
  const fetchSalesByHour = async () => {
    try {
      const response = await fetch('/api/v1/Product/salesByHour');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SalesByHour[] = await response.json();
      setSalesData(data);
      setIsLoading(false);
    } catch (error) {
      await InputAlert(
        "Error al obtener ventas por hora. Por favor, intente de nuevo.",
        "error"
      );
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <Title>Ventas por Hora</Title>
        <LoadingAnimation />
      </LoadingContainer>
    );
  }

  // Render chart
  return (
    <ChartContainer>
      <Title>Ventas por Hora</Title>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <XAxis dataKey="Hour" tickFormatter={formatHour} />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="TotalInvoices" fill="#0070f3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
}