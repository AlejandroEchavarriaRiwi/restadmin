'use client'

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import useFormStore from '../../app/dashboard/store';
import SubmitAlert from '../alerts/submitAlert';

interface Product {
    name: string;
    price: number;
    cost: number;
    imageUrl: string;
}

interface FormWithImageUploadProps {
    setIsModalOpen: (isOpen: boolean) => void; // Función para cerrar el modal
    onProductAdded: (product: Product) => void; // Función para añadir el nuevo producto a la lista
}

const FormWithImageUpload: React.FC<FormWithImageUploadProps> = ({ setIsModalOpen, onProductAdded }) => {
    const { name, price, cost, setName, setPrice, setCost, setImageUrl } = useFormStore();
    const [localImageUrl, setLocalImageUrl] = useState('');

    const handleUploadSuccess = (result: any) => {
        if (result && result.info && result.info.secure_url) {
            setLocalImageUrl(result.info.secure_url);
            setImageUrl(result.info.secure_url);
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
                    price,
                    cost,
                    imageUrl: localImageUrl,
                }),
            });

            const data = await response.json();
            console.log('Form submitted:', data);

            const newProduct: Product = {
                name,
                price,
                cost,
                imageUrl: localImageUrl,
            };

            // Añadir el nuevo producto a la lista sin recargar la página
            onProductAdded(newProduct);

            // Mostrar la alerta de éxito y cerrar el modal cuando el usuario pulse "OK"
            SubmitAlert("El producto fue añadido exitosamente", "success", () => {
                setIsModalOpen(false);
            });

            

        } catch (error) {
            console.error('Error submitting form:', error);
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
                    className="w-full py-2 bg-amarillo text-white rounded-lg "
                >
                    Guardar Producto
                </button>
            </form>
        </div>
    );
};

export default FormWithImageUpload;
