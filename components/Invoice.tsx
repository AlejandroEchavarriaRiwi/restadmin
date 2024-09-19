'use client'
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/buttons/Button';
import Modal from '@/components/modals/ModalMobileView'
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { MdTableRestaurant } from 'react-icons/md';

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [invoiceNumber, setInvoiceNumber] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchOrders();
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

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Order');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Order[] = await response.json();
            setOrders(data.filter(order => order.Status === 3)); // Status 3 is "Por facturar"
        } catch (error) {
            console.error("Could not fetch orders:", error);
        }
    };

    const fetchLastInvoiceNumber = async () => {
        try {
            const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Invoice?_sort=number&_order=desc&_limit=1');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.length > 0) {
                setInvoiceNumber(data[0].number + 1);
            }
        } catch (error) {
            console.error("Could not fetch last invoice number:", error);
        }
    };

    const handleOrderSelect = (order: Order) => {
        setSelectedOrder(order);
        if (isMobile) {
            setIsModalOpen(true);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleInvoice = async () => {
        if (!selectedOrder) return;

        try {
            // Create invoice
            const invoiceResponse = await fetch('https://restadmin.azurewebsites.net/api/v1/Invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: invoiceNumber,
                    orderId: selectedOrder.Id,
                    date: new Date().toISOString()
                }),
            });

            if (!invoiceResponse.ok) {
                throw new Error(`Failed to create invoice. Status: ${invoiceResponse.status}`);
            }

            // Update order status
            const orderResponse = await fetch(`https://restadmin.azurewebsites.net/api/v1/Order/${selectedOrder.Id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selectedOrder, Status: 4 }), // Status 4 is "Facturado"
            });

            if (!orderResponse.ok) {
                throw new Error(`Failed to update order status. Status: ${orderResponse.status}`);
            }

            // Print invoice
            handlePrint();

            // Update local state
            setInvoiceNumber(prev => prev + 1);
            setOrders(prev => prev.filter(o => o.Id !== selectedOrder.Id));
            setSelectedOrder(null);

            alert('Invoice generated and order status updated successfully!');
        } catch (error) {
            console.error("Error processing invoice:", error);
            alert(`Error processing invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        if (isMobile) {
            setIsModalOpen(false);
        }
    };

    const calculateTotal = (order: Order) => {
        return order.Products.reduce((total, product) => total + product.Price * product.Quantity, 0);
    };

    return (
        <ModuleContainer>
            <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-2  w-full ">
                <FaFileInvoiceDollar className='text-[2em] text-gray-800' />
                <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">Pre-Facturas</h1>
            </div>
            <div className='container-invoices'>
                <TableGrid>
                    {orders.map(order => (
                        <TableCard
                            key={order.Id}
                            selected={selectedOrder?.Id === order.Id}
                            onClick={() => handleOrderSelect(order)}
                        >
                            <MdTableRestaurant className='text-4xl text-azuloscuro' />
                            {order.TableName || `Pedido ${order.Id}`}
                        </TableCard>
                    ))}
                </TableGrid>
                <AnimatePresence>
                    {!isMobile && selectedOrder && (
                        <AnimatedOrderDetails
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={containerVariants}
                        >
                            <div className='header'>
                                <h2>Pre-factura para {selectedOrder.TableName || `Pedido ${selectedOrder.Id}`}</h2>
                            </div>
                            <motion.ul variants={containerVariants}>
                                {selectedOrder.Products.map((item, index) => (
                                    <AnimatedListItem key={index} variants={itemVariants}>
                                        <div>{item.Quantity}</div>
                                        <div>{item.Name}</div>
                                        =
                                        <div>${item.Price * item.Quantity}</div>
                                    </AnimatedListItem>
                                ))}
                            </motion.ul>
                            <div className='total'>
                                <p>Total: ${calculateTotal(selectedOrder)}</p>
                            </div>
                            <Button onClick={handleInvoice}>Facturar</Button>
                        </AnimatedOrderDetails>
                    )}
                </AnimatePresence>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onGenerateInvoice={handleInvoice}
            />
            <div style={{ display: 'none' }}>
                <PrintableInvoice ref={printRef}>
                    <h2>Invoice #{invoiceNumber.toString().padStart(5, '0')}</h2>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>{selectedOrder?.TableName || `Pedido ${selectedOrder?.Id}`}</p>
                    <ul>
                        {selectedOrder?.Products.map((item, index) => (
                            <li key={index}>
                                <div>
                                    {item.Name} - ${item.Price} x {item.Quantity} =
                                </div>
                                <div>
                                    ${item.Price * item.Quantity}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p>Total: ${selectedOrder ? calculateTotal(selectedOrder) : 0}</p>
                </PrintableInvoice>
            </div>
        </ModuleContainer>
    );
}