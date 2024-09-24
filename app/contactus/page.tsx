'use client'

import React, { useEffect, useState } from "react"
import styled from 'styled-components'
import ContactUsForm from "@/components/forms/contactUsForm"
import Mainnav from "@/components/navbars/mainnav"
import Image from "next/image"

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`

const ContentWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  
  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const LeftColumn = styled.div`
  width: 100%;
  
  @media (min-width: 1024px) {
    width: 50%;
    padding-right: 2rem;
  }
`

const RightColumn = styled.div`
  width: 100%;
  margin-top: 3rem;
  
  @media (min-width: 1024px) {
    width: 50%;
    margin-top: 0;
  }
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    font-size: 3rem;
  }
  
  @media (min-width: 1024px) {
    text-align: left;
  }
`

const PrimarySpan = styled.span`
  color: #F2CF5B;
`

const StickyWrapper = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 6rem;
  }
`

const StyledImage = styled(Image)`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`

export default function ContactPage() {
  const [pageTitle, setPageTitle] = useState("Contáctanos")

  useEffect(() => {
    const storedTitle = localStorage.getItem("selectedNavItem")
    if (storedTitle) {
      setPageTitle(storedTitle)
    }
  }, [])

  return (
    <PageWrapper>
      <Mainnav />
      <ContentWrapper>
        <FlexContainer>
          <LeftColumn>
            <Title>
              Tu mejor aliado para{' '}
              <PrimarySpan>{pageTitle}</PrimarySpan>
            </Title>
            <ContactUsForm emailDestino={"aechavarriaj@gmail.com"} />
          </LeftColumn>
          <RightColumn>
            <StickyWrapper>
              <StyledImage
                src="/images/contactus.png"
                width={500}
                height={500}
                alt="Contact Us"
                priority
              />
            </StickyWrapper>
          </RightColumn>
        </FlexContainer>
      </ContentWrapper>
    </PageWrapper>
  )
}