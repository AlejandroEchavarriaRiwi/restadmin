"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/buttons/Button";
import Modal from "@/components/modals/ModalMobileView";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import InputAlert from "./alerts/successAlert";
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

interface Company {
  Id: number;
  Name: string;
  Email: string;
  Nit: string;
  Phone: string;
  Address: string;
  LogoURL: string;
}

const PrintableInvoice = styled.div`
  @media print {
    display: block;
    width: 80mm;
    padding: 5mm;
    font-family: "Arial", sans-serif;
    font-size: 12px;
    line-height: 1.2;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CompanyLogoDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CompanyLogo = styled.img`
  width: 40mm;
  margin-bottom: 2mm;
`;

const CompanyName = styled.h1`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const CompanyInfo = styled.div`
  text-align: center;
  margin-bottom: 3mm;
`;

const InfoItem = styled.p`
  margin: 0;
  font-size: 12px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed #000;
  margin: 3mm 0;
`;

const OrderInfo = styled.div`
  text-align: center;
  margin-bottom: 3mm;
`;

const OrderTitle = styled.h2`
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 1mm 0;
`;

const OrderNumber = styled.p`
  font-size: 12px;
  margin: 0;
`;

const OrderDate = styled.p`
  font-size: 12px;
  margin: 1mm 0 0 0;
`;

const ProductsTable = styled.div`
  width: 100%;
  margin-bottom: 3mm;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 1mm;
`;

const HeaderCell = styled.div`
  flex: 1;
  text-align: left;
`;

const HeaderCellLast = styled.div`
  flex: 1;
  text-align: right;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Cell = styled.div`
  flex: 1;
  text-align: left;
`;

const CellLast = styled.div`
  flex: 1;
  text-align: right;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 2mm;
`;

const TotalLabel = styled.span`
  font-size: 14px;
`;

const TotalAmount = styled.span`
  font-size: 14px;
`;

const Observations = styled.div`
  margin-top: 3mm;
`;

const ObservationsTitle = styled.h3`
  font-size: 12px;
  font-weight: bold;
  margin: 0 0 1mm 0;
`;

const ObservationsText = styled.p`
  font-size: 12px;
  margin: 0;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 5mm;
`;

const ThankYouMessage = styled.p`
  font-size: 12px;
  font-weight: bold;
