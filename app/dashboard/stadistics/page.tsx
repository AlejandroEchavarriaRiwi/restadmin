'use client'

import React from "react";
import styled from "styled-components";
import ProductProfitabilityChart from "@/components/ui/ProductProfitabilityChart";
import SalesByHourChart from "@/components/ui/SalesbyHour";
import TopSellingProduct from "@/components/ui/TopSellingProduct";
import { ImStatsDots } from "react-icons/im";

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
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Main component
export default function StatisticsPage() {
  return (
    <>
      <Header>
        <ImStatsDots className="text-[2em] text-gray-800" />
        <HeaderTitle>Estadísticas</HeaderTitle>
      </Header>
      <ContentWrapper>
        <ContentInner>
          <TopSellingProduct />
          <ChartGrid>
            <SalesByHourChart />
            <ProductProfitabilityChart />
          </ChartGrid>
        </ContentInner>
      </ContentWrapper>
    </>
  );
}