export const Message = ({ message, assistantMessageId, isComplete }: { message: Message, assistantMessageId: string, isComplete: boolean }) => {
  const isUser = message.isUser;

  return (
    <div className={`items-center rounded-[1.5rem] px-4 py-3 text-sm text-wrap ${isUser ? "self-end bg-sidebar max-w-96" : "self-start bg-transparent"}`}>
      {message.content}
      {!isUser && !isComplete && assistantMessageId === message.id && (
        <div className="inline-block align-middle h-2.5 w-2.5 bg-gray-300 rounded-full ml-1 shrink-0" />
      )}
    </div>
  )
}
