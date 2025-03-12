"use client";

import Link from "next/link"
import { useSessions } from "@/context/sessions.context";
import { MdMoreHoriz } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { IoCarSportSharp } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

export const Sidebar = (props: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {

  const { sessions, deleteSession } = useSessions();
  const [mounted, setMounted] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const { isOpen, setIsOpen } = props;

  // Track sidebar position
  const [margin, setMargin] = useState(0);
  const WIDTH = 250;

  // Animate sidebar movement
  useEffect(() => {
    const target = isOpen ? 0 : -WIDTH;
    const speed = 0.15; // Animation speed factor
    let frameId: number;

    function animatePosition() {
      // Move current position toward target with lerp
      const distance = target - margin;
      const movement = distance * speed;

      // Stop animation when we're close enough
      if (Math.abs(distance) < 0.5) {
        setMargin(target);
        return;
      }

      setMargin(margin + movement);
      frameId = requestAnimationFrame(animatePosition);
    }

    frameId = requestAnimationFrame(animatePosition);

    // Clean up animation when component unmounts or dependencies change
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, margin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-container')) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSession(sessionId);
    // check if the deleted session is the current session
    if (id === sessionId) {
      router.push("/");
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-sidebar h-full w-64 p-4 flex flex-col gap-2 md:static fixed shadow-lg z-10" style={{ marginLeft: margin, width: WIDTH }}>
      <button className="p-2 md:hidden rounded-md transition-all hover:bg-background self-start cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <BiArrowBack />
      </button>
      <Link
        href="/"
        onClick={() => setIsOpen(false)}
        className={`p-2 rounded-md transition-all hover:bg-background ${id == null ? 'bg-background gap-6' : ''} flex justify-center items-center gap-2 w-full text-sm text-center`}
      >
        <IoCarSportSharp fontSize={20} /> SuperCar Assistant
      </Link>
      {mounted && sessions.length > 0 && (
        <>
          <hr className="my-2" />
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <Link key={session.id} href={`/${session.id}`} onClick={() => setIsOpen(false)} className={`flex group relative h-10 overflow-visible items-center justify-between cursor-pointer transition-all p-2 rounded-md w-full text-sm truncate ${id === session.id ? 'bg-background' : 'hover:bg-sidebar-hover'}`}>
                <span className={`truncate group-hover:ml-4 transition-all ${id === session.id ? '!ml-6' : ''}`}>
                  {session.name}
                </span>

                <div className="relative menu-container">
                  <button
                    onClick={(e) => toggleMenu(session.id, e)}
                    className={`hover:bg-sidebar-hover group-hover:opacity-100 ${openMenuId === session.id ? 'opacity-100' : 'opacity-0'} transition-all cursor-pointer rounded-md p-1`}
                  >
                    <MdMoreHoriz />
                  </button>

                  {openMenuId === session.id && (
                    <div className="absolute right-0 top-8 w-36 bg-background shadow-lg rounded-md z-10">
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left rounded-md text-sm text-red-500 cursor-pointer"
                      >
                        <MdDelete className="text-red-500" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
