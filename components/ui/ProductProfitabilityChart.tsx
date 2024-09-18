'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProductProfitabilityChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellingProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/Product/allSellingProducts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SellingProduct[] = await response.json();
      processChartData(data);
    } catch (error) {
      console.error("Error fetching selling products:", error);
      setError('Error al cargar los datos de rentabilidad de productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellingProducts();
  }, [fetchSellingProducts]);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-bold">{data.ProductName}</p>
          <p>{`Rentabilidad por unidad: ${formatCurrency(data.ProfitPerUnit)}`}</p>
          <p>{`Porcentaje de rentabilidad total: ${data.percentage.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full h-96">
        <h2 className="text-2xl font-bold mb-4">Rentabilidad de Productos por Unidad</h2>
        <div className="flex items-center justify-center h-80">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Rentabilidad de Productos por Unidad</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Rentabilidad de Productos por Unidad</h2>
      <div className="h-80">
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
      </div>
    </div>
  );
};

export default ProductProfitabilityChart;