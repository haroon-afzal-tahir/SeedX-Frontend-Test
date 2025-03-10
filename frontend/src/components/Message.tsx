export const Message = ({ message }: { message: Message }) => {
  const isUser = message.isUser;
  return (
    <p className={`flex flex-col bg-sidebar rounded-[1.5rem] px-4 py-3 text-sm max-w-60 text-wrap ${isUser ? "self-end" : "self-start"}`}>
      {message.content}
    </p>
  )
}
