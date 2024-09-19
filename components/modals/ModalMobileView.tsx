import React from 'react';
import { PreInvoice, Table } from '@/types/IInvoice';
import { CreditCard } from 'lucide-react';

interface Order {
  Id: number;
  TablesId: number | null;
  TableName: string | null;
  Status: number;
  Products: {
    Id: number;
    Name: string;
    Price: number;
    Quantity: number;
  }[];
  Observations: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: Table | null;
  preInvoice?: PreInvoice | null;
  order?: Order | null;
  onGenerateInvoice: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, table, preInvoice, order, onGenerateInvoice }) => {
  if (!isOpen) return null;

  let title: string;
  let items: { name: string; price: number; quantity: number }[];
  let total: number;

  if (order) {
    title = order.TableName || `Pedido ${order.Id}`;
    items = order.Products.map(p => ({ name: p.Name, price: p.Price, quantity: p.Quantity }));
    total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  } else if (table && preInvoice) {
    title = table.name;
    items = preInvoice.items;
    total = preInvoice.total;
  } else {
    return null;
  }

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
          <CreditCard className='text-3xl text-azuloscuro' />
          <h2 className="text-lg font-bold">Pre-Factura</h2>
        </div>
        <div className="grid gap-4 p-4">
          <div className="flex text-gray-800 items-center justify-between">
            <span className="font-semibold text-3xl">{title}</span>
          </div>
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{item.quantity}</span>
              <span className="text-gray-800 ">{item.name}</span>
              <span>=</span>
              <span className="text-gray-800">${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="bg-azulmedio h-px my-2" />
          <div className="flex items-center justify-between font-medium">
            <span className="text-gray-800 font-extrabold text-2xl">Total</span>
            <span className="text-gray-800 font-extrabold text-2xl">${total}</span>
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