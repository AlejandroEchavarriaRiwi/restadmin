import React from 'react';
import { PreInvoice, Table } from '@/types/IInvoice'; // Make sure to export these types from the main component
import { MdTableRestaurant } from 'react-icons/md';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table | null;
    preInvoice: PreInvoice | null;
    onGenerateInvoice: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, table, preInvoice, onGenerateInvoice }) => {
    if (!isOpen || !table || !preInvoice) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[600] lg:z-40"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-blanco rounded-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-azulclaro text-gray-800 px-4 py-3 rounded-t-md flex gap-3">
                    <MdTableRestaurant className='text-3xl text-gray-800' />
                    <h2 className="text-lg font-bold">Pre-Factura</h2>
                </div>
                <div className="grid gap-4 p-4">
                    <div className="flex text-gray-800 items-center justify-between">
                        <span className="font-semibold">{table.name}</span>
                    </div>
                    {preInvoice.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-800 ">{item.name}</span>
                            <span className="text-gray-800">
                                ${item.price} x {item.quantity} = ${(item.price * item.quantity)}
                            </span>
                        </div>
                    ))}
                    <div className="bg-azulmedio h-px my-2" />
                    <div className="flex items-center justify-between font-medium">
                        <span className="text-gray-800">Total</span>
                        <span className="text-gray-800">${preInvoice.total}</span>
                    </div>
                </div>
                <div className="bg-muted px-4 py-3 rounded-b-md flex justify-end">
                    <button
                        className="bg-azuloscuro text-blanco -foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                        onClick={onGenerateInvoice}
                    >
                        Imprimir Factura
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;