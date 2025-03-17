import { IoLocationOutline } from "react-icons/io5";

export const DealershipAddress = ({ output }: { output: string }) => {
  return (
    <div className="inline-flex items-center gap-2 text-foreground/90 text-sm py-3 px-4 
      rounded-lg bg-sidebar/50 hover:bg-sidebar/70 border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm cursor-pointer select-none">
      <IoLocationOutline className="text-blue-500 text-lg flex-shrink-0" />
      <span>{output}</span>
    </div>
  );
};
