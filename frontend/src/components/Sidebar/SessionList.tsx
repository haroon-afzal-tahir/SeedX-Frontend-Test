import Link from "next/link";
import { SidebarMenu } from "./SidebarMenu";

interface SessionListProps {
  sessions: Session[];
  currentId: string | null;
  openMenuId: string | null;
  toggleMenu: (id: string, e: React.MouseEvent) => void;
  handleDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  handleLinkClick: () => void;
}

export const SessionList = ({ sessions, currentId, openMenuId, toggleMenu, handleDeleteSession, handleLinkClick }: SessionListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/${session.id}`}
          onClick={handleLinkClick}
          className={`flex group relative h-10 overflow-visible items-center justify-between cursor-pointer transition-all p-2 rounded-md w-full text-sm truncate ${currentId === session.id ? 'bg-background' : 'hover:bg-sidebar-hover'
            }`}
        >
          <span className={`truncate group-hover:ml-4 transition-all ${currentId === session.id ? '!ml-6' : ''}`}>
            {session.name}
          </span>

          <SidebarMenu
            sessionId={session.id}
            openMenuId={openMenuId}
            toggleMenu={toggleMenu}
            handleDeleteSession={handleDeleteSession}
          />
        </Link>
      ))}
    </div>
  );
}; 
