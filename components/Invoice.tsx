'use client'
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import Button from '../components/buttons/Button';
import Modal from '@/components/modals/ModalMobileView'
import { PreInvoice, Table } from '@/types/IInvoice';

// ... (keep existing interfaces)

const ModuleContainer = styled.div`
  padding: 20px;
  max-width: 100%;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const TableCard = styled.div<{ selected: boolean }>`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e6f7ff' : '#fff'};
  &:hover {
    background-color: #f0f0f0;
  }
`;

const OrderDetails = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const PrintableInvoice = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  margin-top: 20px;
`;

export default function Invoice() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [preInvoice, setPreInvoice] = useState<PreInvoice | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchTables();
    fetchLastInvoiceNumber();
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8001/tables');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Table[] = await response.json();
      setTables(data.filter(table => table.state === 'Por facturar'));
    } catch (error) {
      console.error("Could not fetch tables:", error);
    }
  };

  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await fetch('http://localhost:8001/invoices?_sort=number&_order=desc&_limit=1');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.length > 0) {
        setInvoiceNumber(data[0].number + 1);
      }
    } catch (error) {
      console.error("Could not fetch last invoice number:", error);
    }
  };

  const fetchPreInvoice = async (tableId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/preinvoices?tableId=${tableId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: PreInvoice[] = await response.json();
      if (data.length > 0) {
        setPreInvoice(data[0]);
      } else {
        setPreInvoice(null);
      }
    } catch (error) {
      console.error("Could not fetch pre-invoice:", error);
    }
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    fetchPreInvoice(table.id);
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleInvoice = async () => {
    if (!selectedTable || !preInvoice) return;

    try {
      // Save invoice
      const invoiceResponse = await fetch('http://localhost:8001/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: invoiceNumber,
          tableId: selectedTable.id,
          items: preInvoice.items,
          total: preInvoice.total,
          date: new Date().toISOString()
        }),
      });

      if (!invoiceResponse.ok) {
        throw new Error(`Failed to create invoice. Status: ${invoiceResponse.status}`);
      }

      // Update table state
      const tableResponse = await fetch(`http://localhost:8001/tables/${selectedTable.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'Disponible' }),
      });

      if (!tableResponse.ok) {
        throw new Error(`Failed to update table state. Status: ${tableResponse.status}`);
      }

      // Delete pre-invoice
      const deletePreInvoiceResponse = await fetch(`http://localhost:8001/preinvoices/${preInvoice.id}`, {
        method: 'DELETE',
      });

      if (!deletePreInvoiceResponse.ok) {
        throw new Error(`Failed to delete pre-invoice. Status: ${deletePreInvoiceResponse.status}`);
      }

      // Print invoice
      handlePrint();

      // Update local state
      setInvoiceNumber(prev => prev + 1);
      setTables(prev => prev.filter(t => t.id !== selectedTable.id));
      setSelectedTable(null);
      setPreInvoice(null);

      alert('Invoice generated and table freed successfully!');
    } catch (error) {
      console.error("Error processing invoice:", error);
      alert(`Error processing invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <ModuleContainer>
      <div className="bg-primary text-primary-foreground py-2 px-2 m-3 rounded-xl shadow-md">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Pre-Facturas</h1>
        </div>
      </div>
      <TableGrid>
        {tables.map(table => (
          <TableCard
            key={table.id}
            selected={selectedTable?.id === table.id}
            onClick={() => handleTableSelect(table)}
          >
            {table.name}
          </TableCard>
        ))}
      </TableGrid>
      {!isMobile && selectedTable && preInvoice && (
        <OrderDetails>
          <h2>Pre-Invoice for {selectedTable.name}</h2>
          <ul>
            {preInvoice.items.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p>Total: ${preInvoice.total}</p>
          <Button onClick={handleInvoice}>Generate Invoice</Button>
        </OrderDetails>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        table={selectedTable}
        preInvoice={preInvoice}
        onGenerateInvoice={handleInvoice}
      />
      <div style={{ display: 'none' }}>
        <PrintableInvoice ref={printRef}>
          <PrintableInvoice ref={printRef}>
            <h2>Invoice #{invoiceNumber.toString().padStart(5, '0')}</h2>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Table: {selectedTable?.name}</p>
            <ul>
              {preInvoice?.items.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p>Total: ${preInvoice?.total}</p>
          </PrintableInvoice>
        </PrintableInvoice>
      </div>
    </ModuleContainer>
  );
}