'use client'

import React, { useEffect } from "react";
import "./styles/navbarstyles.sass";
import { MdTableRestaurant, MdDeliveryDining } from "react-icons/md";
import { RiStackOverflowFill } from "react-icons/ri";
import { ImStatsDots } from "react-icons/im";
import { BiSolidFoodMenu } from "react-icons/bi";
import { FaPeopleRobbery, FaKitchenSet, FaFileInvoiceDollar } from "react-icons/fa6";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function NavBarAsideDashboard() {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amarillo"></div>
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

  const isAdmin = user.roles.some(r => r.roleId === 1);
  const isCashier = user.roles.some(r => r.roleId === 2);
  const isWaiter = user.roles.some(r => r.roleId === 3);

  return (
    <div className="navbarcontainer">
      <div className="flex align items-center gap-3 mt-3">
        <img className="w-12" src="/images/restadmin.png" alt="" />
        <h1 className="font-bold text-indigo-800">
          <span className="text-amber-300">Rest</span>Admin
        </h1>
      </div>
      <div className="companylogo w-20 m-5 rounded">
        <img className="object-cover" src="/images/Logo-KFC.png" alt="" />
        <h3 className="font-bold mt-3">{user.name}</h3>
        <h3 className="text-xs">
          {isAdmin ? "Administrador" : isCashier ? "Cajero" : isWaiter ? "Mesero" : "Usuario"}
        </h3>
      </div>

      {(isAdmin || isWaiter) && (
        <Link href="/dashboard/tables">            
          <div className="flex flex-col items-center font-semibold text-xs">
            <MdTableRestaurant className="text-7xl text-amarillo" />
            MESAS
          </div>
        </Link>
      )}

      {(isAdmin || isCashier) && (
        <>
          <Link href="/dashboard/invoice">            
            <div className="flex flex-col items-center font-semibold text-xs">
              <FaFileInvoiceDollar className="text-6xl my-2 text-amarillo" />
              FACTURAR
            </div>
          </Link>
          <Link href="/dashboard/pos">            
            <div className="flex flex-col items-center font-semibold text-xs">
              <HiComputerDesktop className="text-7xl text-amarillo" />
              POS
            </div>
          </Link>
          <Link href="/dashboard/kitchen">            
            <div className="flex flex-col items-center font-semibold text-xs">
              <FaKitchenSet className="text-7xl text-amarillo" />
              COCINA
            </div>
          </Link>
          <Link href="/dashboard/delivery"> 
            <div className="flex flex-col items-center font-semibold text-xs">
              <MdDeliveryDining className="text-7xl text-amarillo" />
              DOMICILIOS
            </div>
          </Link>
        </>
      )}

      {isAdmin && (
        <>
          <div className="flex flex-col items-center font-semibold text-xs">
            <RiStackOverflowFill className="text-7xl text-amarillo" />
            MOVIMIENTOS
          </div>
          <div className="flex flex-col items-center font-semibold text-xs">
            <ImStatsDots className="text-5xl text-amarillo m-2" />
            ESTADISTICAS
          </div>
          <Link href="/dashboard/menu">
            <div className="flex flex-col items-center font-semibold text-xs">
              <BiSolidFoodMenu className="text-6xl text-amarillo" />
              MENU
            </div>
          </Link>
          <Link href="/dashboard/createusers">
            <div className="flex flex-col items-center font-semibold text-xs">
              <FaPeopleRobbery className="text-6xl text-amarillo m-2" />
              EMPLEADOS
            </div>
          </Link>
        </>
      )}

      <button onClick={logout} className="mt-auto mb-4 text-red-500">Cerrar sesión</button>
    </div>
  );
}