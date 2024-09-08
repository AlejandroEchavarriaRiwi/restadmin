'use client';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Product } from '@/types/Imenu';
import ProductCard from '@/components/cards/ProductCard';
import EditProductModal from '@/components/modals/EditProductModal';
import FormWithImageUpload from "@/components/buttons/uploadButton";
import { AlertConfirm } from '@/components/alerts/questionAlert';
import InputAlert from '@/components/alerts/successAlert';

const Container = styled.div`
    margin: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
`;

export default function Menu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
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
    };

    const handleProductAdded = (newProduct: Product) => {
        setProducts([...products, newProduct]);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            const result = await AlertConfirm('¿Estás seguro de querer eliminar este producto?');

            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:8001/menu/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProducts(products.filter(product => product.id !== id));
                    setIsDeleteMode(false);
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

    const handleEditProduct = async (updatedProduct: Product) => {
        try {
            const response = await fetch(`http://localhost:8001/menu/${updatedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setEditingProduct(null);
                await InputAlert('El producto ha sido actualizado exitosamente', 'success');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("Error al enviar solicitud PUT:", error);
            await InputAlert('Error actualizando el producto', 'error');
        }
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setIsEditMode(false);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setIsDeleteMode(false);
    };

    const handleProductClick = (id: number) => {
        if (isDeleteMode) {
            handleDeleteProduct(id);
        } else if (isEditMode) {
            const productToEdit = products.find(p => p.id === id);
            if (productToEdit) {
                setEditingProduct(productToEdit);
            }
        }
    };

    return (
        <div className="ml-[230px]">
            <div className="navbarSide">
                <button
                    className="px-4 py-2 mt-4 font-bold text-white bg-azuloscuro rounded hover:bg-azulmedio"
                    onClick={() => setIsModalOpen(true)}
                >
                    Agregar Producto
                </button>
                <button
                    className={`px-4 py-2 mt-4 ml-4 font-bold text-white ${isEditMode ? 'bg-green-500' : 'bg-azulmedio'} rounded hover:${isEditMode ? 'bg-green-700' : 'bg-gray-700'}`}
                    onClick={toggleEditMode}
                    disabled={isDeleteMode}
                >
                    {isEditMode ? 'Cancelar Edición' : 'Editar Productos'}
                </button>
                <button
                    className={`px-4 py-2 mt-4 ml-4 font-bold text-white ${isDeleteMode ? 'bg-red-500' : 'bg-azulmedio'} rounded hover:${isDeleteMode ? 'bg-red-700' : 'bg-gray-700'}`}
                    onClick={toggleDeleteMode}
                    disabled={isEditMode}
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
                            onClick={handleProductClick}
                        />
                    ))
                ) : (
                    <p>No hay productos disponibles</p>
                )}
            </Container>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            className="absolute top-1 right-5 mt-2 px-2 py-2 bg-red-500 text-white rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            X
                        </button>
                        <FormWithImageUpload onProductAdded={handleProductAdded} setIsModalOpen={setIsModalOpen} onClose={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onSave={handleEditProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    );
}