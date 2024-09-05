'use client'

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import useFormStore from '../../app/dashboard/store';

const FormWithImageUpload: React.FC = () => {
    const { name, price, cost, setName, setPrice, setCost, setImageUrl } = useFormStore();
    const [localImageUrl, setLocalImageUrl] = useState('');

    const handleUploadSuccess = (result: any) => {
        setLocalImageUrl(result.info.secure_url);
        setImageUrl(result.info.secure_url);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aquí se accede al estado actual de la tienda y se envía el formulario
        fetch('http://localhost:8001/menu', {
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
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Form submitted:', data);
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
            });
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
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="cost">Costo:</label>
                    <input
                        type="number"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
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
                            onClick={() => open()} // Envolver la llamada a open en una función de flecha
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
