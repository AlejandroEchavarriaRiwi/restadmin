'use client'

import React, { useEffect, useState } from "react"
import ContactUsForm from "@/components/forms/contactUsForm"
import Mainnav from "@/components/navbars/mainnav"
import Image from "next/image"

export default function ContactPage() {
  const [pageTitle, setPageTitle] = useState("Contáctanos")

  useEffect(() => {
    const storedTitle = localStorage.getItem("selectedNavItem")
    if (storedTitle) {
      setPageTitle(storedTitle)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Mainnav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-center lg:text-left mb-8">
              Tu mejor aliado para{' '}
              <span className="text-primary">{pageTitle}</span>
            </h1>
            <ContactUsForm emailDestino={"aechavarriaj@gmail.com"} />
          </div>
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <div className="sticky top-24">
              <Image
                src="/images/contactus.png"
                width={500}
                height={500}
                alt="Contact Us"
                className="w-full h-auto object-cover rounded-3xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}