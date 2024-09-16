'use client';

import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import useFormStore from '../../app/dashboard/store';
import SubmitAlert from '../alerts/submitAlert';

interface Product {
    id: number;
    name: string;
    cost: number;
    price: number;
    imageUrl: string;
    category: string;
}

interface FormWithImageUploadProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onProductAdded: (product: Product) => void;
    onClose: () => void;
}

const FormWithImageUpload: React.FC<FormWithImageUploadProps> = ({ setIsModalOpen, onProductAdded, onClose }) => {
    const { name, price, cost, setName, setPrice, setCost, setImageURL } = useFormStore();
    const [localImageUrl, setLocalImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8001/categories');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
    
                // Mapear los objetos para obtener solo los nombres de las categorías
                const categoryNames = data.map((category: { name: string }) => category.name);
    
                setCategories(categoryNames);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    
        fetchCategories();
    }, []);

    const handleUploadSuccess = (result: any) => {
        if (result && result.info && result.info.secure_url) {
            setLocalImageUrl(result.info.secure_url);
            setImageURL(result.info.secure_url);
        } else {
            console.error('Error: No se encontró secure_url en el resultado de la carga.');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8001/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    cost,
                    price,
                    imageURL: localImageUrl,
                    category,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Form submitted:', data);

            const newProduct: Product = {
                id: data.id,
                name,
                cost,
                price,
                imageUrl: localImageUrl,
                category,
            };

            onProductAdded(newProduct);

            SubmitAlert("El producto fue añadido exitosamente", "success", () => {
                setIsModalOpen(false);
                onClose();
            });

            setName('');
            setCost(0);
            setPrice(0);
            setImageURL('');
            setLocalImageUrl('');
            setCategory('');
            setNewCategory('');
            setIsAddingCategory(false);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleAddCategory = async () => {
        if (newCategory.trim() === '') return;

        try {
            const response = await fetch('http://localhost:8001/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (typeof data.name === 'string') {
                setCategories((prevCategories) => [...prevCategories, data.name]);
                setNewCategory('');
                setIsAddingCategory(false);
            } else {
                console.error('Response data is not a string:', data);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-semibold mb-1">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Ingresa el nombre del producto"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.valueAsNumber)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ingresa el costo"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ingresa el precio"
                        />
                    </div>
                </div>
                <div className="relative">
                    <label htmlFor="category" className="block font-semibold mb-1">Categoría:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white shadow-md transition-opacity duration-300 ease-in-out"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Añadir Nueva Categoría
                    </button>
                    {isAddingCategory && (
                        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full border-b border-gray-300 px-3 py-2 rounded-t-lg"
                                placeholder="Nombre de nueva categoría"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="w-full py-2 bg-green-500 text-white rounded-b-lg hover:bg-green-600"
                            >
                                Añadir Categoría
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="image" className="block font-semibold mb-1">Imagen del producto:</label>
                    <CldUploadWidget
                        uploadPreset="my_preset"
                        onSuccess={handleUploadSuccess}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                className="px-4 py-2 bg-azulmedio text-white rounded-lg hover:bg-azuloscuro"
                                onClick={() => open()}
                            >
                                Cargar imagen
                            </button>
                        )}
                    </CldUploadWidget>
                    {localImageUrl && (
                        <img
                            src={localImageUrl}
                            alt="Producto"
                            className="mt-4 rounded-md"
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-amarillo text-white rounded-lg"
                >
                    Guardar Producto
                </button>
            </form>
        </div>
    );
};

export default FormWithImageUpload;
