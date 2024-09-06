import "./styles/navbarstyles.sass"
import { MdTableRestaurant } from "react-icons/md";
import { RiStackOverflowFill } from "react-icons/ri";
import { MdDeliveryDining } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdOutlineInventory } from "react-icons/md";
import { FaPeopleRobbery } from "react-icons/fa6";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";






export default function NavBarAsideDashboard() {
    return (
        <div className="navbarcontainer">
            <div className="flex align items-center gap-3 mt-3">
                <img className="w-12" src="/images/restadmin.png" alt="" />
                <h1 className="font-bold text-indigo-800"><span className="text-amber-300">Rest</span>Admin</h1>
            </div>
            <div className="companylogo w-20 m-5 rounded">
                <img className="object-cover" src="/images/Logo-KFC.png" alt="" />
                <h3 className="font-bold mt-3">KFC</h3>
                <h3 className="text-xs">Administrador</h3>
            </div>
            <Link href="/dashboard/tables">            
                <div className="flex flex-col items-center font-semibold text-xs">
                <MdTableRestaurant className="text-7xl text-amarillo" />
                MESAS
                </div>
            </Link>
            <Link href="/dashboard/pos">            
                <div className="flex flex-col items-center font-semibold text-xs">
                <HiComputerDesktop className="text-7xl text-amarillo" />
                POS
                </div>
            </Link>
            <div className="flex flex-col items-center font-semibold text-xs">
                <RiStackOverflowFill className="text-7xl text-amarillo" />
                MOVIMIENTOS
            </div >
            <div className="flex flex-col items-center font-semibold text-xs">
                <MdDeliveryDining className="text-7xl text-amarillo" />
                DOMICILIOS
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
            <div className="flex flex-col items-center font-semibold text-xs">
                <MdOutlineInventory className="text-6xl text-amarillo" />
                INVENTARIO
            </div>
            <div className="flex flex-col items-center font-semibold text-xs">
                <FaPeopleRobbery className="text-6xl text-amarillo m-2" />
                EMPLEADOS
            </div>

        </div>
    )
}