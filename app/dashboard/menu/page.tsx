'use client';
import React, { useEffect, useState, Key } from 'react';
import FormWithImageUpload from "@/components/buttons/uploadButton";
import styled from "styled-components";
import { AlertConfirm } from '@/components/alerts/questionAlert';
import InputAlert from '@/components/alerts/successAlert';


const Container = styled.div`
    margin: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
`;

interface Product {
    id: Key | null | undefined;
    name: string;
    price: number | string;
    cost: number | string;
    imageUrl: string;
}

const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice}`;
};

const ProductCard = ({ product, onClick }: { product: Product, onClick: (id: Key | null | undefined) => void }) => (
    <div
        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
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

export default function Menu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false); // Estado para el modo de eliminación

    useEffect(() => {
        fetch('http://localhost:8001/menu')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Formato de datos incorrecto");
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleProductAdded = (newProduct: Omit<Product, 'id'>) => {
        const productWithId: Product = { ...newProduct, id: products.length + 1 };
        setProducts([...products, productWithId]);
    };
    const handleDeleteProduct = async (id: Key | null | undefined) => {
        if (id === null || id === undefined) return;

        try {
            const result = await AlertConfirm('¿Estas seguro de querer eliminar este producto?');
            
            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:8001/menu/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProducts(products.filter(product => product.id !== id));
                    setIsDeleteMode(false); // Desactiva el modo de eliminación después de eliminar
                    await InputAlert('El producto ha sido exitosamente eliminado', 'success');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
        } catch (error) {
            console.error("Error al enviar solicitud DELETE:", error);
            await InputAlert('Error eliminando el producto', 'error');
        }
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
    };

    return (
        <div className="ml-[230px]">
            <div className="navbarSide">
                <button
                    className="                    px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Agregar Producto
                </button>
                <button
                    className={`px-4 py-2 mt-4 ml-4 font-bold text-white ${isDeleteMode ? 'bg-red-500' : 'bg-gray-500'} rounded hover:${isDeleteMode ? 'bg-red-700' : 'bg-gray-700'}`}
                    onClick={toggleDeleteMode}
                >
                    {isDeleteMode ? 'Cancelar Eliminación' : 'Eliminar Productos'}
                </button>
            </div>

            <Container>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={isDeleteMode ? handleDeleteProduct : () => {}}
                        />
                    ))
                ) : (
                    <p>No hay productos disponibles</p>
                )}
            </Container>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            className="float-right font-bold text-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            X
                        </button>
                        <FormWithImageUpload
                            setIsModalOpen={setIsModalOpen}
                            onProductAdded={handleProductAdded}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

