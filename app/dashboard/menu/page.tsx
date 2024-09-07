'use client';
import React, { useEffect, useState } from 'react';
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
    id: number;
    name: string;
    price: number | string;
    cost: number | string;
    imageUrl: string;
}

const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice}`;
};

const ProductCard = ({ product, onClick }: { product: Product, onClick: (id: number) => void }) => (
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

const EditProductModal = ({ product, onSave, onClose }: { product: Product, onSave: (updatedProduct: Product) => void, onClose: () => void }) => {
    const [editedProduct, setEditedProduct] = useState(product);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedProduct);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedProduct.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="cost"
                            name="cost"
                            value={editedProduct.cost}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
        setIsEditMode(false); // Ensure edit mode is disabled
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setIsDeleteMode(false); // Ensure delete mode is disabled
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
                    disabled={isDeleteMode} // Disable if in delete mode
                >
                    {isEditMode ? 'Cancelar Edición' : 'Editar Productos'}
                </button>
                <button
                    className={`px-4 py-2 mt-4 ml-4 font-bold text-white ${isDeleteMode ? 'bg-red-500' : 'bg-azulmedio'} rounded hover:${isDeleteMode ? 'bg-red-700' : 'bg-gray-700'}`}
                    onClick={toggleDeleteMode}
                    disabled={isEditMode} // Disable if in edit mode
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
