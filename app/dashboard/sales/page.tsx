import MonthlySalesSelector from "@/components/ui/MonthlySalesSelector";
import { RiStackOverflowFill } from "react-icons/ri";

export default function Sales() {
  return (
    <>
      <div className="bg-[#f8f9fa] p-[20px] flex items-center justify-center lg:justify-start gap-2  w-full ">
        <RiStackOverflowFill className="text-[2em] text-gray-800" />
        <h1 className="text-[1.5em] text-gray-800 font-bold flex sm:items-center">
          Movimientos
        </h1>
      </div>
      <MonthlySalesSelector />
    </>
  );
}
