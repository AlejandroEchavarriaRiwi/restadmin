'use client';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from "styled-components";
import { Product } from '@/types/Imenu';
import ProductCard from '@/components/cards/ProductCard';
import EditProductModal from '@/components/modals/EditProductModal';
import { AlertConfirm } from '@/components/alerts/questionAlert';
import InputAlert from '@/components/alerts/successAlert';
import ProductForm from '@/components/forms/NewProductForm';
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import Button from '@/components/ui/Button';

const Container = styled.div`
    margin: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
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
  background-size: 800px 200px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const ProductCardSkeleton = styled(SkeletonPulse)`
  height: 300px;
  border-radius: 8px;
`;

const ProductGridSkeleton = () => (
  <Container>
    {[...Array(8)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </Container>
);

export default function Menu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setIsLoading(true);
        fetch('/api/v1/Product')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Formato de datos incorrecto");
                }
            })
            .catch((error) => console.error("Error fetching data:", error))
            .finally(() => setIsLoading(false));
    };


    const handleProductAdded = (newProduct: Product) => {
        setProducts([...products, newProduct]);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            const result = await AlertConfirm('¿Estás seguro de querer eliminar este producto?');

            if (result.isConfirmed) {
                const response = await fetch(`https://restadmin.azurewebsites.net/api/v1/Product/{id}`, {
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
        <div className="">
            <nav className="bg-primary text-primary-foreground shadow-md">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Gestión de Productos</h1>
                        <div className="flex flex-wrap  justify-center gap-6 sm:justify-end sm:gap-10   ">
                            <Button
                                variant="secondary"
                                className="flex items-center"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                                Agregar Producto
                            </Button>
                            <Button
                                className={`flex items-center  ${isEditMode ? 'text-blue-600' : 'text-black'}`}
                                variant="secondary"
                                onClick={toggleEditMode}
                                disabled={isDeleteMode}
                            >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                {isEditMode ? 'Cancelar Edición' : 'Editar Productos'}
                            </Button>
                            <Button
                                className={`flex items-center ${isDeleteMode ? 'text-red-600' : 'text-black'}`}
                                variant="secondary"
                                onClick={toggleDeleteMode}
                                disabled={isEditMode}
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                {isDeleteMode ? 'Cancelar Eliminación' : 'Eliminar Productos'}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {isLoading ? (
                <ProductGridSkeleton />
            ) : (
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
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            className="absolute top-1 right-5 mt-2 px-2 py-2 bg-red-500 text-white rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            X
                        </button>
                        <ProductForm onProductAdded={handleProductAdded} setIsModalOpen={setIsModalOpen} onClose={() => setIsModalOpen(false)} />
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