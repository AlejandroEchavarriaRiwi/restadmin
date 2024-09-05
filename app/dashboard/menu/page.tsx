'use client'

import FormWithImageUpload from "@/components/buttons/uploadButton";
import React, { Key, useEffect, useState } from 'react';
import styled from "styled-components";

const Container = styled.div`
    margin: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px

`;

export default function Menu(){

    interface Product {
        id: Key | null | undefined;
        name: string;
        price: string;
        cost: string;
        imageUrl: string;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

    useEffect(() => {
        // Llamada a la API para obtener los productos
        fetch('http://localhost:8001/menu')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    console.log(data)
                } else {
                    console.error("Formato de datos incorrecto");
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []); // El array vacío como segundo argumento hace que este efecto se ejecute solo una vez al montar el componente

    return (
        <div className="ml-[230px]">
        <Container>
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} >
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-32 h-32 object-cover" // Ajusta el tamaño de la imagen
                            />
                        )}
                        <h1>{product.name}</h1>
                        <h3>{product.price}</h3>
                        <h3>{product.cost}</h3>
                    </div>
                ))
            ) : (
                <p>No hay productos disponibles</p>
            )}

            </Container>

            {/* Botón para abrir el modal */}
            <button
                className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)} // Abre el modal al hacer clic
            >
                Agregar Producto
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        {/* Botón para cerrar el modal */}
                        <button
                            className="float-right font-bold text-red-500"
                            onClick={() => setIsModalOpen(false)} // Cierra el modal
                        >
                            X
                        </button>

                        {/* Componente dentro del modal */}
                        <FormWithImageUpload />
                    </div>
                </div>
            )}
        </div>
    );
}
