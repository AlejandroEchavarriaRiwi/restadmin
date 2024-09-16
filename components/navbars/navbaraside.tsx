'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './styles/navbarstyles.sass';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
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

export default function NavBarAsideDashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const { user, loading, error, logout } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center fixed inset-0 z-50 bg-white opacity-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
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

    const isAdmin = user.role.some(r => r.roleId === 2);
    const isCashier = user.role.some(r => r.roleId === 1);
    const isWaiter = user.role.some(r => r.roleId === 3);

    interface NavItemProps {
        href: string;
        icon: any;
        label: string;
        condition?: boolean;
        isOpen: boolean;
    }

    const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, condition = true, isOpen }) => {
        const pathname = usePathname();
        const isActive = pathname === href;

        if (!condition) return null;
        return (
            <Link href={href} className="w-full">
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
    return (
        <div className={`flex flex-col bg-azuloscuro text-white ${isOpen ? 'w-64' : 'w-20'} transition-all duration-200 ease-in-out h-full`}>
            <div className="flex text-center items-center justify-between p-4">
                {isOpen && (
                    <div className="flex items-center gap-3">
                        <img className="w-10 h-10" src="/images/restadmin.png" alt="RestAdmin Logo" />
                        <h1 className="font-bold text-lg">
                            <span className="text-yellow-400">Rest</span>Admin
                        </h1>
                    </div>
                )}
                <button onClick={() => setIsOpen(!isOpen)} className={`p-2 flex text-center m-auto rounded-full hover:bg-azulmedio text-2xl ${isOpen ? 'mr-0': 'm-auto'}`}>
                    {isOpen ? <GiForkKnifeSpoon /> : <GiKnifeFork />
                    }
                </button>
            </div>

            {isOpen && (
                <div className="flex flex-col items-center mb-4">
                    <img className="w-20 h-20 rounded-full object-cover" src="/images/Logo-KFC.png" alt="Company Logo" />
                    <h3 className="font-bold mt-2">{user.name}</h3>
                    <h3 className="text-xs">
                        {isAdmin ? 'Administrador' : isCashier ? 'Cajero' : isWaiter ? 'Mesero' : 'Usuario'}
                    </h3>
                </div>
            )}

            {!isOpen && (
                <div className="flex flex-col items-center mb-4">
                    <img className="w-16 h-16 rounded-full object-cover" src="/images/Logo-KFC.png" alt="Company Logo" />
                </div>
            )}

            <nav className={`flex-1 overflow-y-auto ${isOpen ? 'ml-4' : 'ml-0 py-16'} `}>
                <NavItem href="/dashboard/tables" icon={MdTableRestaurant} label="MESAS" condition={isAdmin || isWaiter} isOpen={isOpen} />
                <NavItem href="/dashboard/invoice" icon={FaFileInvoiceDollar} label="FACTURAR" condition={isAdmin || isCashier} isOpen={isOpen} />
                <NavItem href="/dashboard/pos" icon={HiComputerDesktop} label="POS" condition={isAdmin || isCashier} isOpen={isOpen} />
                <NavItem href="/dashboard/kitchen" icon={FaKitchenSet} label="COCINA" condition={isAdmin || isCashier} isOpen={isOpen} />
                <NavItem href="/dashboard/delivery" icon={MdDeliveryDining} label="DOMICILIOS" condition={isAdmin || isCashier} isOpen={isOpen} />
                <NavItem href="#" icon={RiStackOverflowFill} label="MOVIMIENTOS" condition={isAdmin} isOpen={isOpen} />
                <NavItem href="#" icon={ImStatsDots} label="ESTADISTICAS" condition={isAdmin} isOpen={isOpen} />
                <NavItem href="/dashboard/menu" icon={BiSolidFoodMenu} label="MENU" condition={isAdmin} isOpen={isOpen} />
                <NavItem href="/dashboard/createusers" icon={FaPeopleRobbery} label="EMPLEADOS" condition={isAdmin} isOpen={isOpen} />
            </nav>

            <button onClick={logout} className={`my-2  m-auto text-blanco p-2 flex items-center ${isOpen ? 'text-left ml-3' : 'text-center justify-center w-full ml-0'}`}>
                <TbLogout2 className="text-5xl mr-2" />
                {isOpen && 'Cerrar sesión'}
            </button>
        </div>
    );
}
