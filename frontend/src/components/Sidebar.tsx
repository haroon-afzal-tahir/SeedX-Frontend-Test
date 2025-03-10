import Link from "next/link"

export const Sidebar = ({ sessions }: SidebarProps) => {
  return (
    <div className="bg-sidebar h-full w-64 p-4 flex flex-col gap-2">
      <Link href="/" className="p-2 rounded-md hover:bg-background/50 w-full text-sm text-center">New Session</Link>
      <hr className="my-2" />
      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <Link key={session.id} href={`/${session.id}`} className="p-2 rounded-md hover:bg-background/50 w-full text-sm">
            {session.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
