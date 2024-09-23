'use client';

import React, { useEffect, useState } from "react";
import ContactUsForm from "@/components/forms/contactUsForm";
import Mainnav from "@/components/navbars/mainnav";
import Image from "next/image";
import styled from "styled-components";

const MainDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
  }
`;

const LeftDiv = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    order: 1;
  }
`;

const RightDiv = styled.div`
  width: 50%;
  position: sticky;
  top: 2rem;
  margin-top: 4rem;
  height: calc(100vh - 4rem);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    position: static;
    margin-top: 0px;
    height: auto;
    order: 2;
    margin-bottom: 2rem;
  }
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  padding: 0px 20px;
  border-radius: 80px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;

  span {
    color: #f2cf5b;
  }

  @media (max-width: 768px) {
    margin-top: 30px;
    font-size: 2rem;
  }
`;

export default function ContactPage() {
  const [pageTitle, setPageTitle] = useState("Contáctanos");

  useEffect(() => {
    const storedTitle = localStorage.getItem("selectedNavItem");
    if (storedTitle) {
      setPageTitle(storedTitle);
    }
  }, []);

  return (
    <>
      <Mainnav />
      <MainDiv>
        <LeftDiv>
          <Title>
            Tu mejor aliado para <span>{pageTitle}</span>
          </Title>
          <ContactUsForm emailDestino={"aechavarriaj@gmail.com"} />
        </LeftDiv>
        <RightDiv>
          <StyledImage
            src="/images/contactus.png"
            width={500}
            height={500}
            alt="Contact Us"
            layout="responsive"
          />
        </RightDiv>
      </MainDiv>
    </>
  );
}