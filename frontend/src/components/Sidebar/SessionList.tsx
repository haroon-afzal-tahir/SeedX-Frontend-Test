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
            group relative overflow-hidden rounded-lg
            transition-all duration-200 hover:shadow-sm
            ${currentId === session.id
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'hover:bg-background/50 border border-transparent hover:border-border/40'
            }
          `}
        >
          <div className="flex items-center justify-between px-3 py-2.5 relative z-10">
            <span className={`
              truncate text-sm transition-all duration-200
              ${currentId === session.id
                ? 'text-blue-500 font-medium'
                : 'text-foreground/70 group-hover:text-foreground'
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
          </div>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 bg-gradient-to-r 
            ${currentId === session.id
              ? 'from-blue-500/5 to-transparent'
              : 'from-background/50 to-transparent'}`}
          />
        </Link>
      ))}
    </div>
  );
}; 
