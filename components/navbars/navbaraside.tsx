'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { MdTableRestaurant, MdDeliveryDining } from 'react-icons/md';
import { RiStackOverflowFill } from 'react-icons/ri';
import { ImStatsDots } from 'react-icons/im';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { FaPeopleRobbery, FaKitchenSet, FaFileInvoiceDollar } from 'react-icons/fa6';
import { HiComputerDesktop } from 'react-icons/hi2';
import { TbLogout2 } from "react-icons/tb";
import { GiKnifeFork } from "react-icons/gi";
import { GiForkKnifeSpoon } from "react-icons/gi"

import './styles/navbarstyles.sass'

interface User {
    token: string;
    email: string;
    name: string;
    roleId: number;
}

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(34, 73, 229, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const PulsingButton = styled(motion.button)`
  animation: ${pulseAnimation} 2s infinite;
`;

const SkeletonLoader = () => (
    <div className="flex items-center justify-center h-screen ">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-azulclaro"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="animate-pulse">
            <Image
              src="/images/restadmin.png"
              width={100}
              height={100}
              quality={25}
              priority={true}
              alt="RestAdmin Logo"
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
);

export default function NavBarAsideDashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user, loading, error, logout } = useAuth();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
            setIsCollapsed(true);
        }
    }, [isMobile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center fixed inset-0 z-50 bg-white">
                <SkeletonLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const isAdmin = user.roleId === 2;
    const isCashier = user.roleId === 3;
    const isWaiter = user.roleId === 1;

    interface NavItemProps {
        href: string;
        icon: React.ElementType;
        label: string;
        condition?: boolean;
        isOpen: boolean;
        onClick: () => void;
    }

    const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, condition = true, isOpen, onClick }) => {
        const isActive = pathname === href;

        if (!condition) return null;
        return (
            <Link href={href} className="w-full" onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                    onClick();
                    router.push(href);
                });
            }}>
                <div
                    className={`
                    group flex items-center 
                    ${isOpen ? 'justify-start' : 'justify-center'} 
                    p-2 rounded-s-xl transition-all duration-300 ease-in-out
                    ${isActive ? 'bg-azulclaro text-azuloscuro' : 'hover:bg-azulclaro hover:text-azuloscuro'}
                  `}
                >
                    <Icon
                        className={`
                      text-5xl 
                      ${isOpen ? 'mr-2' : ''} 
                      ${isActive ? 'text-azuloscuro' : 'text-amarillo group-hover:text-azuloscuro'}
                    `}
                    />
                    {isOpen && <span className="text-[0.9rem] font-semibold">{label}</span>}
                </div>
            </Link>
        );
    };

    const toggleNavbar = () => {
        if (isMobile) {
            if (isOpen) {
                setIsOpen(false);
                setTimeout(() => setIsCollapsed(true), 300);
            } else {
                setIsCollapsed(false);
                setTimeout(() => setIsOpen(true), 50);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleNavItemClick = () => {
        if (isMobile) {
            setIsOpen(false);
            setTimeout(() => setIsCollapsed(true), 300);
        }
    };

    const navbarContent = (
        <motion.div
            initial={false}
            animate={{ width: isOpen ? (isMobile ? '55%' : 256) : (isMobile ? 0 : 80) }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex flex-col bg-azuloscuro text-white h-full overflow-hidden ${isMobile ? 'fixed top-0 left-0 z-50' : ''}`}
            style={{ minHeight: '100vh' }}
        >
            <div className="flex text-center items-center justify-between p-4">
                {isOpen && (
                    <div className="flex items-center gap-3">
                        <Image 
                            width={40} 
                            height={40} 
                            src="/images/restadmin.png" 
                            alt="RestAdmin Logo"
                            quality={15}
                            priority
                        />
                        <h1 className="font-bold text-lg">
                            <span className="text-yellow-400">Rest</span>Admin
                        </h1>
                    </div>
                )}
                <button onClick={toggleNavbar} className={`p-2 flex text-center m-auto rounded-full hover:bg-azulmedio text-2xl ${isOpen ? 'mr-0' : 'm-auto'}`}>
                    {isOpen ? <GiForkKnifeSpoon /> : <GiKnifeFork />}
                </button>
            </div>

            {isOpen && (
                <div className="flex flex-col items-center mb-4">
                    <Image 
                        width={80} 
                        height={80} 
                        className="rounded-full object-cover" 
                        src="https://images.rappi.com/restaurants_logo/il-forno-logo1-1568819470999.png" 
                        alt="Company Logo"
                        quality={15}
                        priority={false}
                    />
                    <h3 className="font-bold mt-2">{user.name}</h3>
                    <h3 className="text-xs">
                        {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
                    </h3>
                </div>
            )}

            {!isOpen && (
                <div className="flex flex-col items-center mb-4">
                    <Image 
                        width={64} 
                        height={64} 
                        className="rounded-full object-cover" 
                        src="https://images.rappi.com/restaurants_logo/il-forno-logo1-1568819470999.png" 
                        alt="Company Logo" 
                        priority={false}
                    />
                </div>
            )}

            <nav className={`flex-1 overflow-y-auto ${isOpen ? 'ml-4' : 'ml-0 py-16'} `}>
                <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="MESAS" condition={isAdmin || isWaiter} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="FACTURAR" condition={isAdmin || isCashier} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="COCINA" condition={isAdmin || isCashier} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="DOMICILIOS" condition={isAdmin || isCashier} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/sales" icon={RiStackOverflowFill} label="MOVIMIENTOS" condition={isAdmin} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/stadistics" icon={ImStatsDots} label="ESTADISTICAS" condition={isAdmin} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="MENU" condition={isAdmin} isOpen={isOpen} onClick={handleNavItemClick} />
                <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="EMPLEADOS" condition={isAdmin} isOpen={isOpen} onClick={handleNavItemClick} />
            </nav>

            <button onClick={logout} className={`my-2 m-auto text-blanco p-2 flex items-center ${isOpen ? 'text-left ml-3' : 'text-center justify-center w-full ml-0'}`}>
                <TbLogout2 className="text-5xl mr-2" />
                {isOpen && 'Cerrar sesión'}
            </button>
        </motion.div>
    );

    return (
        <>
            <AnimatePresence>
                {isMobile ? (
                    isCollapsed ? (
                        <PulsingButton
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={toggleNavbar}
                            className="fixed top-1 left-1 z-50 bg-azuloscuro text-white p-4 rounded-full shadow-lg hover:bg-azulmedio"
                        >
                            <GiKnifeFork className="text-2xl" />
                        </PulsingButton>
                    ) : (
                        navbarContent
                    )
                ) : (
                    navbarContent
                )}
            </AnimatePresence>
            {isPending && (
                <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                    <SkeletonLoader />
                </div>
            )}
        </>
    );
}