`;

const ModuleContainer = styled.div`
  width: 100%;
  .container-invoices {
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
  @media screen and (max-width: 600px) {
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
  button {
    margin: 25px;
  }
`;
const AnimatedOrderDetails = motion.create(OrderDetails);
const AnimatedListItem = motion.create('li');
export default function Invoice() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
    fetchCompanyInfo();
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("/api/v1/Company");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Company[] = await response.json();
      if (data.length > 0) {
        setCompany(data[0]); // Set the first (and likely only) company in the array
      }
    } catch (error) {
      console.error("Could not fetch company info:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/v1/Order");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Order[] = await response.json();
      setOrders(data.filter((order) => order.Status === 2));
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

  const generateInvoice = async (orderId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/Invoice/create-from-order?orderId=${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate invoice. Status: ${response.status}`
        );
      }

      const invoiceData = await response.json();
      console.log("Invoice generated:", invoiceData);
      return invoiceData;
    } catch (error) {
      console.error("Error generating invoice:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise<void>((resolve) => {
        const currentDate = new Date().toLocaleString("es-CO");
        setCurrentDate(currentDate);
        resolve();
      });
    },
    onAfterPrint: () => {
      // Remove the order from the list after printing
      setOrders((prevOrders) =>
        prevOrders.filter((o) => o.Id !== selectedOrder?.Id)
      );
      setSelectedOrder(null);
    },
  });

  const completeOrder = async (order: Order) => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
    try {
      await generateInvoice(order.Id);

      let updatedOrderData: any = {
        Observations: order.Observations,
        Status: 3,
        OrderProducts: order.Products.map((product) => ({
          ProductId: product.Id,
          OrderId: order.Id,
          Quantity: product.Quantity,
        })),
      };
      if (order.TablesId !== null) {
        updatedOrderData.TablesId = order.TablesId;
      }

      const response = await fetch(`/api/v1/Order/${order.Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order. Status: ${response.status}`);
      }

      setSelectedOrder(order); // Set the selected order for printing

      if (isMobile) {
        setIsModalOpen(false);
      }

      // Trigger print immediately
      handlePrint();

      await InputAlert(
        "Orden completada y factura generada exitosamente!",
        "success"
      );
    } catch (error) {
      alert(
        `Error al completar la orden y generar la factura: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (order: Order) => {
    return order.Products.reduce(
      (total, product) => total + product.Price * product.Quantity,
      0
    );
  };

  return (
    <ModuleContainer>
      <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-2  w-full ">
        <FaFileInvoiceDollar className="text-[2em] text-gray-800" />
        <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">
          Órdenes por Completar
        </h1>
      </div>
      <div className="container-invoices">
        <TableGrid>
          {orders.map((order) => (
            <TableCard
              key={order.Id}
              selected={selectedOrder?.Id === order.Id}
              onClick={() => handleOrderSelect(order)}
            >
              <MdTableRestaurant className="text-4xl text-azuloscuro" />
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
              <div className="header">
                <h2>
                  Detalles de{" "}
                  {selectedOrder.TableName || `Pedido ${selectedOrder.Id}`}
                </h2>
              </div>
              <motion.ul variants={containerVariants}>
              {selectedOrder.Products.map((item, index) => (
                <AnimatedListItem key={index} variants={itemVariants}>
                    <div>{item.Quantity}</div>
                    <div>{item.Name}</div>=
                    <div>${item.Price * item.Quantity}</div>
                  </AnimatedListItem>
                ))}
              </motion.ul>
              <div className="total">
                <p>Total: ${calculateTotal(selectedOrder)}</p>
              </div>
              <Button
                onClick={() => completeOrder(selectedOrder)}
                disabled={isLoading}
              >
                {isLoading
                  ? "Procesando..."
                  : "Completar Orden y Generar Factura"}
              </Button>
            </AnimatedOrderDetails>
          )}
        </AnimatePresence>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onGenerateInvoice={() => selectedOrder && completeOrder(selectedOrder)}
        isLoading={isLoading}
      />
      <div style={{ display: "none" }}>
        <PrintableInvoice ref={printRef}>
          {company && selectedOrder && (
            <>
              <Header>
                <CompanyLogoDiv>
                  <CompanyLogo src={company.LogoURL} alt={company.Name} />
                </CompanyLogoDiv>
                <CompanyName>{company.Name}</CompanyName>
              </Header>
              <CompanyInfo>
                <InfoItem>NIT: {company.Nit}</InfoItem>
                <InfoItem>Dirección: {company.Address}</InfoItem>
                <InfoItem>Teléfono: {company.Phone}</InfoItem>
                <InfoItem>Email: {company.Email}</InfoItem>
              </CompanyInfo>
              <Divider />
              <OrderInfo>
                <OrderTitle>Orden de venta</OrderTitle>
                <OrderNumber>
                  {selectedOrder.TableName || `Pedido ${selectedOrder.Id}`}
                </OrderNumber>
                <OrderDate>Fecha: {currentDate}</OrderDate>
              </OrderInfo>
              <Divider />
              <ProductsTable>
                <TableHeader>
                  <HeaderCell>Cant.</HeaderCell>
                  <HeaderCell>Producto</HeaderCell>
                  <HeaderCellLast>Precio</HeaderCellLast>
                </TableHeader>
                {selectedOrder.Products.map((item, index) => (
                  <TableRow key={index}>
                    <Cell>{item.Quantity}x</Cell>
                    <Cell>{item.Name}</Cell>
                    <CellLast>${item.Price}</CellLast>
                  </TableRow>
                ))}
              </ProductsTable>
              <Divider />
              <Total>
                <TotalLabel>Total:</TotalLabel>
                <TotalAmount>${calculateTotal(selectedOrder)}</TotalAmount>
              </Total>
              {selectedOrder.Observations && (
                <Observations>
                  <ObservationsTitle>Observaciones:</ObservationsTitle>
                  <ObservationsText>
                    {selectedOrder.Observations}
                  </ObservationsText>
                </Observations>
              )}
              <Footer>
                <ThankYouMessage>¡Gracias por su compra!</ThankYouMessage>
                <InfoItem>Elaborado desde www.restadmin.co</InfoItem>
                <InfoItem>RestAdmin SAS</InfoItem>
                <InfoItem>NIT 999.999.123-4</InfoItem>
              </Footer>
            </>
          )}
        </PrintableInvoice>
      </div>
    </ModuleContainer>
  );
}
