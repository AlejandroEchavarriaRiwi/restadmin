'use client'

import React from 'react';
import styled from 'styled-components';
import MonthlySalesSelector from "@/components/ui/MonthlySalesSelector";
import { RiStackOverflowFill } from "react-icons/ri";

// Styled components
const Header = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5em;
  color: #1f2937;
  font-weight: bold;
  display: flex;

  @media (min-width: 640px) {
    align-items: center;
  }
`;

const IconWrapper = styled.span`
  font-size: 2em;
  color: #1f2937;
`;

// Main component
export default function Sales() {
  return (
    <>
      <Header>
        <IconWrapper>
          <RiStackOverflowFill />
        </IconWrapper>
        <HeaderTitle>Movimientos</HeaderTitle>
      </Header>
      <MonthlySalesSelector />
    </>
  );
}