'use client';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from "styled-components";

interface TopSellingProduct {
  productId: number;
  productName: string;
  totalSold: number;
  totalEarnings: number;
}

const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 400px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const ProductName = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #0070f3;
`;

const ProductInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
`;

// Skeleton styles
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonTitle = styled(SkeletonPulse)`
  height: 24px;
  width: 200px;
  margin-bottom: 15px;
`;

const SkeletonProductName = styled(SkeletonPulse)`
  height: 20px;
  width: 150px;
  margin-bottom: 10px;
`;

const SkeletonInfoItem = styled(SkeletonPulse)`
  height: 16px;
  width: 100%;
  margin-bottom: 5px;
`;

const SkeletonInfoValue = styled(SkeletonPulse)`
  height: 20px;
  width: 80%;
`;

const ProductSkeleton = () => (
  <CardContainer>
    <SkeletonTitle />
    <SkeletonProductName />
    <ProductInfo>
      <InfoItem>
        <SkeletonInfoItem />
        <SkeletonInfoValue />
      </InfoItem>
      <InfoItem>
        <SkeletonInfoItem />
        <SkeletonInfoValue />
      </InfoItem>
    </ProductInfo>
  </CardContainer>
);

export default function TopSellingProduct() {
  const [topProduct, setTopProduct] = useState<TopSellingProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopSellingProduct();
  }, []);

  const fetchTopSellingProduct = async () => {
    try {
      const response = await fetch('/api/v1/Product/topSellingProduct');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: TopSellingProduct = await response.json();
      setTopProduct(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching top selling product:", error);
      setError('Error al cargar el producto más vendido');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error) {
    return <CardContainer>{error}</CardContainer>;
  }

  if (!topProduct) {
    return <CardContainer>No se encontró información del producto más vendido.</CardContainer>;
  }

  return (
    <CardContainer>
      <Title>Producto Más Vendido</Title>
      <ProductName>{topProduct.productName}</ProductName>
      <ProductInfo>
        <InfoItem>
          <InfoLabel>Total Vendido</InfoLabel>
          <InfoValue>{topProduct.totalSold}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Ingresos Totales</InfoLabel>
          <InfoValue>${topProduct.totalEarnings.toLocaleString()}</InfoValue>
        </InfoItem>
      </ProductInfo>
    </CardContainer>
  );
}