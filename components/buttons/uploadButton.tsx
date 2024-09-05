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
        <div className="p-4">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="price">Precio:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.valueAsNumber)}
                    />
                </div>
                <div>
                    <label htmlFor="cost">Costo:</label>
                    <input
                        type="number"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.valueAsNumber)}
                    />
                </div>
                <CldUploadWidget
                    uploadPreset="my_preset"
                    onSuccess={handleUploadSuccess}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                            onClick={() => open()}
                        >
                            Cargar imagen
                        </button>
                    )}
                </CldUploadWidget>
                <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default FormWithImageUpload;
