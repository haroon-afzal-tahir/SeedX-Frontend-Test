import { useState, useEffect } from "react";
import { useDevice } from "./useDevice";

export function useSidebar() {
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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile) {
        const target = event.target as HTMLElement;
        // Check if the click is outside both the sidebar and its overlay
        const isSidebarClick = target.closest("[data-sidebar]");
        const isOverlayClick = target.closest("[data-sidebar-overlay]");

        if (!isSidebarClick && !isOverlayClick && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    isDesktop,
  };
}
