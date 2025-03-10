interface Session {
  id: string;
  name: string;
  createdAt: Date;
}

interface SidebarProps {
  sessions: Session[];
}
