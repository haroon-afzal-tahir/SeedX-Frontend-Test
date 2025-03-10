export default function Home() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">What would you like to do?</h1>
      <div className="bg-sidebar rounded-lg w-full relative">
        <input type="text" placeholder="Enter your message" className="w-full p-4 rounded-md outline-0" />
      </div>
    </div>
  );
}
