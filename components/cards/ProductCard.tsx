import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Product } from '@/types/Imenu';

// Function to format the price
const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
};

// Styled-components
const Card = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 100%; /* Aspect ratio of square */
`;

const Content = styled.div`
    padding: 1rem;
`;

const Title = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
`;

const Category = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
`;

const PriceContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    gap: 1rem;
`;

const Price = styled.span`
    color: #f2cf5b; /* Tailwind "text-primary" equivalent */
    font-weight: 600;
`;

const Cost = styled.span`
    font-size: 0.875rem;
    color: #6b7280;
    text-align: right;
`;

// Main ProductCard component
interface ProductCardProps {
    product: Product;
    onClick: (id: number) => void;
    priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, priority = false }) => {
    return (
        <Card onClick={() => onClick(product.Id)}>
            <ImageWrapper>
                <Image
                    src={product.ImageURL || '/placeholder-image.jpg'}
                    alt={product.Name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    className="object-cover"
                />
            </ImageWrapper>
            <Content>
                <Title>{product.Name}</Title>
                <Category>Categoría: {product.Category?.Name || 'N/A'}</Category>
                <PriceContainer>
                    <Price>{formatPrice(product.Price)}</Price>
                    <Cost>Costo: {formatPrice(product.Cost)}</Cost>
                </PriceContainer>
            </Content>
        </Card>
    );
};

export default ProductCard;
