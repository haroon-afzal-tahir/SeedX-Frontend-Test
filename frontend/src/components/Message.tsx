export const Message = ({ message }: { message: Message }) => {
  const isUser = message.isUser;
  return (
    <div className={`flex flex-col bg-sidebar rounded-full px-3 py-2 text-sm max-w-60 ${isUser ? "self-end" : "self-start"}`}>
      <p>{message.content}</p>
    </div>
  )
}
