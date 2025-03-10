import { PiPaperPlaneRightFill } from "react-icons/pi";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">What would you like to do?</h1>
      <div className="bg-sidebar rounded-lg w-full relative p-3">
        <input type="text" placeholder="Enter your message" className="w-full rounded-md outline-0 pr-12" />
        <button className="bg-foreground p-2 rounded-md absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
          <PiPaperPlaneRightFill className="text-background" />
        </button>
      </div>
    </div>
  );
}
