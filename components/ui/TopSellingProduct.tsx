'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Interface for the SellingProduct data structure
interface SellingProduct {
  ProductId: number;
  ProductName: string;
  TotalSold: number;
  TotalEarnings: number;
}

// Styled components
const Container = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
`;

const ProductName = styled.h3`
  font-weight: bold;
  font-size: 1.125rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Value = styled.p`
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
`;

// ProductCard component
const ProductCard = ({ product }: { product: SellingProduct }) => (
  <Card>
    <ProductName>{product.ProductName}</ProductName>
    <Grid>
      <div>
        <Label>Total Vendido</Label>
        <Value>{product.TotalSold}</Value>
      </div>
      <div>
        <Label>Ingresos Totales</Label>
        <Value>${product.TotalEarnings.toLocaleString()}</Value>
      </div>
    </Grid>
  </Card>
);

// SkeletonCard component for loading state
const SkeletonCard = () => (
  <Card>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <Grid>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    </Grid>
  </Card>
);

// Main component
export default function TopSellingProducts() {
  const [products, setProducts] = useState<SellingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchSellingProducts();
  }, []);

  // Function to fetch top selling products
  const fetchSellingProducts = async () => {
    try {
      const response = await fetch('/api/v1/Product/allSellingProducts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SellingProduct[] = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      setError('Error al cargar los productos más vendidos');
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container>
        <Title>Productos Más Vendidos</Title>
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </Container>
    );
  }

  // Render error state
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  // Render empty state
  if (products.length === 0) {
    return <div>No se encontró información de los productos más vendidos.</div>;
  }

  // Render products
  return (
    <Container>
      <Title>Productos Más Vendidos</Title>
      {products.map((product) => (
        <ProductCard key={product.ProductId} product={product} />
      ))}
    </Container>
  );
}