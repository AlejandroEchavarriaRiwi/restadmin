import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Utensils, Users, CreditCard, ChefHat } from 'lucide-react'



const StyledTableCard = styled(motion.div) <{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por Facturar' }>`
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
            case 'Por Facturar': return '#fff4f4';
            default: return '#ffffff';
        }
    }};
  border: 2px solid ${props => {
        switch (props.state) {
            case 'Disponible': return '#05724f';
            case 'Ocupada': return '#1b48aa';
            case 'Cocinando': return '#d97706';
            case 'Por Facturar': return '#a71c1c';
            default: return '#9ca3af';
        }
    }};
`

const IconWrapper = styled.div<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por Facturar' }>`
  margin-bottom: 10px;
  svg {
    width: 40px;
    height: 40px;
    color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#059669';
            case 'Ocupada': return '#2563eb';
            case 'Cocinando': return '#d97706';
            case 'Por Facturar': return '#dc2626';
            default: return '#4b5563';
        }
    }};
  }
`

const TableName = styled.h2<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por Facturar' }>`
  font-weight: bold;
  font-size: 2rem;
  margin: 10px 0;
  text-align: center;
  color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#05724f';
            case 'Ocupada': return '#1b48aa';
            case 'Cocinando': return '#d97706';
            case 'Por Facturar': return '#a71c1c';
            default: return '#4b5563';
        }
    }};
`

const TableState = styled.p<{ state: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por Facturar' }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => {
        switch (props.state) {
            case 'Disponible': return '#4b5563';
            case 'Ocupada': return '#4b5563';
            case 'Cocinando': return '#4b5563';
            case 'Por Facturar': return '#4b5563';
            default: return '#4b5563';
        }
    }};
`

const TableCard: React.FC<{
    table: { Id: number; Name: string; State: 'Disponible' | 'Ocupada' | 'Cocinando' | 'Por Facturar' },
    onClick: () => void
}> = ({ table, onClick }) => {
    const getIcon = () => {
        switch (table.State) {
            case 'Disponible': return <Utensils />;
            case 'Ocupada': return <Users />;
            case 'Cocinando': return <ChefHat />;
            case 'Por Facturar': return <CreditCard />;
            default: return null;
        }
    }

    return (
        <StyledTableCard
            state={table.State}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <IconWrapper state={table.State}>
                {getIcon()}
            </IconWrapper>
            <TableName state={table.State}>{table.Name}</TableName>
            <TableState state={table.State}>{table.State}</TableState>
        </StyledTableCard>
    )
}

export default TableCard