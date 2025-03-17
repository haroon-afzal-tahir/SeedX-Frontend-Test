import { IoLocationOutline, IoNavigateOutline } from "react-icons/io5";

export const DealershipAddress = ({ output }: { output: string }) => {
  return (
    <div className="w-full bg-sidebar/50 hover:bg-sidebar/70 rounded-xl border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-1.5 rounded-full">
            <IoLocationOutline className="text-lg text-blue-500" />
          </div>
          <p className="text-sm text-foreground/90 font-medium">Dealership Location</p>
        </div>
      </div>

      {/* Address Content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 py-2.5 px-4 
          bg-background/50 rounded-lg hover:bg-background/80 transition-all duration-200 
          group cursor-pointer">
          <span className="text-sm text-foreground/90">{output}</span>
          <IoNavigateOutline className="text-blue-500/50 group-hover:text-blue-500 
            transition-colors duration-200" />
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-2 bg-background/50 border-t border-border/60">
        <p className="text-xs text-center text-foreground/60">
          Click to get directions to the dealership
        </p>
      </div>
    </div>
  );
};
