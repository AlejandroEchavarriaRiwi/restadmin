import React from 'react';
import { PreInvoice, Table } from '@/types/IInvoice'; // Make sure to export these types from the main component

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
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-blanco border shadow-sm rounded-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-azulclaro px-4 py-3 rounded-t-md">
                    <h2 className="text-lg font-bold">Pre-Factura</h2>
                </div>
                <div className="grid gap-4 p-4">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">{table.name}</span>
                    </div>
                    {preInvoice.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="text-muted-foreground">
                                ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                    <div className="bg-azulmedio h-px my-2" />
                    <div className="flex items-center justify-between font-medium">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">${preInvoice.total.toFixed(2)}</span>
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