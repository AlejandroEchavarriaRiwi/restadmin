'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronUp, X, Menu } from 'lucide-react'
import styled from 'styled-components'

// Interfaces
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

// Styled Components
const Nav = styled.nav.attrs({
  className: "bg-white shadow-md"
})``;

const NavContainer = styled.div.attrs({
  className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
})``;

const NavContent = styled.div.attrs({
  className: "flex justify-between h-16"
})``;

const LogoLink = styled(Link).attrs({
  className: "flex-shrink-0 flex items-center"
})``;

const LogoText = styled.span<{ secondary?: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.secondary ? 'var(--color-secondary, #secondary-color)' : 'var(--color-primary, #primary-color)'};
`;

const DesktopMenu = styled.div.attrs({
  className: "hidden lg:flex items-center justify-center flex-grow"
})``;

const DesktopActions = styled.div.attrs({
  className: "hidden lg:flex items-center"
})``;

const MobileMenuButton = styled.button.attrs({
  className: "lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
})``;

const MobileMenuContainer = styled.div.attrs({
  className: "lg:hidden fixed inset-0 z-50 bg-white"
})<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 300ms ease-in-out;
`;

const MobileMenuContent = styled.div.attrs({
  className: "px-2 pt-2 pb-3 h-full overflow-y-auto"
})``;

// SubMenu Component
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

// Main Navigation Component
export default function MainNav() {
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Navigation items data
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

  // Event handlers
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
    <Nav>
      <NavContainer>
        <NavContent>
          <div className="flex items-center">
            <LogoLink href="/">
              <LogoText>Rest</LogoText>
              <LogoText secondary>Admin</LogoText>
            </LogoLink>
          </div>
          <DesktopMenu>
            {renderNavItems(false)}
          </DesktopMenu>
          <DesktopActions>
            <Link href="/login" className="text-gray-800 hover:bg-primary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Entrar
            </Link>
            <Link href="/contactus" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-hover transition-colors duration-200">
              Agenda una demo
            </Link>
          </DesktopActions>
          <div className="flex items-center lg:hidden">
            <MobileMenuButton onClick={toggleMobileMenu}>
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </MobileMenuButton>
          </div>
        </NavContent>
      </NavContainer>
      <MobileMenuContainer ref={mobileMenuRef} isOpen={mobileMenuOpen}>
        <MobileMenuContent>
          <div className="flex justify-between items-center mb-4">
            <LogoLink href="/">
              <LogoText>Rest</LogoText>
              <LogoText secondary>Admin</LogoText>
            </LogoLink>
            <MobileMenuButton onClick={closeMobileMenu}>
              <X className="block h-6 w-6" aria-hidden="true" />
            </MobileMenuButton>
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
        </MobileMenuContent>
      </MobileMenuContainer>
    </Nav>
  )
}