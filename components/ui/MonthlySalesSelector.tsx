'use client';
import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { Loader2, ArrowUpDown, Printer } from "lucide-react";
import { useReactToPrint } from 'react-to-print';

interface Invoice {
  Id: number;
  Number: number;
  OrderId: number;
  Observations: string;
  Total: number;
  DateInvoice: string;
}

interface OrderDetails {
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

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const DateSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const DateInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardField = styled.p`
  margin-bottom: 10px;
  font-size: 14px;

  strong {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #4a5568;
  font-size: 14px;

  &:hover {
    color: #2d3748;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const PaginationButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#e0e0e0' : '#4a5568'};
  color: ${props => props.disabled ? '#999' : 'white'};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#2d3748'};
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonRow = styled.tr`
  td {
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SkeletonCell = styled.td`
  height: 20px;
`;

const TableSkeleton = () => (
  <tbody>
    {[...Array(5)].map((_, index) => (
      <SkeletonRow key={index}>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
        <SkeletonCell><SkeletonPulse /></SkeletonCell>
      </SkeletonRow>
    ))}
  </tbody>
);


const PrintableInvoice = styled.div`
  @media print {
    display: block;
    width: 80mm;
    padding: 5mm;
    font-family: 'Arial', sans-serif;
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
` 

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

interface Invoice {
  Id: number;
  Number: number;
  OrderId: number;
  Observations: string;
  Total: number;
  DateInvoice: string;
}

interface OrderDetails {
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

interface Company {
  Id: number;
  Name: string;
  Email: string;
  Nit: string;
  Phone: string;
  Address: string;
  LogoURL: string;
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

const InvoiceToPrint: React.FC<{ invoice: Invoice | null, company: Company | null, orderDetails: OrderDetails | null }> = ({ invoice, company, orderDetails }) => {
  if (!invoice || !company || !orderDetails) return null;

  const calculateTotal = (products: OrderDetails['Products']) => {
    return products.reduce((total, product) => total + product.Price * product.Quantity, 0);
  };

  const currentDate = new Date(invoice.DateInvoice).toLocaleString("es-CO");

  return (
    <PrintableInvoice>
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
        <OrderTitle>Factura #{invoice.Number}</OrderTitle>
        <OrderNumber>
          {orderDetails.TableName || `Pedido ${orderDetails.Id}`}
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
        {orderDetails.Products.map((item, index) => (
          <TableRow key={index}>
            <Cell>{item.Quantity}x</Cell>
            <Cell>{item.Name}</Cell>
            <CellLast>${item.Price * item.Quantity}</CellLast>
          </TableRow>
        ))}
      </ProductsTable>
      <Divider />
      <Total>
        <TotalLabel>Total:</TotalLabel>
        <TotalAmount>
          ${calculateTotal(orderDetails.Products).toLocaleString()}
        </TotalAmount>
      </Total>
      {orderDetails.Observations && (
        <Observations>
          <ObservationsTitle>Observaciones:</ObservationsTitle>
          <ObservationsText>
            {orderDetails.Observations}
          </ObservationsText>
        </Observations>
      )}
      <Footer>
        <ThankYouMessage>¡Gracias por su compra!</ThankYouMessage>
        <InfoItem>Elaborado desde www.restadmin.co</InfoItem>
        <InfoItem>RestAdmin SAS</InfoItem>
        <InfoItem>NIT 999.999.123-4</InfoItem>
      </Footer>
    </PrintableInvoice>
  );
};

export default function DailySalesSelector() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate) {
      fetchInvoices(selectedDate);
    }
    fetchCompanyInfo();
  }, [selectedDate]);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("/api/v1/Company");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Company[] = await response.json();
      if (data.length > 0) {
        setCompany(data[0]);
      } else {
        console.error("No company data received");
      }
    } catch (error) {
      console.error("Could not fetch company info:", error);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/v1/Order/${orderId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: OrderDetails = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Could not fetch order details:", error);
    }
  };


  const fetchInvoices = async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [year, month, day] = date.split('-');
      const response = await fetch(`/api/v1/Product/salesByDay?day=${day}&month=${month}&year=${year}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Invoice[] = await response.json();
      setInvoices(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError('No hay facturas generadas en la fecha especificada');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const formatCurrency = (value: number) => {
    return value ? `$${value.toLocaleString()}` : 'No hay ventas';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleSort = (key: keyof Invoice) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = React.useMemo(() => {
    let sortableItems = [...invoices];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [invoices, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(sortedInvoices.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };


  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      // You can update any state here if needed before printing
    },
    onAfterPrint: () => {
      setSelectedInvoice(null);
      setOrderDetails(null);
    },
  });

  const printInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    await fetchOrderDetails(invoice.OrderId);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);

  const renderInvoiceCard = (invoice: Invoice) => (
    <Card key={invoice.Id}>
      <CardField><strong>Número:</strong> {invoice.Number}</CardField>
      <CardField><strong>Fecha:</strong> {formatDate(invoice.DateInvoice)}</CardField>
      <CardField><strong>ID de Orden:</strong> {invoice.OrderId}</CardField>
      <CardField><strong>Total:</strong> {formatCurrency(invoice.Total)}</CardField>
      <CardField><strong>Observaciones:</strong> {invoice.Observations}</CardField>
      <CardActions>
        <ActionButton onClick={() => printInvoice(invoice)}>
          <Printer size={18} /> Imprimir
        </ActionButton>
      </CardActions>
    </Card>
  );

  return (
    <Container>
      <Title>Facturas Diarias</Title>
      <DateSelector>
        <DateInput
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </DateSelector>

      {isLoading ? (
        <CardContainer>
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <SkeletonPulse />
            </Card>
          ))}
        </CardContainer>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : currentItems.length > 0 ? (
        <CardContainer>
          {currentItems.map(renderInvoiceCard)}
        </CardContainer>
      ) : (
        <p className="text-center py-4">No hay facturas disponibles para esta fecha.</p>
      )}

      {!isLoading && currentItems.length > 0 && (
        <Pagination>
          <PaginationButton 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Anterior
          </PaginationButton>
          <PageInfo>
            Página {currentPage} de {totalPages}
          </PageInfo>
          <PaginationButton 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Siguiente
          </PaginationButton>
        </Pagination>
      )}
      
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <InvoiceToPrint invoice={selectedInvoice} company={company} orderDetails={orderDetails} />
        </div>
      </div>
    </Container>
  );
}