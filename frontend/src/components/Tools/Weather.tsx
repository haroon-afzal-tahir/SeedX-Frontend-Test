import { TiWeatherCloudy } from "react-icons/ti";

export const Weather = ({ output }: { output: string }) => {
  return (
    <div className="inline-flex items-center gap-2.5 py-3 px-4 
      bg-sidebar/50 hover:bg-sidebar/70 rounded-lg border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm cursor-pointer select-none">
      <TiWeatherCloudy className="text-yellow-500 text-xl flex-shrink-0" />
      <div className="text-sm text-foreground/90 font-medium">
        {output.replace('\u00b0', '°')}
      </div>
    </div>
  );
};
