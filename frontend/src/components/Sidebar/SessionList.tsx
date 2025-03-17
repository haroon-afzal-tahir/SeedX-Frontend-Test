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
    <div className="flex flex-col gap-1.5">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/${session.id}`}
          onClick={handleLinkClick}
          className={`
            flex group relative h-11 overflow-visible items-center justify-between
            cursor-pointer transition-all px-3 py-2.5 rounded-md w-full text-sm
            ${currentId === session.id
              ? 'bg-background shadow-sm font-medium'
              : 'hover:bg-background/50'
            }
          `}
        >
          <span className={`
            truncate transition-all duration-200 ease-out
            ${currentId === session.id
              ? 'translate-x-1 text-foreground'
              : 'text-foreground/70 group-hover:translate-x-1 group-hover:text-foreground'
            }
          `}>
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
