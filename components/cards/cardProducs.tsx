// ProductCard.tsx
import React from 'react';

export interface Product {
    id: number;
    name: string;
    price: number | string;
    cost: number | string;
    imageUrl: string; 
}

interface ProductCardProps {
    product: Product;
    onClick: (id: number) => void;
    isDeleteMode: boolean; // Nueva prop para modo de eliminación
}

const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice}`;
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isDeleteMode }) => (
    <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer ${isDeleteMode ? 'shake' : ''}`} // Aplicar clase condicionalmente
        onClick={() => onClick(product.id)}
    >
        <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
        />
        <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                <span className="text-sm text-gray-500">Cost: {formatPrice(product.cost)}</span>
            </div>
        </div>
    </div>
);

export default ProductCard;
