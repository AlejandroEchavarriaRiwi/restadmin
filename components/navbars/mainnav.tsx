'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronUp, X, Menu } from 'lucide-react'

interface SubItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  subItems?: SubItem[]
}

interface SubMenuProps {
  items: SubItem[]
  isOpen: boolean
  onItemClick: (label: string, href: string) => void
  isMobile: boolean
}

const SubMenu: React.FC<SubMenuProps> = ({ items, isOpen, onItemClick, isMobile }) => {
  return (
    <ul className={`
      ${isMobile ? 'relative' : 'absolute top-full left-0'}
      bg-white shadow-md rounded-md overflow-hidden transition-all duration-300 ease-in-out z-50
      ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      ${isMobile ? 'w-full' : 'w-48'}
    `}>
      {items.map((item, index) => (
        <li key={index}>
          <Link 
            href={item.href} 
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault()
              onItemClick(item.label, item.href)
            }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function MainNav() {
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const navItems: NavItem[] = [
    {
      label: "Restaurantes",
      href: "#",
      subItems: [
        { label: "Gestión de Menú", href: "/contactus" },
        { label: "Reservaciones", href: "/contactus" },
        { label: "Análisis de Ventas", href: "/contactus" },
      ],
    },
    {
      label: "Retail",
      href: "#",
      subItems: [
        { label: "Inventario", href: "/contactus" },
        { label: "POS", href: "/contactus" },
        { label: "Fidelización", href: "/contactus" },
      ],
    },
    {
      label: "Mas",
      href: "#",
      subItems: [
        { label: "Soporte", href: "/contactus" },
        { label: "Blog", href: "/contactus" },
        { label: "Contacto", href: "/contactus" },
      ],
    },
    { label: "Precios", href: "#" },
  ]

  const handleMouseEnter = (index: number) => {
    setOpenSubmenu(index)
  }

  const handleMouseLeave = () => {
    setOpenSubmenu(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleSubmenu = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index)
  }

  const handleItemClick = (label: string, href: string) => {
    localStorage.setItem('selectedNavItem', label)
    router.push(href)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderNavItems = (isMobile: boolean) => (
    <ul className={`${isMobile ? 'flex flex-col w-full' : 'flex items-center space-x-4'}`}>
      {navItems.map((item, index) => (
        <li key={index} className={`relative ${isMobile ? 'w-full' : ''}`}
          onMouseEnter={isMobile ? undefined : () => handleMouseEnter(index)}
          onMouseLeave={isMobile ? undefined : handleMouseLeave}>
          <Link
            className={`flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors duration-200 ${isMobile ? 'w-full' : ''}`}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              if (isMobile && item.subItems) {
                toggleSubmenu(index)
              } else {
                handleItemClick(item.label, item.href)
              }
            }}
          >
            {item.label}
            {item.subItems && (
              openSubmenu === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />
            )}
          </Link>
          {item.subItems && (
            <SubMenu
              items={item.subItems}
              isOpen={isMobile ? openSubmenu === index : openSubmenu === index}
              onItemClick={handleItemClick}
              isMobile={isMobile}
            />
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Rest</span>
              <span className="text-2xl font-bold text-secondary">Admin</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center justify-center flex-grow">
            {renderNavItems(false)}
          </div>
          <div className="hidden lg:flex items-center">
            <Link href="/login" className="text-gray-800 hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Entrar
            </Link>
            <Link href="/contactus" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-hover transition-colors duration-200">
              Agenda una demo
            </Link>
          </div>
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-2 pt-2 pb-3 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Rest</span>
              <span className="text-2xl font-bold text-secondary">Admin</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <X className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {renderNavItems(true)}
          <div className="mt-4 flex flex-col space-y-2">
            <Link href="/login" className="text-center bg-primary text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
              Entrar
            </Link>
            <Link href="/contactus" className="text-center bg-secondary text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
              Agenda una demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}