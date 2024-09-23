'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  onItemClick: (label: string, href: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, isOpen, onItemClick }) => {
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
          <Link href={item.href} onClick={(e) => {
            e.preventDefault();
            onItemClick(item.label, item.href);
          }}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default function Mainnav() {
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const handleItemClick = (label: string, href: string) => {
    localStorage.setItem('selectedNavItem', label);
    
    // Usar la nueva API de navegación
    router.push(href);
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
            onClick={(e) => {
              e.preventDefault();
              if (isMobile && item.subItems) {
                toggleSubmenu(index);
              } else {
                handleItemClick(item.label, item.href);
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
            />
          )}
        </li>
      ))}
    </ul>
  );


  return (
    <nav className="mainnav">
      <div className='highPart'>
        <div className="logo">
        <Link className="link" href="/"><h1><span>Rest</span>Admin</h1></Link>
        </div>
        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : '☰'}
        </button>
      </div>
      <div className="loginresponsive">
        <Link className="link" href="/login">Entrar</Link>
      </div>
      <div ref={mobileMenuRef} className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
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
            <Link className="link" href="/contactus">Agenda una demo</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}