import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Utensils, Users, CreditCard, ChefHat } from 'lucide-react'

const StyledTableCard = styled(motion.div) <{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar' }>`
  width: 200px;
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background-color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#f2fff7';
            case 'Ocupada': return '#f0f8ff';
            case 'Cocinando': return '#fdfaef';
            case 'Por facturar': return '#fff4f4';
            default: return '#ffffff';
        }
    }};
  border: 2px solid ${props => {
        switch (props.state) {
            case 'Disponible': return '#05724f';
            case 'Ocupada': return '#1b48aa';
            case 'Cocinando': return '#d97706';
            case 'Por facturar': return '#a71c1c';
            default: return '#9ca3af';
        }
    }};
`

const IconWrapper = styled.div<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar' }>`
  margin-bottom: 10px;
  svg {
    width: 40px;
    height: 40px;
    color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#059669';
            case 'Ocupada': return '#2563eb';
            case 'Cocinando': return '#d97706';
            case 'Por facturar': return '#dc2626';
            default: return '#4b5563';
        }
    }};
  }
`

const TableName = styled.h2<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar' }>`
  font-weight: bold;
  font-size: 2rem;
  margin: 10px 0;
  text-align: center;
  color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#05724f';
            case 'Ocupada': return '#1b48aa';
            case 'Cocinando': return '#d97706';
            case 'Por facturar': return '#a71c1c';
            default: return '#4b5563';
        }
    }};
`

const TableState = styled.p<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar' }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#4b5563';
            case 'Ocupada': return '#4b5563';
            case 'Cocinando': return '#4b5563';
            case 'Por facturar': return '#4b5563';
            default: return '#4b5563';
        }
    }};
`

const TableCard: React.FC<{
    table: { id: string; name: string; state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por facturar' },
    onClick: () => void
}> = ({ table, onClick }) => {
    const getIcon = () => {
        switch (table.state) {
            case 'Disponible': return <Utensils />;
            case 'Ocupada': return <Users />;
            case 'Cocinando': return <ChefHat />;
            case 'Por facturar': return <CreditCard />;
            default: return null;
        }
    }

    return (
        <StyledTableCard
            state={table.state}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <IconWrapper state={table.state}>
                {getIcon()}
            </IconWrapper>
            <TableName state={table.state}>{table.name}</TableName>
            <TableState state={table.state}>{table.state}</TableState>
        </StyledTableCard>
    )
}

export default TableCard