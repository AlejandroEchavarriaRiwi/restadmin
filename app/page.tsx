'use client'
import MainFooter from "@/components/footer/mainFooter";
import Mainhero from "@/components/hero/mainhero";
import Marcas from "@/components/marcas/marcas";
import Mainnav from "@/components/navbars/mainnav";
import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
}, []);
  return (
    <main>
      <Mainnav/>
      <Mainhero/>
      <Marcas />
      <MainFooter />
    </main>
  );
}
