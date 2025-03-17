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
    <div
      ref={menuRef}
      className="bg-sidebar h-full w-64 p-4 flex flex-col gap-2 md:static fixed shadow-lg z-10"
      style={{ marginLeft: margin, width: 250 }}
    >
      <button
        className="p-2 md:hidden rounded-md transition-all hover:bg-background self-start cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BiArrowBack />
      </button>

      <Link
        href="/"
        onClick={handleLinkClick}
        className={`p-2 rounded-md transition-all hover:bg-background ${id == null ? 'bg-background gap-6' : ''
          } flex justify-center items-center gap-2 w-full text-sm text-center`}
      >
        <IoCarSportSharp fontSize={20} /> SuperCar Assistant
      </Link>

      {mounted && sessions.length > 0 && (
        <>
          <hr className="my-2" />
          <SessionList
            sessions={sessions}
            currentId={id as string | null}
            openMenuId={openMenuId}
            toggleMenu={toggleMenu}
            handleDeleteSession={handleDeleteSession}
            handleLinkClick={handleLinkClick}
          />
        </>
      )}
    </div>
  );
}; 
