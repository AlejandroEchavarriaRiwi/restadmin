'use client';
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Loader2, ArrowUpDown, Printer } from "lucide-react";

interface Invoice {
  id: number;
  number: number;
  orderId: number;
  observations: string;
  total: number;
  dateInvoice: string;
}

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 1000px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const Select = styled.select`
  width: 200px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e0e0e0;
  cursor: pointer;
`;

const SortIcon = styled(ArrowUpDown)`
  vertical-align: middle;
  margin-right: 5px;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
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
  background-color: ${props => props.disabled ? '#e0e0e0' : 'transparent'};
  color: ${props => props.disabled ? '#999' : '#333'};
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#f0f0f0'};
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

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function MonthlySalesSelector() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'ascending' | 'descending' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
  

  useEffect(() => {
    fetchInvoices(selectedMonth);
  }, [selectedMonth]);

  const fetchInvoices = async (month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/Product/salesByMonth?month=${month}`);
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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const formatCurrency = (value: number) => {
    return value ? `${value.toLocaleString()}` : 'no hay ventas';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
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


  const fieldTranslations = {
    number: 'Número',
    dateInvoice: 'Fecha',
    orderId: 'ID de Orden',
    total: 'Total',
    observations: 'Observaciones'
  };

  const handlePrint = (invoice: Invoice) => {
    console.log("Reimprimiendo factura:", invoice);
    // Aquí iría la lógica para reimprimir la factura
  };

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);


  return (
    <Container>
      <Title>Facturas Mensuales</Title>
      <Select value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ))}
      </Select>

      <Table>
        <thead>
          <tr>
            {['number', 'dateInvoice', 'orderId', 'total', 'observations'].map((key) => (
              <Th key={key} onClick={() => handleSort(key as keyof Invoice)}>
                <SortIcon size={14} />
                {fieldTranslations[key as keyof typeof fieldTranslations]}
              </Th>
            ))}
            <Th>Acciones</Th>
          </tr>
        </thead>
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center text-red-500 py-4">{error}</td>
            </tr>
          </tbody>
        ) : currentItems.length > 0 ? (
          <tbody>
            {currentItems.map((invoice) => (
              <tr key={invoice.id}>
                <Td>{invoice.number}</Td>
                <Td>{formatDate(invoice.dateInvoice)}</Td>
                <Td>{invoice.orderId}</Td>
                <Td>{formatCurrency(invoice.total)}</Td>
                <Td>{invoice.observations}</Td>
                <Td>
                  <Button onClick={() => handlePrint(invoice)}>
                    <Printer size={18} />
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-4">No hay facturas disponibles para este mes.</td>
            </tr>
          </tbody>
        )}
      </Table>

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
    </Container>
  );
}