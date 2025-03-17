import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdMoreHoriz, MdDelete } from "react-icons/md";

interface SidebarMenuProps {
  sessionId: string;
  openMenuId: string | null;
  toggleMenu: (id: string, e: React.MouseEvent) => void;
  handleDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
}

export const SidebarMenu = ({ sessionId, openMenuId, toggleMenu, handleDeleteSession }: SidebarMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (openMenuId === sessionId && buttonRef.current && menuRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      menuRef.current.style.position = 'fixed';
      menuRef.current.style.top = `${rect.bottom + 8}px`;
      menuRef.current.style.left = `${rect.right - 192}px`; // 192px is the width of the menu (w-48)
    }
  }, [openMenuId, sessionId]);

  return (
    <div className="relative menu-container">
      <button
        onClick={(e) => toggleMenu(sessionId, e)}
        className={`
          rounded-lg p-1.5 transition-all duration-200
          ${openMenuId === sessionId
            ? 'bg-blue-500/10 text-blue-500'
            : 'opacity-0 group-hover:opacity-100 hover:bg-background/70'
          }
        `}
      >
        <MdMoreHoriz className="text-lg" />
      </button>

      {openMenuId === sessionId && createPortal(
        <div
          ref={menuRef}
          className="
            fixed w-48 bg-background/95 backdrop-blur-xl
            shadow-lg rounded-xl border border-border/40 py-1.5
            animate-fadeIn z-[999]
          "
        >
          <button
            onClick={(e) => handleDeleteSession(sessionId, e)}
            className="
              flex items-center gap-2 w-full px-4 py-2.5 text-left
              text-sm text-red-500 hover:bg-red-500/10 transition-all
              cursor-pointer font-medium
            "
          >
            <MdDelete className="text-lg" />
            Delete Chat
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}; 
