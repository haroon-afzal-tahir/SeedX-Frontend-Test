import { useRef } from 'react';
import { MdMoreHoriz, MdDelete } from "react-icons/md";
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface SidebarMenuProps {
  sessionId: string;
  openMenuId: string | null;
  toggleMenu: (id: string, e: React.MouseEvent) => void;
  handleDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
}

export const SidebarMenu = ({ sessionId, openMenuId, toggleMenu, handleDeleteSession }: SidebarMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => {
    if (openMenuId === sessionId) {
      toggleMenu(sessionId, {} as React.MouseEvent);
    }
  });

  return (
    <div ref={menuRef} className="relative menu-container z-20">
      <button
        onClick={(e) => toggleMenu(sessionId, e)}
        className={`
          hover:bg-sidebar-hover rounded-md p-1.5
          transition-all duration-200 ease-out cursor-pointer
          ${openMenuId === sessionId
            ? 'opacity-100 bg-sidebar-hover'
            : 'opacity-0 group-hover:opacity-100'
          }
        `}
      >
        <MdMoreHoriz className="text-foreground/70" />
      </button>

      {openMenuId === sessionId && (
        <div className="
          absolute right-0 top-8 w-40 bg-background/95 backdrop-blur-sm
          shadow-lg rounded-lg border border-border/40 py-1 
          animate-fadeIn
        ">
          <button
            onClick={(e) => handleDeleteSession(sessionId, e)}
            className="
              flex items-center gap-2 w-full px-3 py-2 text-left
              text-sm text-red-500 hover:bg-red-500/10 transition-colors
              cursor-pointer
            "
          >
            <MdDelete />
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
}; 
