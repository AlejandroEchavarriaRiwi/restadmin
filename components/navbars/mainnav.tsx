'use client'
import React, { useState } from 'react';
import Link from "next/link";
import { ChevronDown, ChevronUp } from 'lucide-react';
import "./styles/navbarstyles.sass";

const SubMenu = ({ items, isOpen }) => (
  <ul className={`submenu ${isOpen ? 'open' : ''}`}>
    {items.map((item, index) => (
      <li key={index}>
        <Link href={item.href}>{item.label}</Link>
      </li>
    ))}
  </ul>
);

export default function Mainnav() {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const navItems = [
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

  const handleMouseEnter = (index) => {
    setOpenSubmenu(index);
  };

  const handleMouseLeave = () => {
    setOpenSubmenu(null);
  };

  return (
    <nav className="mainnav">
      <div className="logo">
        <h1><span>Rest</span>Admin</h1>
      </div>
      <ul className="navcenter">
        {navItems.map((item, index) => (
          <li key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
            <Link className="link" href={item.href}>
              {item.label}
              {item.subItems && (
                openSubmenu === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />
              )}
            </Link>
            {item.subItems && <SubMenu items={item.subItems} isOpen={openSubmenu === index} />}
          </li>
        ))}
      </ul>
      <ul className="navright">
        <li>
          <Link className="link" href="#">Entrar</Link>
          <button>
            <Link className="link" href="#">Agenda una demo</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}