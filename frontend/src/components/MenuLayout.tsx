"use client";

import { IoCarSportSharp } from "react-icons/io5";
import { BiArrowToRight } from "react-icons/bi";
import { useSidebar } from "@/hooks/useSidebar";
import { Sidebar } from "./Sidebar/Sidebar";

export function MenuLayout() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="md:hidden md:flex-1 md:h-full max-w-3xl pt-4">
        <div className="flex items-center justify-center gap-2 relative flex-1">
          <button
            className="p-2 md:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-md transition-all self-start cursor-pointer"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            <BiArrowToRight size={20} />
          </button>
          <IoCarSportSharp fontSize={20} /> SuperCar Assistant
        </div>
      </div>
    </>
  );
}
