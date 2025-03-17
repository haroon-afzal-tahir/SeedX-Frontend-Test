"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { IoCarSportSharp } from "react-icons/io5";
import { useSessions } from "@/context/sessions.context";
import { SessionList } from "./SessionList";
import { useSidebarAnimation } from "./hooks/useSidebarAnimation";
import { useDevice } from "@/hooks/useDevice";

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

  const margin = useSidebarAnimation(isOpen);
  const { isMobile } = useDevice();

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
    if (isMobile) {
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
          data-sidebar-overlay
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-[5]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        />
      )}
      <div
        data-sidebar
        className="bg-gradient-to-b from-sidebar to-sidebar/95 h-full flex flex-col gap-3 
          md:static fixed z-10 border-r border-border/40 backdrop-blur-md"
        style={{
          marginLeft: margin,
          width: 280,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <div className="p-4 flex flex-col gap-3">
          <button
            className="md:hidden rounded-full bg-background/50 px-4 py-2.5 
              hover:bg-background/70 self-start text-sm group flex items-center gap-2
              transition-all duration-200 border border-border/40"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <BiArrowBack className="text-foreground/70 group-hover:translate-x-[-2px] transition-transform" />
            <span>Close</span>
          </button>

          <Link
            href="/"
            onClick={handleLinkClick}
            className={`relative overflow-hidden rounded-xl p-4 transition-all 
              ${id == null ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' :
                'bg-background/50 hover:bg-background/70 border border-border/40'} 
              flex items-center gap-3 group`}
          >
            <div className="relative z-10 flex items-center gap-3">
              <IoCarSportSharp
                className={`transition-transform duration-300 text-xl
                  ${id == null ? 'text-white' : 'text-blue-500'}`}
              />
              <span className="font-medium">New Chat</span>
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 bg-gradient-to-r 
              ${id == null ? 'from-blue-600/50 to-blue-400/50' :
                'from-background/50 to-transparent'}`}
            />
          </Link>
        </div>

        {mounted && sessions.length > 0 && (
          <>
            <div className="px-4 flex items-center gap-2 text-xs text-foreground/50 font-medium">
              <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
              Recent Chats
              <div className="h-px flex-1 bg-gradient-to-l from-border/40 to-transparent" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
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
