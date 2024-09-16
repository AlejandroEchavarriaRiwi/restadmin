import React, { useState } from 'react';
import { Product } from '@/types/Imenu';
import { CldUploadWidget } from 'next-cloudinary';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';

const EditProductModal = ({ product, onSave, onClose }: { product: Product, onSave: (updatedProduct: Product) => void, onClose: () => void }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const [localImageUrl, setLocalImageUrl] = useState<string>(product.imageURL); // Store the image URL

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (category: Category) => {
        setEditedProduct(prev => ({ ...prev, category }));
    };

    const handleUploadSuccess = (result: any) => {
        const imageUrl = result.info.secure_url; // Get the uploaded image URL
        setLocalImageUrl(imageUrl); // Update local image URL
        setEditedProduct(prev => ({ ...prev, imageUrl })); // Update the product's image URL
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedProduct); // Save the updated product, including the new image URL and category
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

                    {/* Componente de selección de categoría */}
                    <div>
                        <CategorySelection
                            category={editedProduct.category}
                            setCategory={handleCategoryChange}
                        />
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
                    
                    

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
