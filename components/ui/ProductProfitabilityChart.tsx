'use client'

import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import InputAlert from '../alerts/successAlert';

// Interfaces
interface SellingProduct {
  ProductId: number;
  ProductName: string;
  TotalSold: number;
  TotalEarnings: number;
}

interface ChartData {
  ProductName: string;
  ProfitPerUnit: number;
  percentage: number;
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
`;

const LoadingAnimation = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #e5e7eb;
  width: 100%;
  height: 20rem;
  border-radius: 50%;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
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

// Constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProductProfitabilityChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch selling products data
  const fetchSellingProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/Product/allSellingProducts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SellingProduct[] = await response.json();
      processChartData(data);
    } catch (error) {
      await InputAlert(
        "Error al obtener productos vendidos. Por favor, intente de nuevo.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchSellingProducts();
  }, [fetchSellingProducts]);

  // Process the fetched data for the chart
  const processChartData = (products: SellingProduct[]) => {
    const processedData = products.map(product => ({
      ProductName: product.ProductName,
      ProfitPerUnit: product.TotalEarnings / product.TotalSold,
      TotalSold: product.TotalSold
    }));

    const totalProfit = processedData.reduce((sum, product) => sum + (product.ProfitPerUnit * product.TotalSold), 0);

    const chartData = processedData.map(product => ({
      ProductName: product.ProductName,
      ProfitPerUnit: product.ProfitPerUnit,
      percentage: (product.ProfitPerUnit * product.TotalSold / totalProfit) * 100
    }));

    setChartData(chartData);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <TooltipContainer>
          <TooltipLabel>{data.ProductName}</TooltipLabel>
          <p>{`Rentabilidad por unidad: ${formatCurrency(data.ProfitPerUnit)}`}</p>
          <p>{`Porcentaje de rentabilidad total: ${data.percentage.toFixed(2)}%`}</p>
        </TooltipContainer>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <Title>Rentabilidad de Productos por Unidad</Title>
        <LoadingAnimation />
      </LoadingContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <ChartContainer>
        <Title>Rentabilidad de Productos por Unidad</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </ChartContainer>
    );
  }

  // Render chart
  return (
    <ChartContainer>
      <Title>Rentabilidad de Productos por Unidad</Title>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="ProfitPerUnit"
              nameKey="ProductName"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default ProductProfitabilityChart;