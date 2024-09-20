import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/Imenu';

const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
};

interface ProductCardProps {
    product: Product;
    onClick: (id: number) => void;
    priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, priority = false }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => onClick(product.Id)}
        >
            <div className="relative aspect-square">
                <Image
                    src={product.ImageURL || '/placeholder-image.jpg'}
                    alt={product.Name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{product.Name}</h3>
                <p className="text-sm text-gray-500 mt-1">Categoría: {product.Category?.Name || 'N/A'}</p>
                <div className="flex justify-between items-center mt-2 gap-4">
                    <span className="text-primary font-semibold">{formatPrice(product.Price)}</span>
                    <span className="text-sm flex justify-self-end text-gray-500">Costo: {formatPrice(product.Cost)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;