'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import "./styles/navbarstyles.sass";

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface SubMenuProps {
  items: SubItem[];
  isOpen: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, isOpen }) => {
  const subMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (subMenuRef.current) {
      subMenuRef.current.style.maxHeight = isOpen ? `${subMenuRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <ul ref={subMenuRef} className={`submenu ${isOpen ? 'open' : ''}`}>
      {items.map((item, index) => (
        <li key={index}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default function Mainnav() {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      label: "Restaurantes",
      href: "#",
      subItems: [
        { label: "Gestión de Menú", href: "#" },
        { label: "Reservaciones", href: "#" },
        { label: "Análisis de Ventas", href: "#" },
      ],
    },
    {
      label: "Retail",
      href: "#",
      subItems: [
        { label: "Inventario", href: "#" },
        { label: "POS", href: "#" },
        { label: "Fidelización", href: "#" },
      ],
    },
    {
      label: "Mas",
      href: "#",
      subItems: [
        { label: "Soporte", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contacto", href: "#" },
      ],
    },
    { label: "Precios", href: "#" },
  ];

  const handleMouseEnter = (index: number) => {
    setOpenSubmenu(index);
  };

  const handleMouseLeave = () => {
    setOpenSubmenu(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderNavItems = (isMobile: boolean) => (
    <ul className={isMobile ? "mobile-nav-items" : "navcenter"}>
      {navItems.map((item, index) => (
        <li key={index}
          onMouseEnter={isMobile ? undefined : () => handleMouseEnter(index)}
          onMouseLeave={isMobile ? undefined : handleMouseLeave}>
          <Link
            className="link"
            href={item.href}
            onClick={isMobile && item.subItems ? (e) => {
              e.preventDefault();
              toggleSubmenu(index);
            } : undefined}
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
            />
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="mainnav">
      <div className="logo">
        <h1><span>Rest</span>Admin</h1>
      </div>
      <button className="menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X size={24} /> : '☰'}
      </button>
      <div className="loginresponsive">
        <Link className="link" href="/login">Entrar</Link>
      </div>
      <div ref={mobileMenuRef} className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={closeMobileMenu}>
          <X size={24} />
        </button>
        {renderNavItems(true)}
        <ul className="navright">
          <li>
            <button className='buttonDemo'>
              <Link className="link" href="#">Agenda una demo</Link>
            </button>
          </li>
        </ul>
      </div>
      {renderNavItems(false)}
      <ul className="navright">
        <li>
          <Link className="link" href="/login">Entrar</Link>
          <button className='buttonDemo'>
            <Link className="link" href="#">Agenda una demo</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}