"use client";

import Link from "next/link"
import { useSessions } from "@/context/sessions.context";
import { MdMoreHoriz } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { IoCarSportSharp } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";

export const Sidebar = () => {
  const { sessions, setSessions } = useSessions();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { id } = useParams();
  
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

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSessions(sessions.filter(session => session.id !== id));
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="bg-sidebar h-full w-64 p-4 flex flex-col gap-2">
      <Link href="/" className={`p-2 rounded-md transition-all hover:bg-background ${id == null ? 'bg-background gap-6' : ''} flex justify-center items-center gap-2 w-full text-sm text-center`}
      ><IoCarSportSharp fontSize={20}/> SuperCar Assistant
      </Link>
      {sessions.length > 0 && (
        <>
          <hr className="my-2" />
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <Link key={session.id} href={`/${session.id}`} className={`flex group relative h-10 overflow-visible items-center justify-between cursor-pointer transition-all p-2 rounded-md hover:bg-neutral-200  w-full text-sm truncate ${id === session.id ? '!bg-neutral-300' : ''}`}>
                <span className={`truncate group-hover:ml-4 transition-all ${id === session.id ? '!ml-6' : ''}`}>
                  {session.name}
                </span>

                <div className="relative menu-container">
                  <button 
                    onClick={(e) => toggleMenu(session.id, e)} 
                    className={`hover:bg-neutral-200 group-hover:opacity-100 ${openMenuId === session.id ? 'opacity-100' : 'opacity-0'} transition-all cursor-pointer rounded-md p-1`}
                  >
                    <MdMoreHoriz />
                  </button>
                  
                  {openMenuId === session.id && (
                    <div className="absolute right-0 top-8 w-36 bg-white shadow-lg rounded-md py-1 z-10">
                      <button 
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-500"
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
