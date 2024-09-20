// ImageUpload.tsx
import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    imageUrl: string;
    setImageUrl: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, setImageUrl }) => {
    const handleUploadSuccess = (result: any) => {
        if (result && result.info && result.info.secure_url) {
            setImageUrl(result.info.secure_url);
        } else {
            console.error('Error: No se encontró secure_url en el resultado de la carga.');
        }
    };

    return (
        <div>
            <label htmlFor="image" className="block font-semibold mb-1">Imagen del producto:</label>
            <CldUploadWidget
                uploadPreset="my_preset"
                onSuccess={handleUploadSuccess}
            >
                {({ open }) => (
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#67b7f7] text-white rounded-lg hover:bg-[#4b9fea]"
                        onClick={() => open()}
                    >
                        Cargar imagen
                    </button>
                )}
            </CldUploadWidget>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Producto"
                    className="mt-4 rounded-md"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
            )}
        </div>
    );
};

export default ImageUpload