"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { IoCarSportSharp } from "react-icons/io5";
import { useSessions } from "@/context/sessions.context";
import { SessionList } from "./SessionList";
import { useSidebarAnimation } from "./hooks/useSidebarAnimation";
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { sessions, deleteSession } = useSessions();
  const [mounted, setMounted] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const margin = useSidebarAnimation(isOpen);
  useOutsideClick(menuRef, () => {
    if (openMenuId !== null) {
      setOpenMenuId(null);
    }
  });

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSession(sessionId);
    if (id === sessionId) {
      router.push("/");
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Add overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-[5]"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        ref={menuRef}
        className="bg-sidebar h-full w-64 p-4 flex flex-col gap-3 md:static fixed shadow-xl z-10 border-r border-border/40"
        style={{
          marginLeft: margin,
          width: 250,
          transition: 'box-shadow 0.2s ease-in-out'
        }}
      >
        <button
          className="p-2 md:hidden rounded-md transition-all hover:bg-background/80 self-start cursor-pointer flex items-center gap-2 text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <BiArrowBack className="text-foreground/70" />
          <span>Close menu</span>
        </button>

        <Link
          href="/"
          onClick={handleLinkClick}
          className={`p-3 rounded-lg transition-all hover:bg-background/80 ${id == null ? 'bg-background shadow-sm' : ''
            } flex items-center gap-3 w-full text-sm font-medium`}
        >
          <IoCarSportSharp className="text-blue-500" fontSize={20} />
          <span>SuperCar Assistant</span>
        </Link>

        {mounted && sessions.length > 0 && (
          <>
            <div className="h-px bg-border/40 my-1" />
            <div className="flex-1 overflow-y-auto">
              <SessionList
                sessions={sessions}
                currentId={id as string | null}
                openMenuId={openMenuId}
                toggleMenu={toggleMenu}
                handleDeleteSession={handleDeleteSession}
                handleLinkClick={handleLinkClick}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}; 
