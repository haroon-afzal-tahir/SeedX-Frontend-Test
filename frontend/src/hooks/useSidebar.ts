import { useState, useEffect, RefObject } from "react";
import { useDevice } from "./useDevice";

export function useSidebar(sidebarRef: RefObject<HTMLElement | null>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isMobile, isDesktop } = useDevice();

  // Handle responsive sidebar behavior
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  // Handle click outside using ref
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarRef.current) {
        const target = event.target as Node;

        // Check if click is outside the sidebar
        if (!sidebarRef.current?.contains(target as Node) && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile, sidebarRef]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    isDesktop,
  };
}
