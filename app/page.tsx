import MainFooter from "@/components/footer/mainFooter";
import Mainhero from "@/components/hero/mainhero";
import Mainnav from "@/components/navbars/mainnav";


export default function Home() {
  return (
    <main>
      <Mainnav/>
      <Mainhero/>
      <MainFooter />
    </main>
  );
}
