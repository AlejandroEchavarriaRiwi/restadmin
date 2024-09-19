'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/buttons/Button';
import Modal from '@/components/modals/ModalMobileView'
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { MdTableRestaurant } from 'react-icons/md';

interface Product {
  Id: number;
  Name: string;
  Price: number;
  Quantity: number;
  ImageURL: string;
  Category: {
    Id: number;
    Name: string;
  };
  Status: number;
}

interface Order {
  Id: number;
  TablesId: number | null;
  TableName: string | null;
  Status: number;
  Products: Product[];
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchOrders();
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
            setOrders(data.filter(order => order.Status === 2)); // Filtrar órdenes con Status 2
        } catch (error) {
            console.error("Could not fetch orders:", error);
        }
    };

    const handleOrderSelect = (order: Order) => {
        setSelectedOrder(order);
        if (isMobile) {
            setIsModalOpen(true);
        }
    };

    const completeOrder = async (order: Order) => {
        try {
            let updatedOrderData: any = {
                Observations: order.Observations,
                Status: 3, // Cambiar a status 3
                OrderProducts: order.Products.map(product => ({
                    ProductId: product.Id,
                    OrderId: order.Id,
                    Quantity: product.Quantity
                }))
            };

            if (order.TablesId !== null) {
                updatedOrderData.TablesId = order.TablesId;
            }

            const response = await fetch(`https://restadmin.azurewebsites.net/api/v1/Order/${order.Id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrderData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update order. Status: ${response.status}`);
            }

            // Actualizar el estado local
            setOrders(orders.filter(o => o.Id !== order.Id));
            setSelectedOrder(null);
            if (isMobile) {
                setIsModalOpen(false);
            }

            alert('Orden completada exitosamente!');
        } catch (error) {
            console.error("Error completing order:", error);
            alert(`Error al completar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    const calculateTotal = (order: Order) => {
        return order.Products.reduce((total, product) => total + product.Price * product.Quantity, 0);
    };

    return (
        <ModuleContainer>
            <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-2  w-full ">
                <FaFileInvoiceDollar className='text-[2em] text-gray-800' />
                <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">Órdenes por Completar</h1>
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
                                <h2>Detalles de {selectedOrder.TableName || `Pedido ${selectedOrder.Id}`}</h2>
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
                            <Button onClick={() => completeOrder(selectedOrder)}>Completar Orden</Button>
                        </AnimatedOrderDetails>
                    )}
                </AnimatePresence>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onGenerateInvoice={() => selectedOrder && completeOrder(selectedOrder)}
            />
        </ModuleContainer>
    );
}