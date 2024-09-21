'use client'
import MainFooter from "@/components/footer/mainFooter";
import Mainhero from "@/components/hero/mainhero";
import Marcas from "@/components/marcas/marcas";
import Mainnav from "@/components/navbars/mainnav";


export default function Home() {
  return (
    <main>
      <Mainnav/>
      <Mainhero/>
      <Marcas />
      <MainFooter />
    </main>
  );
}
