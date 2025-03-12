export const Message = ({ message, isComplete }: { message: Message, isComplete: boolean }) => {
  const isUser = message.isUser;

  return (
    <p className={`flex items-center bg-sidebar rounded-[1.5rem] px-4 py-3 text-sm max-w-60 text-wrap ${isUser ? "self-end" : "self-start"}`}>
      {message.content}
      {!isUser && !isComplete && (
        <div className="inline-block align-middle h-2.5 w-2.5 bg-gray-300 rounded-full ml-1" />
      )}
    </p>
  )
}
