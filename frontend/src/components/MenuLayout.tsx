"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { IoCarSportSharp } from "react-icons/io5";
import { BiArrowToRight, BiArrowBack } from "react-icons/bi";

export function MenuLayout() {
  // Add sidebar state management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window width for responsive behavior
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    // Update width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle responsive sidebar behavior ONLY on window resize
  useEffect(() => {
    const isDesktop = windowWidth >= 768; // md breakpoint

    // Skip the initial render (when windowWidth is first set)
    if (windowWidth === 0) return;

    // Only auto-adjust on window resize, not when sidebar state changes
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [windowWidth]); // Remove isSidebarOpen dependency

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle clicks in mobile view
      if (windowWidth < 768) {
        const target = event.target as HTMLElement;
        // Check if click is outside sidebar and sidebar is open
        if (!target.closest('.bg-sidebar') && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, windowWidth]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="md:hidden md:flex-1 md:h-full max-w-3xl pt-4">
        <div className="flex items-center justify-center gap-2 relative flex-1">
          <button
            className="p-2 md:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-md transition-all self-start cursor-pointer"
            onClick={toggleSidebar}
          >
            <BiArrowToRight size={20} />
          </button>
          <IoCarSportSharp fontSize={20} /> SuperCar Assistant
        </div>
      </div>
    </>
  );
}
