import ProductProfitabilityChart from "@/components/ui/ProductProfitabilityChart";
import SalesByHourChart from "@/components/ui/SalesbyHour";
import TopSellingProduct from "@/components/ui/TopSellingProduct";
import { ImStatsDots } from "react-icons/im";

export default function StadisticsPage() {
  return (
    <>
      <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-3  w-full ">
        <ImStatsDots className="text-[1.5em] text-gray-800" />
        <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">
          Estadisticas
        </h1>
      </div>
      <div className="w-full flex justify-center mt-8">
      <div className="space-y-8">
      <TopSellingProduct />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SalesByHourChart />
        <ProductProfitabilityChart />
      </div>
    </div>
      </div>
    </>
  );
}
