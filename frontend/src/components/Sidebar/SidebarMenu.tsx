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
    <div ref={menuRef} className="relative menu-container">
      <button
        onClick={(e) => toggleMenu(sessionId, e)}
        className={`hover:bg-sidebar-hover group-hover:opacity-100 ${openMenuId === sessionId ? 'opacity-100' : 'opacity-0'} transition-all cursor-pointer rounded-md p-1`}
      >
        <MdMoreHoriz />
      </button>

      {openMenuId === sessionId && (
        <div className="absolute right-0 top-8 w-36 bg-background shadow-lg rounded-md z-10">
          <button
            onClick={(e) => handleDeleteSession(sessionId, e)}
            className="flex items-center gap-2 w-full px-3 py-2 text-left rounded-md text-sm text-red-500 cursor-pointer"
          >
            <MdDelete className="text-red-500" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}; 
