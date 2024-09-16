'use client'
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/buttons/Button';
import Modal from '@/components/modals/ModalMobileView'
import { PreInvoice, Table } from '@/types/IInvoice';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { MdTableRestaurant } from 'react-icons/md';

const ModuleContainer = styled.div`
  width: 100%;
  .container-invoices{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  padding: 30px;
  width: 50%;
  height: 100%; /* Para que tome el 100% de la altura disponible */

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    font-size: 2em;
    font-weight: bold;
    padding: 0px;
    width: 100%;
  }
`;

const TableCard = styled.div<{ selected: boolean }>`
  border: 2px solid #4655c4;
  background: #c2d6f8;
  color: #4655c4;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 600px){
    width: 50%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const OrderDetails = styled.div`
  height: 100%; /* Asegura que tenga el 100% de la altura del contenedor padre */
  border: 2px solid #4655c4;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 30px;

  ul {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  li {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin: 10px;
    border-bottom: 1px solid #637ad6;
  }

  div.header {
    width: 100%;
    color: #1f2937;
    background-color: #aac3eb;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 15px;
    font-size: 1.2em;
    font-weight: bold;
  }
  div.total {
    display: flex;
    justify-content: end;
    margin-right: 10%;
    font-size: large;
    font-weight: bolder;
  }
  button{
    margin: 25px;
  }
`;
const PrintableInvoice = styled.div`
  padding: 20px;
  margin-top: 20px;
  width: 80mm;
  font-size: 8px;
  ul{
    display: flex;
    flex-direction: column;
    align-items: start;

  }
  li{
    display: flex;
    justify-content: space-between;
  }
`;


const AnimatedOrderDetails = motion(OrderDetails);
const AnimatedListItem = motion.li;

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


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1
        }
    };

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
            <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-3  w-full ">
                <FaFileInvoiceDollar className='text-[1.5em] text-gray-800' />
                <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">Pre-Facturas</h1>
            </div>
            <div className='container-invoices'>
                <TableGrid>
                    {tables.map(table => (
                        <TableCard
                            key={table.id}
                            selected={selectedTable?.id === table.id}
                            onClick={() => handleTableSelect(table)}
                        >
                            <MdTableRestaurant className='text-4xl text-azuloscuro' />
                            {table.name}
                        </TableCard>
                    ))}
                </TableGrid>
                <AnimatePresence>
                    {!isMobile && selectedTable && preInvoice && (
                        <AnimatedOrderDetails
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={containerVariants}
                        >
                            <div className='header'>
                                <h2>Pre-factura para {selectedTable.name}</h2>
                            </div>
                            <motion.ul variants={containerVariants}>
                                {preInvoice.items.map((item, index) => (
                                    <AnimatedListItem key={index} variants={itemVariants}>
                                        <div>{item.quantity}</div>
                                        <div>{item.name}</div>
                                        =
                                        <div>${item.price}</div>
                                    </AnimatedListItem>
                                ))}
                            </motion.ul>
                            <div className='total'>
                                <p>Total: ${preInvoice.total}</p>
                            </div>
                            <Button onClick={handleInvoice}>Facturar</Button>
                        </AnimatedOrderDetails>
                    )}
                </AnimatePresence>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                table={selectedTable}
                preInvoice={preInvoice}
                onGenerateInvoice={handleInvoice}
            />
            <div style={{ display: 'none' }}>
                <PrintableInvoice ref={printRef}>
                    <h2>Invoice #{invoiceNumber.toString().padStart(5, '0')}</h2>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Table: {selectedTable?.name}</p>
                    <ul>
                        {preInvoice?.items.map((item, index) => (
                            <li key={index}>
                                <div>
                                    {item.name} - ${item.price} x {item.quantity} =
                                </div>
                                <div>
                                    ${item.price * item.quantity}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p>Total: ${preInvoice?.total}</p>
                </PrintableInvoice>
            </div>
        </ModuleContainer>
    );
}