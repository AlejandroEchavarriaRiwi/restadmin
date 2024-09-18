'use client'

import React, { useEffect, useState } from 'react';

interface SellingProduct {
  ProductId: number;
  ProductName: string;
  TotalSold: number;
  TotalEarnings: number;
}

const ProductCard = ({ product }: { product: SellingProduct }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <h3 className="font-bold text-lg text-blue-600 mb-2">{product.ProductName}</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Total Vendido</p>
        <p className="font-semibold">{product.TotalSold}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Ingresos Totales</p>
        <p className="font-semibold">${product.TotalEarnings.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

export default function TopSellingProducts() {
  const [products, setProducts] = useState<SellingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSellingProducts();
  }, []);

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
      console.error("Error fetching selling products:", error);
      setError('Error al cargar los productos más vendidos');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos Más Vendidos</h2>
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div>No se encontró información de los productos más vendidos.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Productos Más Vendidos</h2>
      {products.map((product) => (
        <ProductCard key={product.ProductId} product={product} />
      ))}
    </div>
  );
}